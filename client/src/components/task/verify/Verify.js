import React from 'react';
import { connect } from 'react-redux';
import { Button, Checkbox, Form, Grid, Item, Label, Segment } from 'semantic-ui-react';
import { submitTask } from '../../../actions/taskActions';
import Instructions from '../common/Instructions';

const excerptHeight     = 400;
const buttonGroupHeight = 150;

const styles = {
  highlight : {
    background : '#c1d5ff',
    color      : '#283f70'
  },
  highlightOriginal : {
    background : '#dfdfdf',
    color      : '#6e6e6e'
  },
  excerpt : {
    height: excerptHeight,
    lineHeight: "30px"
  },
  buttonGroup : {
    height : buttonGroupHeight,
    marginTop: 20,
    display: 'flex', 
    flexDirection: 'column', 
  }
};

class Verify extends React.Component {

  state = {
    currentlySelected : 0,
    accepted          : new Array(this.props.corrections.length).fill(false) 
  }

  constructor(props) {
    super(props);
    this.toggleShowOriginal = this.toggleShowOriginal.bind(this);
    this.getHighlightedText = this.getHighlightedText.bind(this);
    this.acceptedOrRejected = this.acceptedOrRejected.bind(this);
    this.accept = this.accept.bind(this);
    this.reject = this.reject.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMouseOver = this.handleMouseOver.bind(this);
    this.handleSelectCorrection = this.handleSelectCorrection.bind(this);
  }

  toggleShowOriginal(e) {
    e.preventDefault();
    this.setState({ showOriginal: !this.state.showOriginal});
  }

  getHighlightedText() {

    let { excerpt, patch, corrections } = this.props;
    let { currentlySelected } = this.state;

    let selectedCorrection = corrections[currentlySelected];
    let body = excerpt.body;
    let original = body.slice(patch[0], patch[1]);
    let highlight = (this.state.showOriginal) ? original : selectedCorrection;
    let style     = (this.state.showOriginal) ? styles.highlightOriginal : styles.highlight;

    return (
      <div id="excerpt">
        {body.slice(0, patch[0])}
        <mark className="highlight" style={style}>
          <span style={{ background: '#ffc4d3', color: '#992340', textDecoration: 'line-through' }}>{original}</span>
          <span style={{ background: '#c1d5ff', color: '#283f70' }}>{highlight}</span>
        </mark>
        {body.slice(patch[1], body.length)}
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
    console.log('submitty');
    this.props.submitTask({
      excerptId  : this.props.excerpt.id,
      taskType   : "verify",
      accepted   : this.state.acceptReject === 'accept',
      taskFixId  : this.props.taskFixId
    })
      .then(
        res => { this.context.router.push('/dashboard/home'); },
        err => { console.error(err); }
      );
  }

  handleMouseOver(idx) {

    this.setState({ currentlySelected : idx });
  }

  handleSelectCorrection(idx) {

    let { accepted } = this.state;
    accepted[idx] = !accepted[idx];
    this.setState({ accepted });
  }

  render() {

    let { corrections } = this.props;
    let { currentlySelected, accepted } = this.state;

    let correctionsComponent = (
      <Item.Group>
        {corrections.map((item, idx) => {
          return (
            <Item 
              key={idx} 
              onMouseEnter={() => { return this.handleMouseOver(idx) }} 
              onClick={() => { this.handleSelectCorrection(idx) }}
              style={(idx === currentlySelected) ? { cursor : 'pointer', backgroundColor : '#EEEEEE'} : { cursor : 'pointer', backgroundColor : '#FFFFFF' } }
            >
              <Item.Content>
                <Checkbox label={item} checked={accepted[idx]}/>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    );

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
              <div style={{ display: 'flex', flexDirection: 'column', height: excerptHeight}}>
                <Instructions text='The box on the left shows an excerpt submitted by a user for correction. By clicking the grey button, you can toggle whether it will show the original or edited version. Read both the original and edited versions of the excerpt and decide whether you want to accept or reject the proposed changes to the text.'/>
                <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 2, marginTop: '20px'}}>
                  
                  {correctionsComponent}

                  <Button fluid type='submit' style={{ backgroundColor: '#4096BE' }} primary>Submit</Button>
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
  excerpt     : React.PropTypes.object.isRequired,
  chosenEdit  : React.PropTypes.number.isRequired,
  patch       : React.PropTypes.array.isRequired,
  corrections : React.PropTypes.array.isRequired,
  submitTask  : React.PropTypes.func.isRequired
};

Verify.contextTypes = {
  router : React.PropTypes.object.isRequired
};

export default connect(null, { submitTask })(Verify);