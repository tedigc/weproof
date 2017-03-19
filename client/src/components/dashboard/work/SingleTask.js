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

    let cornerIcon;
    switch(this.props.stage) {
      case 'find':
        cornerIcon = 'search';
        break;
      case 'fix':
        cornerIcon = 'write';
        break;
      case 'verify':
        cornerIcon = 'check';
        break;
      default:
        cornerIcon = 'help';
    }

    return (
      <Table.Row>

        <Table.Cell collapsing>
          <Icon.Group size='big'>
            <Icon name='file outline'/>
            <Icon corner name={cornerIcon}/>
          </Icon.Group>
        </Table.Cell>

        <Table.Cell collapsing>{this.props.stage}</Table.Cell>
        <Table.Cell collapsing>{this.props.body.slice(0, Math.min(100, this.props.body.length))}</Table.Cell>
        <Table.Cell collapsing>{this.props.created}</Table.Cell>
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