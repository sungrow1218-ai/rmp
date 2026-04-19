import React from 'react';
import { Button, Space, Select } from '@ht/sprite-ui';

const { Option } = Select;

export interface PaginationType {
  pageId: number;
  pageSize: number;
}

export interface QueryFunProps {
  paginationValue: PaginationType;
  type?: boolean;
}

const OwnPagination = (props: {
  pagination: PaginationType;
  onFinsh: (props: QueryFunProps) => void;
}) => {
  const { pagination, onFinsh } = props;

  const onChange = (value: number) => {
    const paginationValue = { pageId: 1, pageSize: value };
    onFinsh({ paginationValue });
  };

  const changePage = (type: string) => {
    /**
     * 进行请求
     */
    let pageIdMock = 1;
    if (type === 'previous') {
      if (pagination.pageId === 1) {
        return;
      }
      pageIdMock = pagination.pageId - 1;
    } else {
      pageIdMock = pagination.pageId + 1;
    }
    const paginationValue = { ...pagination, pageId: pageIdMock };
    onFinsh({ paginationValue, type: true });
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        paddingTop: '20px',
      }}
    >
      <Space style={{ marginRight: '10px' }}>
        <Button
          onClick={() => {
            changePage('previous');
          }}
        >
          上一页
        </Button>
        <Button>{pagination.pageId}</Button>
        <Button
          onClick={() => {
            changePage('next');
          }}
        >
          下一页
        </Button>
      </Space>

      <Select onChange={onChange} value={pagination.pageSize}>
        <Option value={10}>10/页</Option>
        <Option value={20}>20/页</Option>
        <Option value={30}>30/页</Option>
        <Option value={40}>40/页</Option>
        <Option value={50}>50/页</Option>
      </Select>
    </div>
  );
};

export default OwnPagination;
