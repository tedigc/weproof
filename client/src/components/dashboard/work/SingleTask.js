import React from 'react';
import { Button, Icon, Table } from 'semantic-ui-react';

class SingleTask extends React.Component {

  constructor(props) {
    super(props);
    this.handleButtonPress = this.handleButtonPress.bind(this);
  }

  handleButtonPress(e) {
    e.preventDefault()
    this.context.router.push('/task/' + this.props.id);
  }

  render() {

    let { stage, body, created } = this.props;
    let cornerIcon;

    if(stage === 'find')   cornerIcon = 'search';
    if(stage === 'fix')    cornerIcon = 'write';
    if(stage === 'verify') cornerIcon = 'check';

    return (
      <Table.Row>

        <Table.Cell collapsing>
          <Icon.Group size='big'>
            <Icon name='file outline'/>
            <Icon corner name={cornerIcon}/>
          </Icon.Group>
        </Table.Cell>

        <Table.Cell collapsing>{stage}</Table.Cell>
        <Table.Cell collapsing>{body.slice(0, Math.min(100, body.length))}</Table.Cell>
        <Table.Cell collapsing>{created}</Table.Cell>
        <Table.Cell collapsing>
          <Button content='Start' icon='write' onClick={this.handleButtonPress}/>
        </Table.Cell>
      </Table.Row>
    );
  }

}

SingleTask.propTypes = {
  id     : React.PropTypes.number.isRequired,
  stage  : React.PropTypes.string.isRequired,
  body   : React.PropTypes.string.isRequired,
  created: React.PropTypes.string.isRequired
};

SingleTask.contextTypes = {
  router : React.PropTypes.object.isRequired
};

export default SingleTask;