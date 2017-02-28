import React from 'react';
import { connect } from 'react-redux';
import Verify from './Verify';
import { fetchVerifyTask } from '../../../actions/taskActions';

/**
 *
 * This class is for fetching the chosen edit and correction to be used
 * for the Verify task. The information is collected here and passed
 * down as props, because they should NOT change in the same way that the state
 * changes through user interaction.
 *
 */

class VerifyPropWrapper extends React.Component {

  state = {
    loading    : true,
    chosenEdit : -1,
    correction : '',
    pair       : []
  }

  componentWillMount() {
    let { excerpt, fetchVerifyTask } = this.props;

    fetchVerifyTask(excerpt.id)
      .then(
        res => {
          let { chosenEdit, correction, pair } = res.data.taskInfo;

          this.setState({
            loading : false,
            chosenEdit,
            correction,
            pair
          });

        },
        err => {
          console.error(err);
          this.setState({ loading: false });
        });

  }

  render() {
    let verifyComponent = <Verify 
                            excerpt={this.props.excerpt} 
                            chosenEdit={this.state.chosenEdit} 
                            correction={this.state.correction}
                            pair={this.state.pair}
                          />
    let display = (this.state.loading) ? <div>Hello</div> : verifyComponent;
    return (
      display
    );
  }

}

VerifyPropWrapper.propTypes = {
  excerpt         : React.PropTypes.object.isRequired,
  fetchVerifyTask : React.PropTypes.func.isRequired
};

export default connect(null, { fetchVerifyTask })(VerifyPropWrapper);