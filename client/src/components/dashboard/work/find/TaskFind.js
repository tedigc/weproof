import React from 'react';
import { Button, Grid, Segment } from 'semantic-ui-react';

const markStyle = {
  background: "pink",
  color: "red"
};

class TaskFind extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: "Most apps are composed of both necessary files and generated files. When using a source control system like git, you should avoid tracking anything that’s generated. For example, your node app probably has a node_modules directory for dependencies, which you should keep out of git. As long as each dependency is listed in package.json, anyone can create a working local copy of your app - including node_modules - by running npm install.",
      pairs: []
    };
    this.getHighlightedTextReact = this.getHighlightedTextReact.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }


  //
  /* Newer work-in-progress version */
  //
  getHighlightedTextReact() {
    var original = this.state.text;
    var pairs = this.state.pairs.slice();

    // If there are no pairs, just return the unhighlighted original text
    if(pairs.length === 0) return <div id="excerpt">{original}</div>;

    function highlight() {
      var components = [];
      for(var i=0; i<pairs.length; i++) {
        components.push(
          <mark key={i} className="highlight" style={markStyle}>
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

  handleClick(e) {

    var el = window.getSelection().getRangeAt(0).startContainer.parentNode;
    if(el.className === "highlight") el = el.parentNode;
    if(el.id !== "excerpt") return;

    var start, end;
    var sel, range, priorRange;
    if(typeof window.getSelection !== undefined) {
      range = window.getSelection().getRangeAt(0);
      priorRange = range.cloneRange();
      priorRange.selectNodeContents(el);
      priorRange.setEnd(range.startContainer, range.startOffset);
      start = priorRange.toString().length;
      end = start + range.toString().length;

      var pairArray = this.state.pairs.slice();
      pairArray.push([start, end]);

      function comparator(a, b) {
        if(a[0] < b[0]) return -1;
        if(a[0] > b[0]) return  1;
        else return 0;
      }

      pairArray = pairArray.sort(comparator);
      console.log(pairArray);
      this.setState({ pairs: pairArray });
      window.getSelection().removeAllRanges();
    } else if(typeof document.getSelection !== undefined) {

    }
  }

  render() {
    return (
      <div>
        <Grid>
        
          <Grid.Row>

            {/* Excerpt window */}
            <Grid.Column width={10}>
              <Segment>
                {this.getHighlightedTextReact()}                
              </Segment>
            </Grid.Column>

            {/* User input window */}
            <Grid.Column width={6}>
              <Segment>
                User Input
                <br/>
                <Button content="Highlight" onClick={this.handleClick}/>
              </Segment>
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </div>
    );
  }

}

export default TaskFind;