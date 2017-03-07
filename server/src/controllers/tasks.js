import express from 'express';
import authenticate from '../middlewares/authenticate';
import { Excerpt, Task, TaskFind, TaskFix } from '../db/models';
import { submitFindTask, submitFixTask, submitVerifyTask } from './util/tasksubmit';

var router = express.Router();

// Fetch all tasks submitted by the current user
//
router.get('/:filter', authenticate, (req, res) => {

  let filter = req.params.filter;
  let status = (filter === 'all') ? undefined : filter;

  Task
    .query({
      where: { owner_id: req.currentUser.attributes.id }
    })
    .fetchAll({
      withRelated: [{ 'excerpt' : qb => {
        qb.column('id', 'title', 'excerpt', 'status'); 
      }}],
    })
    .then(tasks => {
      let tasksFiltered = [];
      for(let i=0; i<tasks.models.length; i++) {
        let item = tasks.models[i];
        if(filter === 'all' || item.relations.excerpt.attributes.status === status) {
          tasksFiltered.push(item);
        }
      }
      res.json({ tasksFiltered });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

// Submit a task and write it to the database
//
router.post('/', authenticate, (req, res) => {

  let excerptId = req.body.excerptId;
  let taskType = req.body.taskType;

  Excerpt
    .query({
      where: { id: excerptId },
      select: ['id', 'title', 'excerpt', 'heatmap']
    })
    .fetch()
    .then((excerpt) => {
      if(!excerpt) {
        res.status(500).json({ error: "No such excerpt" });
      } else {

        if(taskType === "find")   submitFindTask(req, res, excerpt);
        if(taskType === "fix")    submitFixTask(req, res, excerpt);
        if(taskType === "verify") submitVerifyTask(req, res, excerpt);

      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });

});

// Get all tasks available for completion to the logged in user
//
router.get('/available/:filter', authenticate, (req, res) => {

  // Find all the excerpt ids of task submissions the user has made
  Task
    .query({
      where : { owner_id : req.currentUser.id },
      select: [ 'excerpt_id' ]
    })
    .fetchAll()
    .then((taskSubmissions) => {

      var submittedTaskExcerptIDs = [];
      for(var j=0; j<taskSubmissions.models.length; j++) {
        submittedTaskExcerptIDs.push(taskSubmissions.models[j].attributes.excerpt_id);
      }

      // exclude any excerpts that the user has already submitted a task for

      let filter = req.params.filter;
      let stage = (filter === 'all') ? undefined : filter;

      Excerpt
        .query((qb) => {
          if(stage !== undefined) {
            qb
              .where('id', 'not in', submittedTaskExcerptIDs)
              .andWhere('owner_id', '!=', req.currentUser.id )
              .andWhere('stage', stage);
          } else {
            qb
              .where('id', 'not in', submittedTaskExcerptIDs)
              .andWhere('owner_id', '!=', req.currentUser.id );
          }
          
        })
        .fetchAll()
        .then((excerpts) => {

          var tasks = [];
          for(var i=0; i<excerpts.models.length; i++) {
            tasks.push(excerpts.models[i].attributes);
          }
          res.status(200).json(tasks);

        });

    });
});

// Get all the necessary information needed for a new fix task
//
router.get('/:excerptId/fix', authenticate, (req, res) => {

  TaskFind
    .query({
      where  : { excerpt_id : req.params.excerptId }
    })
    .fetchAll({
      withRelated: [{ 'excerpt' : qb => {
        qb.column('id', 'excerpt', 'status', 'recommended_edits'); 
      }}],
    })
    .then(tasks => {

      // let chosenEdit = -1;
      // let correction = '';
      // for each (model in tasks.models) {
      //
      //   /* here is where the chosen_edit and correction would be made */
      // 
      // }

      let attributes = tasks.models[0].attributes;
      let relations  = tasks.models[0].relations;

      // here, use an algorithm to determine which recommended edit to use.
      let chosenEdit = 0;
      let pair = relations.excerpt.attributes.recommended_edits[chosenEdit];
      let excerpt = relations.excerpt.attributes;

      let taskInfo = {
        chosenEdit,
        pair,
        excerpt
      };

      res.json({ taskInfo });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

// Get all the necessary information needed for a new verify task
//
router.get('/:excerptId/verify', authenticate, (req, res) => {

  TaskFix
    .query({
      where  : { excerpt_id : req.params.excerptId }
    })
    .fetchAll({
      withRelated: [{ 'excerpt' : qb => {
        qb.column('id', 'excerpt', 'status', 'recommended_edits'); 
      }}],
    })
    .then(tasks => {

      // let chosenEdit = -1;
      // let correction = '';
      // for each (model in tasks.models) {
      //
      //   /* here is where the chosen_edit and correction would be made */
      // 
      // }

      let attributes = tasks.models[0].attributes;
      let relations  = tasks.models[0].relations;

      let taskInfo = {
        chosenEdit : attributes.chosen_edit,
        correction : attributes.correction,
        excerpt    : relations.excerpt,
        pair       : relations.excerpt.attributes.recommended_edits[attributes.chosen_edit]
      };

      res.json({ taskInfo });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: err });
    });

});

router.post('/aggregate', (req, res) => {

  let excerptId = req.body.excerptId;
  let taskType = req.body.taskType;

  Excerpt
    .query({
      where: { id: excerptId },
      select: ['id', 'title', 'excerpt', 'heatmap']
    })
    .fetch()
    .then((excerpt) => {
      if(!excerpt) {
        res.status(500).json({ error: "No such excerpt" });
      } else {

        let attributes = excerpt.attributes;

        let heatmap = excerpt.attributes.heatmap;
        let maxHeat = Math.max.apply(Math, heatmap);
        let nSubmissions = 10;
        let cutoff = nSubmissions * 0.2;

        if(maxHeat >= cutoff) {

          // find rough patches
          let roughPatches = [];
          let leftIdx  = -1;
          let rightIdx = -1;

          console.info('> calculating rough patches');

          for(let i=0; i<attributes.excerpt.length; i++) {
            if(heatmap[i] >= cutoff) {
              if(leftIdx < 0) leftIdx = i;    // if starting a new patch, set the left index
              else continue;                  // else, just continue searching for the end of the patch
            } else {
              if(leftIdx < 0) continue;       // if we weren't mid-patch, just continue
              else {                          // else end the patch

                // set and push the patch
                rightIdx = i-1;
                roughPatches.push([leftIdx, rightIdx]);

                // reset the indices, so we're ready to search for the next batch
                leftIdx  = -1;
                rightIdx = -1;

              }
            }
          }
          
          console.log(roughPatches);

          if(roughPatches.length >= 2) {
            // calculate final patches
            // simply march from either end of the rough patches until you find a space
            let finalPatches = [];
            for(let patch of roughPatches) {

              // march left
              let leftIdx  = patch[0];
              let char = attributes.excerpt[leftIdx];
              while(char !== ' ' && leftIdx > 0) {
                leftIdx--;
                char = attributes.excerpt[leftIdx];
              }
              if(char === ' ') leftIdx++;

              // march rightIdx
              let rightIdx = patch[1];
              char = attributes.excerpt[rightIdx];
              while(char !== ' ' && rightIdx < attributes.excerpt.length) {
                rightIdx++;
                char = attributes.excerpt[rightIdx];
              }
              if(char === ' ') rightIdx--;

              finalPatches.push([leftIdx, rightIdx]);
            }

            console.log(finalPatches);
            console.log(mergePatches(finalPatches));
            
            // merge final patches if necessary

            // progress to fix stage
          } else {
            // return to 'find' stage
          }
        } else {
          // return to 'find' stage
        }

        res.json({ heatmap });

      }
    });

});

export default router;

function mergePatches(patches) {
  
  function comparator(a, b) {
    if(a[0] < b[0]) return -1;
    if(a[0] > b[0]) return  1;
    else return 0;
  }

  // sort patches based on left index
  patches = patches.sort(comparator);

  let merged = [];
  let currentPair = patches[0];
  for(let i=0; i<patches.length; i++) {
    if(currentPair[1] >= patches[i][0]) {
      // pairs overlap
      currentPair[1] = Math.max(currentPair[1], patches[i][1]);
    } else {
      merged.push(currentPair);
      currentPair = patches[i];
    }
  }
  merged.push(currentPair);

  return patches;
}