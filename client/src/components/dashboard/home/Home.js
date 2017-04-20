import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Button, Grid, Header, Icon, Segment } from 'semantic-ui-react';
import PageHeader from '../PageHeader';

const styles = {
  button : {
    height : 100
  },
  buttonText : {
    fontSize: 24,
    fontWeight: 'bold'
  }
};

class Home extends React.Component {

  render() {
    return (
      <div>

        {/* Header & Username */}
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column>
              <PageHeader 
                title="Home" 
                description="A summary of all your activity" 
                icon="home"
              />
            </Grid.Column>
            <Grid.Column style={{ display : 'flex', flexDirection: 'row', justifyContent: 'flex-end'}}>
              <Header as='h1'>
                Welcome, {this.props.user.username}!
              </Header>
            </Grid.Column>

          </Grid.Row>
        </Grid>

        {/* News & Updates */}
        <Segment size="large" color='blue' style={{ marginTop : 40 }}>
          <Header>News & Updates</Header>
          <br/>
          <span style={{ lineHeight : 2 }}>
            Welcome to the first iteration of WeProof; the crowdsourced proofreading tool. This is your dashboard. From here, you can use the side bar or the buttons below to navigate to the different pages available to you. These are your "Work", "Submitted", and "My Excerpts" pages. From there, you can browse and complete correction tasks, view the tasks you have submitted, and create and browse excerpts of your own.
          </span>
        </Segment>

        {/* Buttons */}
        <Grid style={{ marginTop : 20 }}>
          <Grid.Row columns={3}>

            <Grid.Column>
              <Button animated fluid basic style={styles.button} as={Link} to='/dashboard/work'>
                <Button.Content visible><Icon name='industry' size='huge' /></Button.Content>
                <Button.Content hidden><span style={styles.buttonText}>Work</span></Button.Content>
              </Button>
            </Grid.Column>

            <Grid.Column>
              <Button animated fluid basic style={styles.button} as={Link} to='/dashboard/submitted'>
                <Button.Content visible><Icon name='tasks' size='huge' /></Button.Content>
                <Button.Content hidden><span style={styles.buttonText}>Submitted</span></Button.Content>
              </Button>
            </Grid.Column>

            <Grid.Column>
              <Button animated fluid basic style={styles.button} as={Link} to='/dashboard/excerpts'>
                <Button.Content visible><Icon name='folder open' size='huge' /></Button.Content>
                <Button.Content hidden><span style={styles.buttonText}>My Excerpts</span></Button.Content>
              </Button>
            </Grid.Column>

          </Grid.Row>
        </Grid>

      </div>
    );
  }

}

Home.propTypes = {
  user : React.PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return { user : state.auth.user };
}

export default connect(mapStateToProps)(Home);