import merge from './merge';

const MINIMUM_SUBMISSIONS_REQUIRED = 10;

// calculate rough, unadjusted patches. these may start or end in the middle of words
export function calculateRoughPatches(heatmap, cutoff) {
  let maxHeat = Math.max.apply(Math, heatmap);
  
  if(maxHeat < cutoff) {
    return [];
  } else {
    let roughPatches = [];
    let leftIdx  = -1;
    let rightIdx = -1;

    for(let i=0; i<heatmap.length; i++) {
      if(heatmap[i] >= cutoff) {
          if(leftIdx < 0) leftIdx = i;    // if starting a new patch, set the left index
          else continue;                  // else, just continue searching for the end of the patch
      } else {
        if(leftIdx < 0) continue;         // if we weren't mid-patch, just continue
        else {                            // else end the patch
          // set and push the patch
          rightIdx = i-1;
          roughPatches.push([leftIdx, rightIdx]);

          // reset the indices, so we're ready to search for the next patch
          leftIdx  = -1;
          rightIdx = -1;
        }
      }

    }
    return roughPatches;
  }
}

export function calculateFinalPatches(body, roughPatches) {
  let finalPatches = [];
  for(let patch of roughPatches) {

    // march left
    let leftIdx  = patch[0];
    let char = body[leftIdx];
    while(char !== ' ' && leftIdx > 0) {
      leftIdx--;
      char = body[leftIdx];
    }
    if(char === ' ') leftIdx;

    // march rightIdx
    let rightIdx = patch[1]-1;
    char = body[rightIdx];
    while(char !== ' ' && rightIdx < body.length) {
      rightIdx++;
      char = body[rightIdx];
    }
    if(char === ' ') rightIdx++;

    finalPatches.push([leftIdx, rightIdx]);
  }
  return finalPatches;
}

export default function(nTasks, body, heatmap) {

  if(nTasks < MINIMUM_SUBMISSIONS_REQUIRED) return [];

  let cutoff = nTasks * 0.2;  // 20% of users should agree on patches

  let roughPatches = calculateRoughPatches(heatmap, cutoff);

  if(roughPatches.length >= 2) {
    let finalPatches = calculateFinalPatches(body, roughPatches);
    let mergedPatches = merge(finalPatches);
    return mergedPatches;
  } else {
    return [];
  }
}

export function aggregateTest(body, heatmap) {

  let nTasks = 10;
  let cutoff = nTasks * 0.2;

  let roughPatches = calculateRoughPatches(heatmap, cutoff);

  if(roughPatches.length >= 2) {
    let finalPatches = calculateFinalPatches(body, roughPatches);
    let mergedPatches = merge(roughPatches);
    return mergedPatches;
  } else {
    return [];
  }
}