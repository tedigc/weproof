import React from 'react';
import PageHeader from '../PageHeader';
import TaskFind from './find/TaskFind';

class Work extends React.Component {

  render() {
    return (
      <div>
        <PageHeader 
          title="Work" 
          description="Complete correction tasks and earn rewards!" 
          icon="industry"
        />
        <TaskFind/>
      </div>
    );
  }

}

export default Work;