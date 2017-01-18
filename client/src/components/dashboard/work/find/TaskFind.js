import React from 'react';
import { Item, Button, Grid, Header, Label, Segment } from 'semantic-ui-react';
import Highlight from './Highlight';
// import HighlightList from './HighlightList';

const excerptHeight = 250;
const buttonBarHeight = 70;

const styles = {
  highlight : {
    background: "pink",
    color: "red"
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
      highlights: []
    };
    this.getHighlightedTextReact = this.getHighlightedTextReact.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleRemoveHighlight = this.handleRemoveHighlight.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  getHighlightedTextReact() {
    var original = this.props.excerpt;
    var pairs = this.state.pairs.slice();

    // If there are no pairs, just return the unhighlighted original text
    if(pairs.length === 0) return <div id="excerpt">{original}</div>;

    function highlight() {
      var components = [];
      for(var i=0; i<pairs.length; i++) {
        components.push(
          <mark key={i} className="highlight" style={styles.highlight}>
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

    var el = window.getSelection().getRangeAt(0).startContainer.parentNode;
    if(el.className === "highlight") el = el.parentNode;
    if(el.id !== "excerpt") return;

    // Add the user selection to the list of highlights
    var start, end;
    var range, priorRange;
    if(typeof window.getSelection !== undefined) {

      // find the range of the selection
      //
      range = window.getSelection().getRangeAt(0);
      priorRange = range.cloneRange();
      priorRange.selectNodeContents(el);
      priorRange.setEnd(range.startContainer, range.startOffset);
      start = priorRange.toString().length;
      end = start + range.toString().length;

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
    var pairsEdit = this.state.pairs.slice();
    pairsEdit.splice(highlightIndex, 1);
    this.setState({ pairs: pairsEdit });
  }

  handleClear() {
    this.setState({ pairs: [] });
  }

  render() {

    var highlights;
    if(this.state.pairs.length === 0) {
      highlights = (
        <Header textAlign="center" as='h4'>
          <Header.Content>
            You have no highlights
            <Header.Subheader>
              Highlight errors in the excerpt with the blue button.
            </Header.Subheader>
          </Header.Content>
        </Header>
      );
    } else {
      highlights = (
        <Item.Group divided style={styles.itemGroupDiv}>
          {this.state.pairs.map((pair, index) => {
            var text = this.props.excerpt.slice(pair[0], pair[1]);
            return <Highlight key={index} id={index} text={text} remove={this.handleRemoveHighlight.bind(null, index)}/>
          })}
        </Item.Group>
      );
    }

    return (
      <div>
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
        </Grid>
      </div>
    );
  }

}

TaskFind.PropTypes = {
  excerpt: React.PropTypes.string.isRequired
};

export default TaskFind;