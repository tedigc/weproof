import React from 'react';
import { connect } from 'react-redux';
import { Container, Dimmer, Loader, Segment } from 'semantic-ui-react';
import Find from './find/Find';
import FixPropWrapper from './fix/FixPropWrapper';
import VerifyPropWrapper from './verify/VerifyPropWrapper';
import { fetchSingleExcerptMin } from '../../actions/excerptActions';

/**
 * 
 * TODO:
 * 
 * - display errors
 * - validate param type before making get request (check its an int)
 *
 */

class Task extends React.Component {

  state = {
    loading: true,
    excerpt: {}
  }

  componentWillMount() {
    this.props.fetchSingleExcerptMin(this.props.params.excerptId)
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
          } else if(err.response.status === 403) {
            this.context.router.push('/403');
          } else {
            console.error(err);
          }
        }
      );
  }

  render() {
    let display;
    if(this.state.loading) {
      display = (
        <Dimmer active> 
          <Loader active inline='centered'/> 
        </Dimmer> 
      );
    } else {
      let task;

      if(this.state.excerpt.stage === 'find')   task = <Find   excerpt={this.state.excerpt} />;
      if(this.state.excerpt.stage === 'fix')    task = <FixPropWrapper    excerpt={this.state.excerpt} />;
      if(this.state.excerpt.stage === 'verify') task = <VerifyPropWrapper excerpt={this.state.excerpt} />;
      
      display = (
        <Container>
          <Segment style={{ marginTop: '40px'}}>
            {task}
          </Segment>
        </Container>
      );
    }

    return display;
  }

}

Task.propTypes = {
  fetchSingleExcerptMin : React.PropTypes.func.isRequired
};

Task.contextTypes = {
  router : React.PropTypes.object.isRequired
};

export default connect(null, { fetchSingleExcerptMin })(Task);