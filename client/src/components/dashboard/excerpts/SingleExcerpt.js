import React from 'react';
import { Item } from 'semantic-ui-react';

class SingleExcerpt extends React.Component {

  render() {
    return (
      <Item>
        <Item.Content>
          <Item.Header content={this.props.title}/>
          <p>{this.props.excerpt}</p>
          <Item.Extra>Created {this.props.created}</Item.Extra>
        </Item.Content>
      </Item>
    );
  }

}

SingleExcerpt.propTypes ={
  id      : React.PropTypes.number.isRequired,
  title   : React.PropTypes.string.isRequired,
  excerpt : React.PropTypes.string.isRequired,
  ownerId : React.PropTypes.number.isRequired,
  created : React.PropTypes.string.isRequired
};

export default SingleExcerpt;