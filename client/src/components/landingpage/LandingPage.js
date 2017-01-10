import React from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';

class LandingPage extends React.Component {

  render() {
    return (
      <Container>
        <NavBar/>
        <div style={{ marginTop: "80px" }}>
          {this.props.children}
        </div>
      </Container>
    );
  }

}

export default LandingPage;