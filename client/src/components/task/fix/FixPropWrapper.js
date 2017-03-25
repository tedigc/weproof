import React from 'react';
import { connect } from 'react-redux';
import { Dimmer, Loader } from 'semantic-ui-react';
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

    let { loading, chosenEdit, patch } = this.state;
    let { excerpt } = this.props;

    let fixComponent = (
      <Fix 
        excerpt={excerpt} 
        chosenEdit={chosenEdit} 
        patch={patch}
      />
    );

    let loadingComponent = (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );
    
    return (loading) ? loadingComponent : fixComponent;
  }

}

FixPropWrapper.propTypes = {
  excerpt      : React.PropTypes.object.isRequired,
  fetchFixTask : React.PropTypes.func.isRequired
};

export default connect(null, { fetchFixTask })(FixPropWrapper);