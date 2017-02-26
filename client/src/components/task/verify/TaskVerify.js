import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Label, Segment, TextArea } from 'semantic-ui-react';
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

class TaskVerify extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showOriginal: true,
      chosenEdit: -1,
      correction: ''
    };
  }

  componentWillMount() {
    
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>

        <Grid>
          <Grid.Row>

            {/* Excerpt window */}
            <Grid.Column width={10}>
              <Segment size="large" style={styles.excerpt}>
                {this.props.excerpt}
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
              <span style={{ color: 'gray' }}>The box on the left contains an excerpt of text. The segment highlighted in blue has been identified as possible containing a mistake in grammar or that spelling. Correct any such mistakes by editing the text in the box on the right. If you wish to revert the text to its original value, click the grey "Restore Original Text" button underneith the text box to the right.</span>
              <br/>
              <br/>
              <Button floated='right' type='submit' primary>Submit</Button>
            </Grid.Column>
          </Grid.Row>

        </Grid>

      </Form>
    );
  }

}

TaskVerify.propTypes = {
  excerpt    : React.PropTypes.object.isRequired,
  submitTask : React.PropTypes.func.isRequired
};

TaskVerify.contextTypes = {
  router : React.PropTypes.object.isRequired
};

export default connect(null, { submitTask })(TaskVerify);