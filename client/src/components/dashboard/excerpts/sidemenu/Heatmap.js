import React from 'react';
import { Header } from 'semantic-ui-react';

class Heatmap extends React.Component {

  render() {
    return (
      <div>
        <Header content='Heatmap'/>
        <span style={{ marginTop : 10, color : '#999999', lineHeight : 1.5 }}>The excerpt's heatmap shows which regions of text were more commonly highlighted by workers in the 'find' stage. The gradient ranges from green to red, where green areas were the least highlighted, and red areas are the most.</span>
      </div>
    );
  }

}

export default Heatmap;