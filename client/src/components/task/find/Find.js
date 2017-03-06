import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Item, Label, Segment } from 'semantic-ui-react';
import Highlight from './Highlight';
import Instructions from '../common/Instructions';
import { submitTask } from '../../../actions/taskActions';

const excerptHeight = 400;
const highlightMenuHeight = 170;

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
    height: excerptHeight,
    lineHeight: "30px"
  },
  highlightMenu : {
    height: highlightMenuHeight
  },
  buttonGroup : {
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'space-between',
  },
  itemGroup : {
    height: highlightMenuHeight-20,
    overflowY: 'auto',
    overflowX: 'hidden'
  },
  highlightButton : {
    backgroundColor: '#FFFFFF', 
    color : '#4096BE', 
    borderRadius: 5, 
    borderStyle: 'solid', 
    borderWidth: 'thin', 
    borderColor: '#4096BE' 
  }
};

class Find extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      pairs: [],
      currentlySelected: -1
    };
    this.getHighlightedText = this.getHighlightedText.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleRemoveHighlight = this.handleRemoveHighlight.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleHighlightMouseEnter = this.handleHighlightMouseEnter.bind(this);
    this.handleHighlightMouseLeave = this.handleHighlightMouseLeave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getHighlightedText() {
    let original = this.props.excerpt.excerpt;
    let pairs = this.state.pairs.slice();

    // If there are no pairs, just return the unhighlighted original text
    if(pairs.length === 0) return <div id="excerpt">{original}</div>;

    let self = this;
    function highlight() {
      let components = [];

      for(let i=0; i<pairs.length; i++) {
        let highlightStyle = (i === self.state.currentlySelected) ? styles.highlightSelected : styles.highlight;
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

      let el = window.getSelection().getRangeAt(0).startContainer.parentNode;
      if(el.className === "highlight") el = el.parentNode;
      if(el.id !== "excerpt") return;

      let start, end;
      let range, priorRange;

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
      let pairArray = this.state.pairs.slice();
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
      let merged = [];
      let currentPair = pairArray[0];
      for(let i=0; i<pairArray.length; i++) {
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
    let pairsEdit = this.state.pairs.slice();
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

    let highlights;
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
        <Item.Group divided style={styles.itemGroup}>
          {this.state.pairs.map((pair, index) => {
            let text = this.props.excerpt.excerpt.slice(pair[0], pair[1]);
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
                {this.getHighlightedText()}      
                <Label attached='bottom left'>Excerpt</Label>          
              </Segment>

            </Grid.Column>

            {/* Input window */}
            <Grid.Column width={6}>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Instructions text='The box on the left shows an excerpt of text. Search for errors in spelling, grammar or wording and highlight them with your mouse. Confirm your highlights with the "Highlight" button and submit when you are happy with your choices.'/>
                <Segment style={styles.highlightMenu}>
                  {highlights}
                </Segment>

                <div style={styles.buttonGroup}>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Button style={styles.highlightButton} content="Highlight" fluid onClick={this.handleHighlight} />
                      <Button basic content="Clear All" fluid onClick={this.handleClear}/>
                    </div>
                    <Button style={{ marginTop: 15, backgroundColor: '#4096BE' }} fluid type='submit' primary>Submit</Button>
                  </div>
                </div>
              </div>
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </Form>
    );
  }

}

Find.propTypes = {
  excerpt    : React.PropTypes.object.isRequired,
  submitTask : React.PropTypes.func.isRequired
};

Find.contextTypes = {
  router : React.PropTypes.object.isRequired
};

export default connect(null, { submitTask })(Find);