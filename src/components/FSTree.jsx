import React, { useEffect, useMemo, useState } from 'react';
import Tree from 'react-d3-tree';
import Nodes from './Nodes.jsx';


const FSTree = (props) => {
    const {
        currentDirectory,
        currentPath,
        fsChange,
    } = props;
    // console.log(currentPath);

    const transformToTreeData = (directory) => {
        if (!directory) return null;

        const transformNode = (node, name) => {
            if (node.is_file === false) {
                return {
                    name: `📁 ${name}`,
                };
            } else {
              return {
                name: `📄 ${name}`, 
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
// useEffect(() => {
// }, [fsChange]);
const treeData = useMemo(() => transformToTreeData(currentDirectory), [currentDirectory, fsChange]);
    
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
      depthFactor={300}
      orientation="horizontal"
      pathFunc="step"
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