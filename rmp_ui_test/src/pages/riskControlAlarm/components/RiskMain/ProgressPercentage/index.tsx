import { EyeInvisibleOutlined } from '@ant-design/icons';
import { Button, Flex, Modal, Progress } from 'antd';
import React from 'react';

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  totalSize: number;
  progressPercentage: number;
};
const MaskWithCenterDiv = ({
  open,
  setOpen,
  progressPercentage,
  totalSize,
}: Props) => {
  return (
    <Modal
      open={open}
      title={'导出'}
      onCancel={() => setOpen(false)}
      mask={true}
      maskClosable={false}
      centered={true}
      footer={
        <>
          <Button type="primary" onClick={() => setOpen(false)}>
            <EyeInvisibleOutlined /> 隐藏弹窗
          </Button>
        </>
      }
    >
      <div
        style={{
          marginTop: '30px',
          display: 'flex',
          alignItems: 'center', // 垂直居中
          justifyContent: 'center', // 水平居中
        }}
      >
        <Flex gap="small" wrap={true}>
          <Progress
            strokeColor={'#bb744a'}
            type="circle"
            percent={progressPercentage}
            size={120}
            strokeWidth={12}
          />
        </Flex>
      </div>
      <div style={{ marginBottom: '60px' }}>
        <div style={{ margin: '10px', textAlign: 'center' }}>
          共{totalSize ?? '0'}条数据,正在导出中
        </div>
      </div>
    </Modal>
  );
};

export default MaskWithCenterDiv;
