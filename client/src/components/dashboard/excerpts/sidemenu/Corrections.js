import React from 'react';
import { Checkbox, Header, Label, Menu } from 'semantic-ui-react';

const MAX_PREVIEW_LENGTH = 8;

const styles = {
  rejected : {
    backgroundColor : '#ffc4d3'
  },
  rejectedActive : {
    backgroundColor : '#DFB3BE'
  }
};

class Corrections extends React.Component {

  state = {
    selectedCorrection : -1,
    showRejected       : false
  }

  constructor(props) {
    super(props);
    this.setSelectedCorrection  = this.setSelectedCorrection.bind(this);
    this.getFilteredCorrections = this.getFilteredCorrections.bind(this);
  }

  componentWillMount() {
    let { accepted, tasksFix } = this.props;
    if(accepted && tasksFix.length > 0) {
      this.setSelectedCorrection(0);
    }
  }

  componentWillUnmount() {
    this.setSelectedCorrection(-1);
  }

  setSelectedCorrection(selectedCorrection) {
    this.setState({ selectedCorrection });
    this.props.setSelectedCorrectionParent(selectedCorrection);
  } 

  getFilteredCorrections() {

    let { selectedCorrection, showRejected } = this.state;
    let { nRecommendedEdits, tasksFix, tasksVerify } = this.props;

    // count the votes for each correction
    let totalVotes = new Array(nRecommendedEdits).fill([]);
    let voteCounter = new Array(nRecommendedEdits).fill(0);

    for(let verify of tasksVerify) {
      let chosenEdit = verify.chosen_edit;
      let votes = verify.votes;

      // initialize the array of votes if it hasn't been initalized yet
      if(totalVotes[chosenEdit].length === 0) {
        if(votes.length === 0) continue;
        else {
          totalVotes[chosenEdit] = new Array(votes.length).fill(0);
        }
      }

      // count the votes
      for(let i=0; i<votes.length; i++) {
        totalVotes[chosenEdit][i] += (votes[i]) ? 1 : 0;
      }
      voteCounter[chosenEdit]++;
    }

    let corrections = [];

    let comparator = function(a, b) {
      if (a.chosen_edit < b.chosen_edit)
        return -1;
      if (a.chosen_edit > b.chosen_edit)
        return 1;
      return 0;
    }

    tasksFix.sort(comparator);

    tasksFix.forEach((task, i) => {

      let idx = i % totalVotes[task.chosen_edit].length;

      // count the votes
      let votesAccept = totalVotes[task.chosen_edit][idx];
      let votesReject = voteCounter[task.chosen_edit] - votesAccept;

      // don't show the correction if rejects > accepts
      if(!showRejected) 
        if(votesReject > votesAccept) return;

      let style;
      if(votesReject > votesAccept) {
        if(i === selectedCorrection) style = styles.rejectedActive;
        else                         style = styles.rejected;
      }

      let correctionPreview = (task.correction.length > MAX_PREVIEW_LENGTH) ? task.correction.slice(0, MAX_PREVIEW_LENGTH) + '...' : task.correction;
      let correction = (
        <Menu.Item 
          key={i} 
          active={i === selectedCorrection} 
          onClick={() => { this.setSelectedCorrection(i); }}
          style={style}
          activeStyle={{}}
        >
          {correctionPreview}
          <Label color='red'>{votesReject}</Label>
          <Label color='green'>{votesAccept}</Label>
        </Menu.Item>
      );

      corrections.push(correction);
      
    });

    return corrections;

  }

  render() {

    let corrections = this.getFilteredCorrections();

    return (
      <div>
        <Header content='Corrections'/>
        <Checkbox label='Show rejected "corrections"' onChange={(e, data) => { this.setState({ showRejected : data.checked })}}/>
        <Menu vertical secondary>
          {corrections}
        </Menu>
      </div>
    );
  }

}

Corrections.propTypes = {
  nRecommendedEdits           : React.PropTypes.number.isRequired,
  accepted                    : React.PropTypes.bool.isRequired,
  tasksFix                    : React.PropTypes.array.isRequired,
  tasksVerify                 : React.PropTypes.array.isRequired,
  setSelectedCorrectionParent : React.PropTypes.func.isRequired
};

export default Corrections;