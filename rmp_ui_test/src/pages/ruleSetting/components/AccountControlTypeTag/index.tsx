import React from 'react';

const styleMap: {
  [key: string]: { bgColor: string; color: string; borderColor: string };
} = {
  产品账户: {
    bgColor: '#FFF7E2',
    color: '#E28800',
    borderColor: 'rgba(226,136,0,0.5)',
  },
  资产账户: {
    bgColor: '#EEFBFF',
    color: '#00AAE2',
    borderColor: 'rgba(0,170,226,0.5)',
  },
  证券账户: {
    bgColor: '#ECF2FF',
    color: '#005AE2',
    borderColor: 'rgba(0,90,226,0.5)',
  },
  组合账户: {
    bgColor: '#F3F3FF',
    color: '#6343F3',
    borderColor: 'rgba(99,67,243,0.5)',
  },
  部门: {
    bgColor: '#F3FFFB',
    color: '#04C5A5',
    borderColor: 'rgba(4,197,165,0.5)',
  },
  交易编码: {
    bgColor: '#F6F3FF',
    color: '#AD4DE5',
    borderColor: 'rgba(173,77,229,0.5)',
  },
  账户组: {
    bgColor: '#FFF3EA',
    color: '#E55829',
    borderColor: 'rgba(226,37,0,0.5)',
  },
  对接系统: {
    bgColor: '#fff0f6',
    color: '#c41d7f',
    borderColor: '#ffadd2',
  },
};

interface IProps {
  text: string;
}

const AccountControlTypeTag: React.FC<IProps> = ({ text }) => {
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

export default AccountControlTypeTag;
