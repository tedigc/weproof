import React from 'react';
import { connect } from 'react-redux';
import { Container, Dimmer, Loader, Segment } from 'semantic-ui-react';
import TaskFind from './find/TaskFind';
import { fetchSingleExcerpt } from '../../actions/excerptActions';

/**

TODO:

- display errors
- validate param type before making get request (check its an int)

*/


const styles = {
  backgroundDiv : {
    backgroundColor: "#A0A0A0"
  }
}

class Task extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      excerpt: {}
    };
  }

  componentWillMount() {
    this.props.fetchSingleExcerpt(this.props.params.excerptId)
      .then(
        (res) => {
          this.setState({
            loading: false,
            excerpt: res.data.excerpt
          });
        },
        (err) => {
          if(err.response.status === 404) {
            this.context.router.push('/404');
          } else {
            // other errors
            console.error(err);
          }
        }
      );
  }

  render() {
    var display;
    if(this.state.loading) {
      display = (
        <Dimmer active> 
          <Loader active inline='centered'/> 
        </Dimmer> 
      );
    } else {
      display = (
        <Container style={styles.backgroundDiv}>
          <Segment style={{ marginTop: '60px'}}>
            <TaskFind id={this.state.excerpt.id} excerpt={this.state.excerpt.excerpt} />
          </Segment>
        </Container>
      );
    }

    return display;
  }

}

Task.propTypes = {
  fetchSingleExcerpt : React.PropTypes.func.isRequired
};

Task.contextTypes = {
  router : React.PropTypes.object.isRequired
};

export default connect(null, { fetchSingleExcerpt })(Task);