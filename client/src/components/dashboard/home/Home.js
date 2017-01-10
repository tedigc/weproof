import React from 'react';
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
      </div>
    );
  }

}

export default Home;