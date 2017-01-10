import React from 'react';
import PageHeader from '../PageHeader';

class Settings extends React.Component {

  render() {
    return (
      <div>
        <PageHeader 
          title="Settings" 
          description="Change your user settings" 
          icon="setting"
        />
      </div>
    );
  }

}

export default Settings;