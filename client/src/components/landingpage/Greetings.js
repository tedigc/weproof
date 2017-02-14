import React from 'react';
import { Grid, Header, Icon} from 'semantic-ui-react';

class Greetings extends React.Component {

  render() {
    return (
      <div>

        <div style={{ height: "400px", backgroundColor: "#005C84" }}>

        </div>

        {/* Icons */}
        <Grid style={{ marginTop: "50px", marginBottom: "50px" }}>
          <Grid.Row columns={5}>

            <Grid.Column>
            </Grid.Column>

            <Grid.Column>
              <Header as='h2' icon textAlign='center'>
                <Icon name='write' circular />
                <Header.Content>
                  Submit
                </Header.Content>
                <Header.Subheader>
                  Submit excerpts from your report or dissertation
                </Header.Subheader>
              </Header>
            </Grid.Column>

            <Grid.Column>
              <Header as='h2' icon textAlign='center'>
                <Icon name='users' circular />
                <Header.Content>
                  Correct
                </Header.Content>
                <Header.Subheader>
                  Let other users find errors and make corrections to your work
                </Header.Subheader>
              </Header>
            </Grid.Column>

            <Grid.Column>
              <Header as='h2' icon textAlign='center'>
                <Icon name='check' circular />
                <Header.Content>
                  Reward
                </Header.Content>
                <Header.Subheader>
                  Enjoy your improved report, and reward those who helped you
                </Header.Subheader>
              </Header>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }

}

export default Greetings;