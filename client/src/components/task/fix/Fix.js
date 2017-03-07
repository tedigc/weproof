import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Label, Segment, TextArea } from 'semantic-ui-react';
import Instructions from '../common/Instructions';
import { submitTask } from '../../../actions/taskActions';

const excerptHeight   = 400;
const textAreaHeight  = 160;
const buttonGroupHeight = 100;

const styles = {
  highlight : {
    background: '#c1d5ff',
    color: '#283f70'
  },
  excerpt : {
    height     : excerptHeight,
    lineHeight : "30px"
  },
  textArea : {
    height    : textAreaHeight,
    marginTop : 10
  },
  buttonGroup : {
    height : buttonGroupHeight,
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between',
    marginTop: 30
  }
};

class Fix extends React.Component {

  constructor(props) {
    super(props);

    let { excerpt, pair } = this.props;
    let correction = excerpt.body.slice(pair[0], pair[1]);
    this.state = { correction };

    this.getHighlightedText = this.getHighlightedText.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.restoreDefault = this.restoreDefault.bind(this);
  }

  getHighlightedText() {
    let { excerpt, pair } = this.props;
    let originalText = excerpt.body;
    return (
      <div id="excerpt">
        {originalText.slice(0, pair[0])}
        <mark className="highlight" style={styles.highlight}>
          {this.state.correction}
        </mark>
        {originalText.slice(pair[1], originalText.length)}
      </div>
    );
  }

  handleChange(e) {
    e.preventDefault();
    if(e.target.name === "editTextArea") {
      this.setState({ correction : e.target.value });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    let { excerpt, chosenEdit } = this.props;
    let { correction } = this.state;
    this.props.submitTask({
      excerptId  : excerpt.id, 
      excerpt    : excerpt.body,
      chosenEdit : chosenEdit,
      correction : correction, 
      taskType   : "fix" 
    })
      .then(
        res => { this.context.router.push('/dashboard/home'); },
        err => { console.log(err); }
      );
  }

  restoreDefault(e) {
    e.preventDefault();
    let { pair, excerpt } = this.props;
    let correction = excerpt.body.slice(pair[0], pair[1]);
    this.setState({ correction });
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <Grid>
          <Grid.Row>

            {/* Excerpt window */}
            <Grid.Column width={10}>
              <Segment size="large" style={styles.excerpt}>
                {this.getHighlightedText()}
                <Label attached='bottom left'>Excerpt</Label>          
              </Segment>
            </Grid.Column>

            {/* Input Window */}
            <Grid.Column width={6}>
              <div style={{ display: 'flex', flexDirection: 'column', height: excerptHeight }}>
                <Instructions style={{ marginTop: 10 }} text='The box on the left shows an excerpt of text. The section highlighted in blue may contain an error. Read the excerpt, and if you think the wording, grammar or spelling could use improvement, make changes in the text box below. Revert your changes with the grey "Restore" button.'/>
                <TextArea name="editTextArea" style={styles.textArea} value={this.state.correction} onChange={this.handleChange}/>
                <div style={styles.buttonGroup}>
                  <Button fluid onClick={this.restoreDefault} >Restore Original Text</Button>
                  <Button fluid type='submit' style={{ backgroundColor: '#4096BE' }}>Submit</Button>
                </div>
              </div>
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </Form>
    );
  }

}

Fix.propTypes = {
  excerpt    : React.PropTypes.object.isRequired,
  chosenEdit : React.PropTypes.number.isRequired,
  pair       : React.PropTypes.array.isRequired,
  submitTask : React.PropTypes.func.isRequired
};

Fix.contextTypes = {
  router : React.PropTypes.object.isRequired
};

export default connect(null, { submitTask })(Fix);