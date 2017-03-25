import React from 'react';
import { Link } from 'react-router';
import { Button, Container, Divider, Grid, Header, Icon } from 'semantic-ui-react';


class Greetings extends React.Component {

  render() {
    return (
      <div>

        <div style={{ height: "600px", backgroundImage: "url('static/images/cover_photo.jpg')", backgroundSize: '100%' }}>
          <Header as='h1' textAlign='center' style={{ position: 'relative', top: 150, left: '50%', transform: 'translateX(-50%)', fontSize: 60 }}>
            <Header.Content style={{ color: '#333333' }}>
              <span style={{ fontWeight: '100', fontStyle: 'italic'}}>We</span>Proof
            </Header.Content>
            <Header.Subheader style={{ fontSize: 20 }}>
              Harness the power of the crowd and improve your written English
            </Header.Subheader>


            <Button animated size='massive' style={{ position: 'relative', top: 130 }} as={Link} to='/signup'>

              <Button.Content visible>GET STARTED</Button.Content>
              <Button.Content hidden style={{ fontWeight: 100 }}>
                &nbsp; &nbsp; Sign Up <Icon name='right arrow' />
              </Button.Content>

            </Button>

          </Header>
        </div>

        <Container>

          <br/>
          <br/>
          <br/>

          <p style={{ fontSize: 18, color: "#666666", lineHeight: '35px', textAlign: 'center' }}>
            <span style={{ fontWeight : 10, fontStyle : 'italic' }}>We</span><b>Proof</b> is a web application that uses the power of crowdsourcing to help non-native English speakers proof-read their written English, be it in the form of essays, reports or dissertations. This project endeavors to take advantage of the untapped crowdsourcing potential of Universities, in the form of students and staff, and provide much needed assistance to the international and non-native English speaking student populations at Universities around the country.
          </p>

          <br/>
          <br/>

          <Divider/>

          {/* Icons */}
          <Grid style={{ marginTop: "50px", marginBottom: "50px" }}>
            <Grid.Row columns={3}>

              <Grid.Column>
                <Header as='h2' icon textAlign='center'>
                  <Icon name='write' circular />
                  <Header.Content style={{ marginTop: 10 }}>
                    Submit
                  </Header.Content>
                  <Header.Subheader style={{ marginTop: 10 }}>
                    Submit excerpts from your report or dissertation
                  </Header.Subheader>
                </Header>
              </Grid.Column>

              <Grid.Column>
                <Header as='h2' icon textAlign='center'>
                  <Icon name='users' circular />
                  <Header.Content style={{ marginTop: 10 }}>
                    Correct
                  </Header.Content>
                  <Header.Subheader style={{ marginTop: 10 }}>
                    Let other users find errors and make corrections to your work
                  </Header.Subheader>
                </Header>
              </Grid.Column>

              <Grid.Column>
                <Header as='h2' icon textAlign='center'>
                  <Icon name='check' circular />
                  <Header.Content style={{ marginTop: 10 }}>
                    Reward
                  </Header.Content>
                  <Header.Subheader style={{ marginTop: 10 }}>
                    Enjoy your improved report, and reward those who helped you
                  </Header.Subheader>
                </Header>
              </Grid.Column>

            </Grid.Row>
          </Grid>
        </Container>
      </div>
    );
  }

}

export default Greetings;