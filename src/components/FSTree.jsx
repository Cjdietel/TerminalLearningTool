import React, { useMemo, useState } from 'react';
import Tree from 'react-d3-tree';
import Nodes from './Nodes.jsx';


const FSTree = (props) => {
    const {
        currentDirectory,
        currentPath,
        treeKey
    } = props;
    console.log(currentPath);

    const transformToTreeData = (directory) => {
        if (!directory) return null;

        const transformNode = (node, name) => {
            if (typeof node === 'object' && node.content === undefined) {
                return {
                    name: `📁 ${name}`,
                };
            } else {
              return {
                name: `📄 ${name}`, 
                attributes: {
                    Content: node.content || '(empty)',
                    'Date Modified': node.date_modified || '(not available)'
                },
                children: []
            };
            }
            
        };
        return {
            name: currentPath || '/',
            children: Object.entries(directory).map(([key,value]) =>
                transformNode(value, key)
            ),
        };
  };

    const treeData = useMemo(() => transformToTreeData(currentDirectory), [currentDirectory]);


    const [translate, setTranslate] = useState({ x: 200, y: 50 });

    const handleNodeClick = (nodeData, evt) => {
        const svgElement = evt.target.closest('svg'); // Find the SVG container
        const { width, height } = svgElement.getBoundingClientRect();
    
        const { x, y } = nodeData.__rd3t.coordinates; // Extract node coordinates
        setTranslate({
          x: width / 2 - x,
          y: height / 2 - y,
        });
      };

    return (
        <div style={{ 
            height: '50vh', 
            width: '100%', 
            padding: '0.5em', 
            backgroundColor: '#e8e8e8', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%'
            }}>
  {treeData ? (
    <Tree
      data={treeData}
      orientation="vertical"
      translate={translate}
      onNodeClick={handleNodeClick}
      pathFunc="straight"
      renderCustomNodeElement={({ nodeDatum }) => <Nodes nodeDatum={nodeDatum} />}
      styles={{
        nodes: {
          node: {
            circle: { fill: '#F1AB86' },
            name: { fill: '#fff', fontSize: '1.2em', textAlign: 'center' }, // Centering the text
            attributes: { fill: '#ddd', fontSize: '0.8em' },
          },
          leafNode: {
            circle: { fill: '#FF7F50' },
            name: { fill: '#fff', fontSize: '1em', textAlign: 'center' }, // Centering the text
            attributes: { fill: '#ddd', fontSize: '0.8em' },
          },
        },
      }}
    />
  ) : (
    <div style={{ color: '#F1AB86', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <h1 style={{ fontSize: '2em' }}>No Data</h1>
    </div>
  )}
</div>

      ); 
}

export default FSTree