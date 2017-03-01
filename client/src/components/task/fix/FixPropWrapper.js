import React from 'react';
import { connect } from 'react-redux';
import Fix from './Fix';
import { fetchFixTask } from '../../../actions/taskActions';

/**
 *
 * This class is for fetching the chosen edit and respective pair to be used
 * for the Fix task. The information is collected here and passed
 * down as props, because they should NOT change in the same way that the state
 * changes through user interaction.
 *
 */

class FixPropWrapper extends React.Component {

  state = {
    loading    : true,
    chosenEdit : -1,
    pair       : []
  }

  componentWillMount() {
    let { excerpt, fetchFixTask } = this.props;

    fetchFixTask(excerpt.id)
      .then(
        res => {
          let { chosenEdit, pair } = res.data.taskInfo;
          this.setState({
            loading : false,
            chosenEdit,
            pair
          });
        },
        err => {
          console.error(err);
          this.setState({ loading: false });
        });
  }

  render() {
    let fixComponent = <Fix 
                          excerpt={this.props.excerpt} 
                          chosenEdit={this.state.chosenEdit} 
                          pair={this.state.pair}
                        />
    let display = (this.state.loading) ? <div>Loading...</div> : fixComponent;
    return (
      display
    );
  }

}

FixPropWrapper.propTypes = {
  excerpt         : React.PropTypes.object.isRequired,
  fetchFixTask : React.PropTypes.func.isRequired
};

export default connect(null, { fetchFixTask })(FixPropWrapper);