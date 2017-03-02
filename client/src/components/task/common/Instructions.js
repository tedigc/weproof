import React from 'react';
import { Grid } from 'semantic-ui-react';

class Instructions extends React.Component {

  render() {
    return (
      <Grid.Row>
        <Grid.Column width={16}>
          <h3>Instructions</h3>
          <span style={{ color: 'gray' }}>{this.props.text}</span>
          <br/>
        </Grid.Column>
      </Grid.Row>
    );
  }

}

Instructions.propTypes = {
  text : React.PropTypes.string.isRequired
};

export default Instructions;



