import React from 'react';
import { connect } from 'react-redux';
import Fix from './Fix';
import { fetchFixTask } from '../../../actions/taskActions';

/**
 *
 * This class is for fetching the chosen edit and respective patch to be used
 * for the Fix task. The information is collected here and passed
 * down as props, because they should NOT change in the same way that the state
 * changes through user interaction.
 *
 */

class FixPropWrapper extends React.Component {

  state = {
    loading    : true,
    chosenEdit : -1,
    patch      : []
  }

  componentWillMount() {
    let { excerpt, fetchFixTask } = this.props;

    fetchFixTask(excerpt.id)
      .then(
        res => {
          let { chosenEdit, patch } = res.data.taskInfo;
          this.setState({
            loading : false,
            chosenEdit,
            patch
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
                          patch={this.state.patch}
                        />
    return (this.state.loading) ? <div>Loading...</div> : fixComponent;
  }

}

FixPropWrapper.propTypes = {
  excerpt         : React.PropTypes.object.isRequired,
  fetchFixTask : React.PropTypes.func.isRequired
};

export default connect(null, { fetchFixTask })(FixPropWrapper);