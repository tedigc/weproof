import React from 'react';
import { Button, Header, Item } from 'semantic-ui-react';
import Highlight from './Highlight';

const excerptHeight = 250;

const styles = {
  itemGroupDiv : {
    height: excerptHeight - 20,
    overflowY: 'auto',
    overflowX: 'hidden'
  }
};

class HighlightList extends React.Component {

  handleRemove(item) {
    console.log(item.target.id);
  }

  render() {
    
    var highlights;
    if(this.props.pairs.length === 0) {
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
          {this.props.pairs.map((pair, index) => {

            var text = this.props.excerpt.slice(pair[0], pair[1]);
            return (
                <Item key={index}>
                  <Item.Content>

                    {text.slice(0, 50)}
                    {(text.length > 50) ? "..." : ""}
                    <Button id={index} size='tiny' floated='right' circular basic icon='remove' onClick={this.handleRemove}/>

                  </Item.Content>
                </Item>
            );
          })}
        </Item.Group>
      );
    }


    return (
      highlights
    );
  }

}

HighlightList.PropTypes = {
  excerpt : React.PropTypes.string.isRequired,
  pairs: React.PropTypes.array.isRequired
};

export default HighlightList;