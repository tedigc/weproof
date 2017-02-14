import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Item, Label, Segment } from 'semantic-ui-react';
import Highlight from './Highlight';
import { submitTask } from '../../../actions/taskActions';

const excerptHeight = 250;
const buttonBarHeight = 70;

const styles = {
  highlight : {
    background: '#ffc4d3',
    color: '#992340'
  },
  highlightSelected : {
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
    justifyContent: 'center'
  },
  itemGroupDiv : {
    height: excerptHeight - 20,
    overflowY: 'auto',
    overflowX: 'hidden'
  }
};

class TaskFind extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pairs: [],
      currentlySelected: -1
    };
    this.getHighlightedTextReact = this.getHighlightedTextReact.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleRemoveHighlight = this.handleRemoveHighlight.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleHighlightMouseEnter = this.handleHighlightMouseEnter.bind(this);
    this.handleHighlightMouseLeave = this.handleHighlightMouseLeave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getHighlightedTextReact() {
    var original = this.props.excerpt.excerpt;
    var pairs = this.state.pairs.slice();

    // If there are no pairs, just return the unhighlighted original text
    if(pairs.length === 0) return <div id="excerpt">{original}</div>;

    var self = this;
    function highlight() {
      var components = [];

      for(var i=0; i<pairs.length; i++) {
        var highlightStyle = (i === self.state.currentlySelected) ? styles.highlightSelected : styles.highlight;
        components.push(
          <mark key={i} className="highlight" style={highlightStyle}>
            {original.slice(pairs[i][0], pairs[i][1])}
          </mark>
        );
        if(i === pairs.length-1) break;
        components.push(original.slice(pairs[i][1], pairs[i+1][0]));
      }
      return components;
    }

    return (
      <div id="excerpt">
        {original.slice(0, pairs[0][0])}
        {highlight()}
        {original.slice(pairs[pairs.length-1][1], original.length)}
      </div>
    );
  }

  handleHighlight(e) {
    e.preventDefault();

    // Add the user selection to the list of highlights
    if(typeof window.getSelection() !== undefined && window.getSelection().anchorNode !== null) {

      var el = window.getSelection().getRangeAt(0).startContainer.parentNode;
      if(el.className === "highlight") el = el.parentNode;
      if(el.id !== "excerpt") return;

      var start, end;
      var range, priorRange;

      // find the range of the selection
      //
      range = window.getSelection().getRangeAt(0);
      priorRange = range.cloneRange();
      priorRange.selectNodeContents(el);
      priorRange.setEnd(range.startContainer, range.startOffset);
      start = priorRange.toString().length;
      end = start + range.toString().length;
      end = Math.min(end, this.props.excerpt.excerpt.length);

      // add it to the array of pairs
      //
      var pairArray = this.state.pairs.slice();
      pairArray.push([start, end]);

      // sort the array of pairs by their left hand index
      //
      function comparator(a, b) {
        if(a[0] < b[0]) return -1;
        if(a[0] > b[0]) return  1;
        else return 0;
      }
      pairArray = pairArray.sort(comparator);

      // merge overlapping pairs
      //
      var merged = [];
      var currentPair = pairArray[0];
      for(var i=0; i<pairArray.length; i++) {
        if(currentPair[1] >= pairArray[i][0]) {
          // pairs overlap
          currentPair[1] = Math.max(currentPair[1], pairArray[i][1]);
        } else {
          merged.push(currentPair);
          currentPair = pairArray[i];
        }
      }
      merged.push(currentPair);

      this.setState({ pairs: merged });
      window.getSelection().removeAllRanges();
    }
  }

  handleRemoveHighlight(highlightIndex, e) {
    e.preventDefault();
    var pairsEdit = this.state.pairs.slice();
    pairsEdit.splice(highlightIndex, 1);
    this.setState({ pairs: pairsEdit });
  }

  handleClear(e) {
    e.preventDefault();
    this.setState({ pairs: [] });
  }

  handleHighlightMouseEnter(highlightIndex, e) {
    e.preventDefault();
    this.setState({ currentlySelected: highlightIndex });
  }

  handleHighlightMouseLeave(highlightIndex, e) {
    e.preventDefault();
    this.setState({ currentlySelected: -1 });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitTask({ 
      excerptId: this.props.excerpt.id, 
      excerpt: this.props.excerpt.excerpt, 
      pairs: this.state.pairs, 
      taskType: "find" 
    })
      .then(
        res => { this.context.router.push('/dashboard/home'); },
        err => { console.log(err); }
      );
  }

  render() {

    var highlights;
    if(this.state.pairs.length === 0) {
      highlights = (
        <Header textAlign="center" as='h4'>
          <Header.Content>
            You have no highlights
            <Header.Subheader>
              Highlight errors in the excerpt with the button button below.
            </Header.Subheader>
          </Header.Content>
        </Header>
      );
    } else {
      highlights = (
        <Item.Group divided style={styles.itemGroupDiv}>
          {this.state.pairs.map((pair, index) => {
            var text = this.props.excerpt.excerpt.slice(pair[0], pair[1]);
            return <Highlight 
                      key={index} 
                      id={index} 
                      text={text} 
                      remove={this.handleRemoveHighlight.bind(null, index)}
                      mouseEnter={this.handleHighlightMouseEnter.bind(null, index)}
                      mouseLeave={this.handleHighlightMouseLeave.bind(null, index)}
                      style={ (index === this.state.currentlySelected) ? styles.selected : styles.unselected }
                    />
          })}
        </Item.Group>
      );
    }

    return (
      <Form onSubmit={this.handleSubmit}>

        <Grid>
          <Grid.Row>

            {/* Excerpt window */}
            <Grid.Column width={10}>
            
              <Segment size="large" style={styles.excerpt}>
                {this.getHighlightedTextReact()}      
                <Label attached='bottom left'>Excerpt</Label>          
              </Segment>

            </Grid.Column>

            {/* Highlight window */}
            <Grid.Column width={6}>

              <Segment attached='top' style={styles.highlightMenu}>
                {highlights}
              </Segment>

              <Segment style={styles.buttonBar} attached='bottom'>
                <div style={{display: 'flex'}}>
                  <Button.Group fluid >
                    <Button content="Highlight" onClick={this.handleHighlight} primary />
                    <Button content="Clear All" onClick={this.handleClear}/>
                  </Button.Group>
                </div>
              </Segment>
              
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

TaskFind.propTypes = {
  excerpt    : React.PropTypes.object.isRequired,
  submitTask : React.PropTypes.func.isRequired
};

TaskFind.contextTypes = {
  router : React.PropTypes.object.isRequired
};

export default connect(null, { submitTask })(TaskFind);