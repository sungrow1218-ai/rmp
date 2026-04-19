// src/pages/.../components/AddAccountTree/TransferFooter.tsx
import React from 'react';
import { Button, Select } from '@ht/sprite-ui';
import styles from './style.less';

type Props = {
  leftCount: number;
  rightCount: number;

  leftPage: number;
  leftTotalPages: number;
  onLeftPrev: () => void;
  onLeftNext: () => void;
  leftPageSize: number;
  onLeftPageSizeChange: (v: number) => void;

  rightPage: number;
  rightTotalPages: number;
  onRightPrev: () => void;
  onRightNext: () => void;
  rightPageSize: number;
  onRightPageSizeChange: (v: number) => void;

  pageSizeOptions?: { label: string; value: number }[];
};

const TransferFooter: React.FC<Props> = ({
  leftCount,
  rightCount,
  leftPage,
  leftTotalPages,
  onLeftPrev,
  onLeftNext,
  leftPageSize,
  onLeftPageSizeChange,

  rightPage,
  rightTotalPages,
  onRightPrev,
  onRightNext,
  rightPageSize,
  onRightPageSizeChange,

  pageSizeOptions = [
    { label: '10 条/页', value: 10 },
    { label: '20 条/页', value: 20 },
    { label: '50 条/页', value: 50 },
    { label: '100 条/页', value: 100 },
  ],
}) => {
  return (
    <div className={styles.footer}>
      {/* 左侧分页控制 */}
      <div className={styles.footerBody}>
        <span style={{ marginLeft: 'auto' }}>
          共{leftCount}条记录&nbsp;&nbsp;
          <Button disabled={leftPage <= 1} onClick={onLeftPrev}>
            上一页
          </Button>
          <span style={{ margin: '0 8px' }}>
            第 {leftPage} / {leftTotalPages} 页
          </span>
          <Button disabled={leftPage >= leftTotalPages} onClick={onLeftNext}>
            下一页
          </Button>
          {/* 每页显示条数选择器（左侧） */}
          <span style={{ margin: '0 8px' }}>当前显示</span>
          <Select
            style={{ width: 100, marginLeft: 1 }}
            options={pageSizeOptions}
            value={leftPageSize}
            onChange={(value) => onLeftPageSizeChange(value)}
          />
        </span>
      </div>

      {/* 中间部分保持不变 */}
      {/* <div style={{ justifySelf: 'center', color: '#666' }} /> */}
      <div className={styles.btnGroup}>
        <Button style={{ opacity: 0, pointerEvents: 'none' }}>&gt;</Button>
        <Button style={{ opacity: 0, pointerEvents: 'none' }}>&lt;</Button>
      </div>
      {/* 右侧分页控制 */}
      <div
        style={{
          color: '#666',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        共{rightCount}条记录&nbsp;&nbsp;
        <Button disabled={rightPage <= 1} onClick={onRightPrev}>
          上一页
        </Button>
        <span style={{ margin: '0 8px' }}>
          第 {rightPage} / {rightTotalPages} 页
        </span>
        <Button disabled={rightPage >= rightTotalPages} onClick={onRightNext}>
          下一页
        </Button>
        {/* 每页显示条数选择器（右侧） */}
        <span style={{ margin: '0 8px' }}>当前显示</span>
        <Select
          style={{ width: 100, marginLeft: 1 }}
          options={pageSizeOptions}
          value={rightPageSize}
          onChange={(value) => onRightPageSizeChange(value)}
        />
      </div>
    </div>
  );
};

export default TransferFooter;
