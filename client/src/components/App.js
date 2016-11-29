import React from 'react';
import NavBar from './NavBar';

class App extends React.Component {

  render() {
    return (
      <div className="container">
        <NavBar/>
        <br/>
        {this.props.children}
      </div>
    );
  }

}

export default App;