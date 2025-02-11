import React, { useMemo } from 'react';
import { Tree } from 'primereact/tree';

const FSTree = ({ currentDirectory, currentPath, fsChange }) => {
    
    const transformToTreeData = (directory) => {
        if (!directory) return [];

        const transformNode = (node, name) => {
            return {
                key: name,
                label: node.is_file ? `📄 ${name}` : `📁 ${name}`,
                data: name,
                selectable: false,
                children: node.is_file ? undefined : [], // Prevents collapsible arrows
            };
        };

        return [{
            key: 'root',
            label: currentPath || '/',
            children: Object.entries(directory).map(([key, value]) => transformNode(value, key)),
        }];
    };

    const treeData = useMemo(() => transformToTreeData(currentDirectory), [currentDirectory, fsChange]);


    return (
        <div style={{ 
            height: '100%', 
            width: '100%', 
            padding: '0.5em', 
            backgroundColor: '#e8e8e8', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
        }}>
            {treeData.length > 0 ? (
                <Tree value={treeData} style={{
                  fontSize: '1.5em',
                }} />
            ) : (
                <div style={{ color: '#F1AB86', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                    <h1 style={{ fontSize: '2em' }}>No Data</h1>
                </div>
            )}
        </div>
    );
};

export default FSTree;
