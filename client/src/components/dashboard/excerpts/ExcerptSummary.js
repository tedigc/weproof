import React from 'react';
import moment from 'moment';
import { Grid, Header, Icon, Label, Menu, Modal, Segment } from 'semantic-ui-react';
import Summary from './summary/Summary';

const EXCERPT_HEIGHT = 400;
const MENU_BAR_HEIGHT = 40;

const styles = {
  excerpt : {
    height: EXCERPT_HEIGHT,
    lineHeight: "30px"
  },
};
class ExcerptSummary extends React.Component {

  state = {
    activeItem : 'summary'
  }

  constructor(props) {
    super(props);
    this.setMenuItem = this.setMenuItem.bind(this);
  }

  setMenuItem(activeItem) {
    this.setState({ activeItem });
  }

  render() {
    let { isOpen, close, title, body, created, stage, status, tasks } = this.props;
    let { activeItem } = this.state;
    let { tasksFind, tasksFix, tasksVerify } = tasks;
    
    let completedString;
    if(stage !== 'complete') {
      completedString = 'pending';
    } else {
      let lastVerifyTask = tasksVerify[tasksVerify.length-1];
      completedString = moment(lastVerifyTask.created_at).toDate().toDateString();
    }

    return (
      <Modal 
        open={isOpen}
        onClose={close}
        closeIcon='close'>
        <Header>{title} <span style={{ color : '#9B9B9B', fontWeight: 100}}> - {created} </span></Header>
        <Modal.Content>

            <Grid>
              <Grid.Row>

                {/* Excerpt segment */}
                <Grid.Column width={11}>
                  <Segment size="large" style={styles.excerpt}>
                    {body}      
                    <Label attached='bottom left'>Excerpt</Label>          
                  </Segment>
                </Grid.Column>

                {/* Side Options */}
                <Grid.Column width={5}>

                  {/* Top Menu Bar */}
                  <Menu compact widths={3} tabular attached='top' style={{ height : MENU_BAR_HEIGHT }}>
                    <Menu.Item name='summary'      active={activeItem === 'summary'    } onClick={() => { this.setMenuItem('summary') }} >
                      <Icon name='unordered list'/>
                    </Menu.Item>
                    <Menu.Item name='corrections'  active={activeItem === 'corrections'} onClick={() => { this.setMenuItem('corrections') }} >
                      <Icon name='checkmark'/>
                    </Menu.Item>
                    <Menu.Item name='heatmap'      active={activeItem === 'heatmap'    } onClick={() => { this.setMenuItem('heatmap') }} >
                      <Icon name='fire'/>
                    </Menu.Item>
                  </Menu>

                  {/* Menu Item on display */}
                  <Segment attached='bottom' style={{ height: EXCERPT_HEIGHT - MENU_BAR_HEIGHT }}>
                    <Summary
                      complete={stage === 'complete'}
                      dateCreated={created}
                      dateCompleted={completedString}
                      length={body.length}
                      nTasksFind={tasksFind.length}
                      nTasksFix={tasksFix.length}
                      nTasksVerify={tasksVerify.length}
                    />
                  </Segment>

                </Grid.Column>

              </Grid.Row>
            </Grid>

        </Modal.Content>
      </Modal>
    );
  }

}

ExcerptSummary.propTypes = {
  isOpen  : React.PropTypes.bool.isRequired,
  title   : React.PropTypes.string.isRequired,
  body    : React.PropTypes.string.isRequired,
  created : React.PropTypes.string.isRequired,
  stage   : React.PropTypes.string.isRequired,
  status  : React.PropTypes.string.isRequired,
  close   : React.PropTypes.func.isRequired,
  tasks   : React.PropTypes.object.isRequired
};

export default ExcerptSummary;