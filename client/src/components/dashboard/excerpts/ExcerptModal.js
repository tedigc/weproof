import React from 'react';
import moment from 'moment';
import { Grid, Header, Icon, Label, Menu, Modal, Segment } from 'semantic-ui-react';
import Summary from './sidemenu/Summary';
import Corrections from './sidemenu/Corrections';
import Heatmap from './sidemenu/Heatmap';

const EXCERPT_HEIGHT = 400;
const MENU_BAR_HEIGHT = 40;

const COLOUR_GRADIENT = [
  '#FF1000',
  '#FF3000',
  '#FF5000',
  '#FF7000',
  '#FF9000',
  '#FFB000',
  '#FFD000',
  '#FFF000',
  '#F0FF00',
  '#D0FF00',
  '#B0FF00',
  '#90FF00',
];

const styles = {
  excerpt : {
    height: EXCERPT_HEIGHT,
    lineHeight: "30px"
  },
};
class ExcerptModal extends React.Component {

  state = {
    activeItem         : 'summary',
    selectedCorrection : -1
  }

  constructor(props) {
    super(props);
    this.setMenuItem = this.setMenuItem.bind(this);
    this.close = this.close.bind(this);
    this.handleSelectCorrection = this.handleSelectCorrection.bind(this);
  }

  setMenuItem(activeItem) {
    this.setState({ activeItem });
  }

  close() {
    this.setMenuItem('summary');
    this.props.close();
  }  

  handleSelectCorrection(selectedCorrection) {
    this.setState({ selectedCorrection });
  }

  excerptCorrected() {

    let { selectedCorrection } = this.state;
    let { excerpt, tasks } = this.props;
    let { body, recommendedEdits } = excerpt;
    let selectedTaskFix = tasks.tasksFix[selectedCorrection];
    let patch = recommendedEdits[selectedTaskFix.chosen_edit];

    let preEdit    = body.slice(0, patch[0]);
    let old        = body.slice(patch[0], patch[1]);
    let correction = selectedTaskFix.correction;
    let postEdit   = body.slice(patch[1], body.length-1);

    return (
      <div>
        {preEdit}
        <span style={{ background: '#ffc4d3', color: '#992340', textDecoration: 'line-through' }}>{old}</span>
        <span style={{ background: '#c1d5ff', color: '#283f70' }}>{correction}</span>
        {postEdit}
      </div>
    );
  }     

  excerptHeatmap() {

    let { excerpt } = this.props;
    let { body, heatmap } = excerpt;

    let spans = [];
    let leftIdx = 0;
    let prevIntensity = heatmap[0];

    for(let i=0; i<heatmap.length; i++) {
      let currentIntensity = heatmap[i];
      if(currentIntensity !== prevIntensity) {
        let colourIdx = COLOUR_GRADIENT.length - 1 - Math.min(COLOUR_GRADIENT.length - 1, prevIntensity);
        spans.push(<span key={i} style={{ color : COLOUR_GRADIENT[colourIdx] }}>{body.slice(leftIdx, i)}</span>);
        leftIdx = i;
      }
      prevIntensity = currentIntensity;
    }

    let colourIdx = COLOUR_GRADIENT.length - 1 - Math.min(COLOUR_GRADIENT.length - 1, prevIntensity);
    spans.push(<span key={spans.length} style={{ color : COLOUR_GRADIENT[colourIdx] }}>{body.slice(leftIdx, body.length)}</span>)

    return spans;
  }        

  render() {

    let { excerpt, tasks, isOpen, acceptCorrections } = this.props;
    let { title, body, stage, accepted, recommendedEdits, created } = excerpt;
    let { activeItem, selectedCorrection } = this.state;
    let { tasksFind, tasksFix, tasksVerify } = tasks;
    
    let completedString;
    if(stage !== 'complete') {
      completedString = 'pending';
    } else {
      let lastVerifyTask = tasksVerify[tasksVerify.length-1];
      completedString = moment(lastVerifyTask.created_at).toDate().toDateString();
    }

    // Side Menu Items
    let sideMenuComponent;
    switch(activeItem) {
      case 'corrections':
        sideMenuComponent = (
          <Corrections
            nRecommendedEdits={recommendedEdits.length}
            accepted={accepted}
            tasksFix={tasksFix}
            tasksVerify={tasksVerify}
            setSelectedCorrectionParent={this.handleSelectCorrection}
          />
        );
        break;
      case 'heatmap':
        sideMenuComponent = <Heatmap/>
        break;
      default:
        sideMenuComponent = (
          <Summary
            complete={stage === 'complete'}
            accepted={accepted}
            dateCreated={created}
            dateCompleted={completedString}
            length={body.length}
            nTasksFind={tasksFind.length}
            nTasksFix={tasksFix.length}
            nTasksVerify={tasksVerify.length}
            acceptCorrections={acceptCorrections}
          />
        );
    }

    // excerpt text
    let excerptText = body;
    let excerptStyle = {}
    Object.assign(excerptStyle, styles.excerpt);
    if( activeItem === 'corrections' && selectedCorrection !== -1) {
      excerptText = this.excerptCorrected();
      excerptStyle.backgroundColor = '#FFFFFF'
    }

    if(activeItem === 'heatmap') {
      excerptText = this.excerptHeatmap();
      excerptStyle.backgroundColor = '#383838'
    }

    let disabledStyle = { pointerEvents : 'none', color : '#BBBBBB' };

    return (
      <Modal 
        open={isOpen}
        onClose={this.close}
        closeIcon='close'
      >
        <Header>{title} <span style={{ color : '#9B9B9B', fontWeight: 100}}> - {created} </span></Header>
        <Modal.Content>
          <Grid>
          <Grid.Row>

            {/* Excerpt segment */}
            <Grid.Column width={11}>
              <Segment size="large" style={excerptStyle}>
                {excerptText}      
                <Label attached='bottom left'>Excerpt</Label>          
              </Segment>
            </Grid.Column>

            {/* Side Options */}
            <Grid.Column width={5}>

              {/* Top Menu Bar */}
              <Menu compact widths={3} tabular attached='top' style={{ height : MENU_BAR_HEIGHT }}>
                
                {/* summary tab */}
                <Menu.Item name='summary'      active={activeItem === 'summary'    } onClick={() => { this.setMenuItem('summary') }} >
                  <Icon name='unordered list'/>
                </Menu.Item>

                {/* corrections tab */}
                <Menu.Item name='corrections'  
                  style={(accepted) ? undefined : disabledStyle} 
                  active={activeItem === 'corrections'} 
                  onClick={() => { this.setMenuItem('corrections') }} 
                >
                  <Icon name='checkmark'/>
                </Menu.Item>

                {/* heatmap tab */}
                <Menu.Item name='heatmap'      
                  style={(accepted) ? undefined : disabledStyle} 
                  active={activeItem === 'heatmap'} 
                  onClick={() => { this.setMenuItem('heatmap') }} 
                >
                  <Icon name='fire'/>
                </Menu.Item>

              </Menu>

              {/* Menu Item on display */}
              <Segment attached='bottom' style={{ height: EXCERPT_HEIGHT - MENU_BAR_HEIGHT, overflowY: 'auto', overflowX: 'hidden' }}>
                {sideMenuComponent}
              </Segment>

            </Grid.Column>

          </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }

}

ExcerptModal.propTypes = {
  excerpt           : React.PropTypes.object.isRequired,
  tasks             : React.PropTypes.object.isRequired,
  isOpen            : React.PropTypes.bool.isRequired,
  close             : React.PropTypes.func.isRequired,
  acceptCorrections : React.PropTypes.func.isRequired
};

export default ExcerptModal;