import React, { useRef, useEffect, FC, ReactElement } from 'react';

interface IProps {
  onClick: () => void;
  onClickOutSide: () => void;
  children: ReactElement;
}

const ClickOutside: FC<IProps> = ({ onClick, onClickOutSide, children }) => {
  const wrapperRef = useRef<HTMLDivElement>(null); // 创建一个ref来引用外层包裹组件

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      // 检查点击的元素是否在wrapperRef.current内部
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        // 在这里执行失焦逻辑，例如关闭弹窗、下拉菜单等
        console.log('点击了空白处，执行失焦操作');
        onClickOutSide();
      }
    };

    // 添加鼠标按下事件监听器到document
    document.addEventListener('mousedown', handleClickOutside);

    // 组件卸载时移除事件监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // 空依赖数组表示只在组件挂载和卸载时运行

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'relative', zIndex: 1 }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default ClickOutside;
