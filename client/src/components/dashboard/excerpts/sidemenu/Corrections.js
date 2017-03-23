import React from 'react';
import { Label, Header, Menu } from 'semantic-ui-react';

const MAX_PREVIEW_LENGTH = 8;

class Corrections extends React.Component {

  state = {
    selectedCorrection : -1
  }

  constructor(props) {
    super(props);
    this.setSelectedCorrection = this.setSelectedCorrection.bind(this);
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

  render() {
    let { selectedCorrection } = this.state;
    let { tasksFix } = this.props;

    return (
      <div>
        <Header content='Corrections'/>
        <Menu vertical secondary>
          {tasksFix.map((task, idx) => {
            let correctionPreview = (task.correction.length > MAX_PREVIEW_LENGTH) ? task.correction.slice(0, MAX_PREVIEW_LENGTH) + '...' : task.correction;
            return (
              <Menu.Item 
                key={idx} 
                active={idx === selectedCorrection} 
                onClick={() => { this.setSelectedCorrection(idx); }}
              >
                {correctionPreview}
              </Menu.Item>
            );
          })}
        </Menu>
      </div>
    );
  }

}

Corrections.propTypes = {
  accepted                    : React.PropTypes.bool.isRequired,
  tasksFix                    : React.PropTypes.array.isRequired,
  setSelectedCorrectionParent : React.PropTypes.func.isRequired
};

export default Corrections;