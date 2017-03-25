import React from 'react';
import { Checkbox, Header, Label, Menu } from 'semantic-ui-react';

const MAX_PREVIEW_LENGTH = 8;

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
    let { tasksFix, tasksVerify } = this.props;
    let corrections = [];

    tasksFix.forEach((task, i) => {
            
      // get the verify tasks for this correction
      let filteredTasksVerify = tasksVerify.filter(obj => {
        return parseInt(obj.tasks_fix_id, 10) === task.id;
      });

      // count the votes
      let votesAccept = 0;
      let votesReject = 0;
      for(let verify of filteredTasksVerify) {
        if(verify.accepted) votesAccept++;
        else                votesReject++;
      }

      // don't show the correction if rejects > accepts
      if(!showRejected) 
        if(votesReject > votesAccept) return;

      let correctionPreview = (task.correction.length > MAX_PREVIEW_LENGTH) ? task.correction.slice(0, MAX_PREVIEW_LENGTH) + '...' : task.correction;
      let correction = (
        <Menu.Item 
          key={i} 
          active={i === selectedCorrection} 
          onClick={() => { this.setSelectedCorrection(i); }}
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
  accepted                    : React.PropTypes.bool.isRequired,
  tasksFix                    : React.PropTypes.array.isRequired,
  tasksVerify                 : React.PropTypes.array.isRequired,
  setSelectedCorrectionParent : React.PropTypes.func.isRequired
};

export default Corrections;