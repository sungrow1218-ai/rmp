import React from 'react';
import styles from './styles.less';
import { CheckOutlined } from '@ant-design/icons';

const CornerTick = ({
  color = '#BB744A', // 默认绿色
  size = 30, // 三角形边长
  visible = true, // 是否显示
  icon = <CheckOutlined />, // 也可以传入 <Icon /> 组件
}) => {
  if (!visible) return null;

  const containerStyle = {
    // 动态控制三角形大小和颜色
    borderTop: `${size}px solid ${color}`,
    borderLeft: `${size}px solid transparent`,
  };

  const iconStyle = {
    // 根据 size 动态计算图标位置，保证居中感
    top: `-${Math.round(size * 0.95)}px`,
    fontSize: `${Math.round(size * 0.4)}px`,
  };

  return (
    <div className={styles['corner-tick-wrapper']} style={containerStyle}>
      <span className={styles['corner-tick-icon']} style={iconStyle}>
        {icon}
      </span>
    </div>
  );
};

export default CornerTick;
