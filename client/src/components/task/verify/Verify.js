import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Icon, Label, Segment } from 'semantic-ui-react';
import { submitTask } from '../../../actions/taskActions';
import Instructions from '../common/Instructions';

const excerptHeight = 320;
const buttonBarHeight = 70;

const styles = {
  highlight : {
    background: '#c1d5ff',
    color: '#283f70'
  },
  highlightOriginal : {
    background: '#dfdfdf',
    color: '#6e6e6e'
  },
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

class Verify extends React.Component {

  state = {
    showOriginal : true,
    acceptReject : null
  }

  constructor(props) {
    super(props);
    this.toggleShowOriginal = this.toggleShowOriginal.bind(this);
    this.getHighlightedText = this.getHighlightedText.bind(this);
    this.acceptedOrRejected = this.acceptedOrRejected.bind(this);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  toggleShowOriginal(e) {
    e.preventDefault();
    this.setState({ showOriginal: !this.state.showOriginal});
  }

  getHighlightedText() {
    let excerpt = this.props.excerpt.excerpt;
    let pair = this.props.pair;
    let original = excerpt.slice(pair[0], pair[1]);
    let highlight = (this.state.showOriginal) ? original : this.props.correction;
    let style     = (this.state.showOriginal) ? styles.highlightOriginal : styles.highlight;
    return (
      <div id="excerpt">
        {excerpt.slice(0, pair[0])}
        <mark className="highlight" style={style}>
          {highlight}
        </mark>
        {excerpt.slice(pair[1], excerpt.length)}
      </div>
    );
  }

  acceptedOrRejected() {
    let { acceptReject } = this.state;
    return acceptReject === 'accept' || acceptReject === 'reject';
  }

  accept(e) {
    e.preventDefault();
    this.setState({ acceptReject : 'accept' });
  }

  reject(e) {
    e.preventDefault();
    this.setState({ acceptReject : 'reject' });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitTask({
      excerptId  : this.props.excerpt.id, 
      chosenEdit : this.state.chosenEdit,
      correction : this.state.correction, 
      taskType   : "verify",
      accepted   : this.state.acceptReject === 'accept'
    })
      .then(
        res => { this.context.router.push('/dashboard/home'); },
        err => { console.log(err); }
      );
  }

  render() {

    let buttonText         =  (this.state.showOriginal) ? 'Original' : 'Edited';
    let buttonTextOpposite = !(this.state.showOriginal) ? 'Original' : 'Edited';
    let submitDisabled = !this.acceptedOrRejected();

    return (
      <Form onSubmit={this.handleSubmit}>
        <Grid>
          <Grid.Row>

            {/* Excerpt window */}
            <Grid.Column width={10}>
              <Segment size="large" style={styles.excerpt}>
                {this.getHighlightedText()}
                <Label attached='bottom left'>Excerpt - {buttonText}</Label>          
              </Segment>

            </Grid.Column>

            {/* Buttons */}
            <Grid.Column width={6}>

              <div style={{ display: 'flex', flexDirection: 'column', height: excerptHeight+buttonBarHeight}}>

                <Instructions text='The box on the left shows an excerpt submitted by a user for correction. By clicking the grey button, you can toggle whether it will show the original or edited version. Read both the original and edited versions of the excerpt and decide whether you want to accept or reject the proposed changes to the text.'/>

                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 2, marginTop: '20px'}}>
                  
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display : 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      
                      <Button name='rejectButton' style={{ flexGrow: 1 }} size='massive' basic={this.state.acceptReject !== 'reject'} onClick={this.reject} negative>
                        Reject &nbsp; <Icon name='remove'/> 
                      </Button>
                      <Button name='acceptButton'style={{ flexGrow: 1 }} size='massive' basic={this.state.acceptReject !== 'accept'} onClick={this.accept} positive>
                        Accept &nbsp; <Icon name='check'/> 
                      </Button>

                    </div>
                    <br/>
                    <Button fluid onClick={this.toggleShowOriginal}>View {buttonTextOpposite} Text</Button>
                  </div>

                  <Button floated='right' type='submit' disabled={submitDisabled} primary>Submit</Button>
                </div>

              </div>
              
            </Grid.Column>
          </Grid.Row>


        </Grid>
      </Form>
    );
  }

}

Verify.propTypes = {
  excerpt    : React.PropTypes.object.isRequired,
  chosenEdit : React.PropTypes.number.isRequired,
  correction : React.PropTypes.string.isRequired,
  pair       : React.PropTypes.array.isRequired,
  submitTask : React.PropTypes.func.isRequired
};

Verify.contextTypes = {
  router : React.PropTypes.object.isRequired
};

export default connect(null, { submitTask })(Verify);