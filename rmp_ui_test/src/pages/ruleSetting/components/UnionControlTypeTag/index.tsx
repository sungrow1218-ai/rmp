import React from 'react';

const styleMap: {
  [key: string]: { bgColor: string; color: string; borderColor: string };
} = {
  单独控制: {
    bgColor: 'rgba(99,125,255,0.1)',
    color: '#637DFF',
    borderColor: 'rgba(99,125,255,0.5)',
  },
  联合控制: {
    bgColor: 'rgba(106,255,99,0.1)',
    color: '#41B46B',
    borderColor: 'rgba(66,181,108,0.5)',
  },
  '单独控制+联合控制': {
    bgColor: '#FFF4E5',
    color: '#BB744A',
    borderColor: 'rgba(203,114,50,0.5)',
  },
};

interface IProps {
  text: string;
}

const UnionControlTypeTag: React.FC<IProps> = ({ text }) => {
  if (text in styleMap) {
    const { bgColor, color, borderColor } = styleMap[text];
    return (
      <div
        style={{
          padding: '4px 10px',
          background: bgColor,
          borderRadius: '4px 4px 4px 4px',
          border: `1px solid ${borderColor}`,
          display: 'inline-block',
          color,
        }}
      >
        {text}
      </div>
    );
  } else {
    return text;
  }
};

export default UnionControlTypeTag;
