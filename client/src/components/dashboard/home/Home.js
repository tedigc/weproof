import React from 'react';
import { connect } from 'react-redux';
import { Header } from 'semantic-ui-react';
import PageHeader from '../PageHeader';

class Home extends React.Component {

  render() {
    return (
      <div>
        <PageHeader 
          title="Home" 
          description="A summary of all your activity" 
          icon="home"
        />
        <Header>
          Welcome, {this.props.user.username}!
        </Header>
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