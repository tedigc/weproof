import React from 'react';
import { Button, Item } from 'semantic-ui-react';

class Highlight extends React.Component {

  render() {
    return (
      <Item onMouseEnter={this.props.mouseEnter} onMouseLeave={this.props.mouseLeave}>
        <Item.Content>
          {this.props.text.slice(0, 50)}
          {(this.props.text.length > 50) ? "..." : ""}
          <Button size='tiny' floated='right' circular basic icon='remove' onClick={this.props.remove} />
        </Item.Content>
      </Item>
    );
  }

}

Highlight.propTypes ={
  id  : React.PropTypes.number.isRequired,
  text: React.PropTypes.string.isRequired,
  remove: React.PropTypes.func.isRequired,
  mouseEnter: React.PropTypes.func.isRequired,
  mouseLeave: React.PropTypes.func.isRequired
};

export default Highlight;