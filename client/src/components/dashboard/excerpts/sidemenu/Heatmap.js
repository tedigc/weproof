import React from 'react';
import { Header } from 'semantic-ui-react';

class Heatmap extends React.Component {

  render() {
    return (
      <div>
        <Header content='Heatmap'/>
        <span style={{ marginTop : 10, color : '#999999', lineHeight : 1.5 }}>The excerpt's heatmap shows which regions of text were more commonly highlighted in the 'find' stage by the workers. The graduent ranges from green to red, where green areas were the least highlighted, and red areas the most.</span>
      </div>
    );
  }

}

export default Heatmap;