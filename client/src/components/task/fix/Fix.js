import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Label, Segment, TextArea } from 'semantic-ui-react';
import Instructions from '../common/Instructions';
import { submitTask } from '../../../actions/taskActions';

const excerptHeight = 250;
const buttonBarHeight = 70;

const styles = {
  highlight : {
    background: '#c1d5ff',
    color: '#283f70'
  },
  selected   : { background: '#fcfcfc' },
  unselected : { background: '#ffffff' },
  excerpt : {
    height: excerptHeight + buttonBarHeight,
    lineHeight: "30px"
  },
  highlightMenu : {
    height: excerptHeight
  },
  buttonBar : {
    height : buttonBarHeight,
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'flex-end'
  },
  itemGroupDiv : {
    height: excerptHeight - 20,
    overflowY: 'auto',
    overflowX: 'hidden'
  }
};

class Fix extends React.Component {

  constructor(props) {
    super(props);

    let { excerpt, pair } = this.props;
    let correction = excerpt.excerpt.slice(pair[0], pair[1]);
    this.state = { correction };

    this.getHighlightedText = this.getHighlightedText.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.restoreDefault = this.restoreDefault.bind(this);
  }

  getHighlightedText() {
    let { excerpt, pair } = this.props;
    let originalText = excerpt.excerpt;
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
      excerpt    : excerpt.excerpt,
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
    let correction = excerpt.excerpt.slice(pair[0], pair[1]);
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

            {/* Highlight window */}
            <Grid.Column width={6}>

              <TextArea name="editTextArea" style={styles.highlightMenu} value={this.state.correction} onChange={this.handleChange}/>
              <div style={styles.buttonBar}>
                <Button onClick={this.restoreDefault} >Restore Original Text</Button>
              </div>
              
            </Grid.Column>

          </Grid.Row>

          <Instructions text='The box on the left contains an excerpt of text. The segment highlighted in blue has been identified as possible containing a mistake in grammar or that spelling. Correct any such mistakes by editing the text in the box on the right. If you wish to revert the text to its original value, click the grey "Restore Original Text" button underneith the text box to the right.'/>
          <Button floated='right' type='submit' primary>Submit</Button>

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