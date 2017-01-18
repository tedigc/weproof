import React from 'react';
import PageHeader from '../PageHeader';
import TaskFind from './find/TaskFind';

const text = "Most apps are composed of both necessary files and generated files. When using a source control system like git, you should avoid tracking anything that’s generated. For example, your node app probably has a node_modules directory for dependencies, which you should keep out of git. As long as each dependency is listed in package.json, anyone can create a working local copy of your app - including node_modules - by running npm install.";

class Work extends React.Component {

  render() {
    return (
      <div>
        <PageHeader 
          title="Work" 
          description="Complete correction tasks and earn rewards!" 
          icon="industry"
        />
        <TaskFind excerpt={text}/>
      </div>
    );
  }

}

export default Work;