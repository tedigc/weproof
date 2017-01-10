import React from 'react';
import PageHeader from '../PageHeader';

class Submitted extends React.Component {

  render() {
    return (
      <div>
        <PageHeader 
          title="Submitted" 
          description="View the tasks you have completed and submitted in detail" 
          icon="tasks"
        />
      </div>
    );
  }

}

export default Submitted;