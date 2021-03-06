import React from 'react';
import { connect } from 'react-redux';
import { Button, Form, Grid, Header, Item, Label, Segment } from 'semantic-ui-react';
import Highlight from './Highlight';
import Instructions from '../common/Instructions';
import { submitTask } from '../../../actions/taskActions';
import merge from '../../../util/aggregation/merge';

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

  state = {
    patches: [],
    currentlySelected: -1
  }

  constructor(props) {
    super(props);
    this.getHighlightedText = this.getHighlightedText.bind(this);
    this.handleHighlight = this.handleHighlight.bind(this);
    this.handleRemoveHighlight = this.handleRemoveHighlight.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleHighlightMouseEnter = this.handleHighlightMouseEnter.bind(this);
    this.handleHighlightMouseLeave = this.handleHighlightMouseLeave.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getHighlightedText() {
    let original = this.props.excerpt.body;
    let patches = this.state.patches.slice();

    // If there are no patches, just return the unhighlighted original text
    if(patches.length === 0) return <div id="excerpt">{original}</div>;

    let self = this;
    function highlight() {
      let components = [];

      for(let i=0; i<patches.length; i++) {
        let highlightStyle = (i === self.state.currentlySelected) ? styles.highlightSelected : styles.highlight;
        components.push(
          <mark key={i} className="highlight" style={highlightStyle}>
            {original.slice(patches[i][0], patches[i][1])}
          </mark>
        );
        if(i === patches.length-1) break;
        components.push(original.slice(patches[i][1], patches[i+1][0]));
      }
      return components;
    }

    return (
      <div id="excerpt">
        {original.slice(0, patches[0][0])}
        {highlight()}
        {original.slice(patches[patches.length-1][1], original.length)}
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
      end = Math.min(end, this.props.excerpt.body.length);

      // add it to the array of patches
      //
      let pairArray = this.state.patches.slice();
      pairArray.push([start, end]);

      // merge overlapping patches
      //
      let merged = merge(pairArray);

      this.setState({ patches: merged });
      window.getSelection().removeAllRanges();
    }
  }

  handleRemoveHighlight(highlightIndex, e) {
    e.preventDefault();
    let pairsEdit = this.state.patches.slice();
    pairsEdit.splice(highlightIndex, 1);
    this.setState({ patches: pairsEdit });
  }

  handleClear(e) {
    e.preventDefault();
    this.setState({ patches: [] });
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
      excerpt: this.props.excerpt.body, 
      patches: this.state.patches, 
      taskType: "find" 
    })
      .then(
        res => { this.context.router.push('/dashboard/home'); },
        err => { console.error(err); }
      );
  }

  render() {

    let highlights;
    let { patches, currentlySelected } = this.state;
    if(patches.length === 0) {
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
          {patches.map((patch, index) => {
            let text = this.props.excerpt.body.slice(patch[0], patch[1]);
            return <Highlight 
                      key={index} 
                      id={index} 
                      text={text} 
                      remove={this.handleRemoveHighlight.bind(null, index)}
                      mouseEnter={this.handleHighlightMouseEnter.bind(null, index)}
                      mouseLeave={this.handleHighlightMouseLeave.bind(null, index)}
                      style={ (index === currentlySelected) ? styles.selected : styles.unselected }
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
                    <Button style={{ marginTop : 15, backgroundColor : '#4096BE' }} fluid type='submit' primary disabled={patches.length === 0}>Submit</Button>
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