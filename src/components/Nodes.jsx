import React from 'react';

const Nodes = ({ nodeDatum }) => {
  const isLeafNode = !nodeDatum.children || nodeDatum.children.length === 0;

  // Folder icon for non-leaf nodes
  const folderSVG = (
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 4h4l2 2h6v14H2V6h8l2-2z" fill="#F1AB86" />
    </svg>
  );

  // File icon for leaf nodes
  const fileSVG = (
    <svg width="40" height="40" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm0 14H6V4h8v5h5v9z" fill="#FF7F50" />
    </svg>
  );

  return (
    <g style={{ textAlign: 'middle' }}>
      {/* Container for the icon and text */}
      <g>
        {/* Render the icon */}
        {isLeafNode ? fileSVG : folderSVG}
      </g>
      {/* Render the title/text, aligned to the center */}
      <text 
        x="2%" 
        y="15%" 
        dy="0.1em" 
        textAnchor="middle" 
        fill="#fff" 
        fontSize="1.2em" 
        style={{ fontSize: '1.2em', fontWeight: 'bold' }}
      >
        {nodeDatum.name}
      </text>
    </g>
  );
};

export default Nodes;
