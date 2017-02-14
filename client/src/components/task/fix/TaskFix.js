import React from 'react';
import { Button, Form, Grid, Label, Segment, TextArea } from 'semantic-ui-react';

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

class TaskFix extends React.Component {

  constructor(props) {
    super(props);
    let chosenEdit = Math.floor(Math.random() * this.props.excerpt.recommended_edits.length);
    let pair = this.props.excerpt.recommended_edits[chosenEdit];
    let correction = this.props.excerpt.excerpt.slice(pair[0], pair[1]);
    this.state = {
      chosenEdit,
      correction
    };
    this.getHighlightedText = this.getHighlightedText.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.restoreDefault = this.restoreDefault.bind(this);
  }

  getHighlightedText() {
    let original = this.props.excerpt.excerpt;
    let pair = this.props.excerpt.recommended_edits[this.state.chosenEdit];
    return (
      <div id="excerpt">
        {original.slice(0, pair[0])}
        <mark className="highlight" style={styles.highlight}>
          {this.state.correction}
        </mark>
        {original.slice(pair[1], original.length)}
      </div>
    );
  }

  handleChange(e) {
    e.preventDefault();
    if(e.target.name == "editTextArea") {
      this.setState({ correction : e.target.value });
    }
  }

  restoreDefault(e) {
    e.preventDefault();
    let pair = this.props.excerpt.recommended_edits[this.state.chosenEdit];
    let correction = this.props.excerpt.excerpt.slice(pair[0], pair[1]);
    this.setState({ correction : correction });
  }

  render() {
    return (
      <Form>

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

          <Grid.Row>
            <Grid.Column width={16}>
              <h3>Instructions</h3>
              <span style={{ color: 'gray' }}>Use your mouse to highlight portions of the above excerpt. Click the 'Highlight' button when you want to save it. Browse your saved highlights using the window on the right. You can delete individual highlights by pressing the circular 'x' button, or clear all highlights at once using the 'Clear All' button. When you are happy with the highlights you have saved, click submit to continue.</span>
              <br/>
              <Button floated="right" type='submit' primary>Submit</Button>
            </Grid.Column>
          </Grid.Row>

        </Grid>

      </Form>
    );
  }

}

TaskFix.propTypes = {
  excerpt : React.PropTypes.object.isRequired,
};

TaskFix.contextTypes = {
  router : React.PropTypes.object.isRequired
};

export default TaskFix;