import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';

const markStyle = {
  background: "pink",
  color: "red"
};

const pairs = [ 2, 20, 40, 150, 160, 162 ];

class TaskFind extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      text: "Most apps are composed of both necessary files and generated files. When using a source control system like git, you should avoid tracking anything that’s generated. For example, your node app probably has a node_modules directory for dependencies, which you should keep out of git. As long as each dependency is listed in package.json, anyone can create a working local copy of your app - including node_modules - by running npm install."
    };
    this.getHighlightedText = this.getHighlightedText.bind(this);
  }

  getHighlightedTextReact() {
    var original = this.state.text;

    function highlight() {
      var components = [];
      for(var i=0; i<pairs.length; i+=2) {
        components.push(<mark key={i} style={markStyle}>{original.slice(pairs[i], pairs[i+1])}</mark>);
        components.push(original.slice(pairs[i+1], pairs[i+2]));
      }
      return components;
    }

    return (
      <div>
        {original.slice(0, pairs[0])}
        {highlight()}
      </div>
    );
  }

  // Remove this when safe
  getHighlightedText(){
    var original = this.state.text;
    var modified = original.slice(0, pairs[0]);
    for(var i=0; i<pairs.length; i+=2) {
      // Append the highlighted piece of text
      modified += "<mark>" + original.slice(pairs[i], pairs[i+1]) + "</mark>";
      // Append the next piece of text, up until the next pair
      modified += original.slice(pairs[i+1], pairs[i+2]);
    }
    return { __html: modified };
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
              </Segment>
            </Grid.Column>

          </Grid.Row>
        </Grid>
      </div>
    );
  }

}

export default TaskFind;