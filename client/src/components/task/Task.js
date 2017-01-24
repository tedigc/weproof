import React from 'react';
import { connect } from 'react-redux';
import TaskFind from './find/TaskFind';
import { fetchSingleExcerpt } from '../../actions/excerptActions';

/**

TODO:

- loading
- display errors
- redirect button if error occurs
- validate param type before making get request (check its an int)

*/

class Task extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      excerpt: {}
    };
  }

  componentWillMount() {
    this.props.fetchSingleExcerpt(this.props.params.excerptId)
      .then(
        (res) => {
          this.setState({
            excerpt: res.data.excerpt
          })
        },
        (err) => {
          console.error(err);
        }
      );
  }

  render() {
    return (
      <div style={{ marginTop: '60px'}}>
        <TaskFind id={this.state.excerpt.id} excerpt={this.state.excerpt.excerpt} />
      </div>
    );
  }

}

Task.propTypes = {
  fetchSingleExcerpt : React.PropTypes.func.isRequired
};

export default connect(null, { fetchSingleExcerpt })(Task);