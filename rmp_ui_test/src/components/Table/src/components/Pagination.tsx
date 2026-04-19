import React, { useEffect, useState } from 'react';
import { Button, Space, Select } from '@ht/sprite-ui';
import { PaginationProps } from '../types/pagination';

const { Option } = Select;

const Pagination = (props: PaginationProps) => {
  const { onChange, defaultCurrent, defaultPageSize, pageSizeOptions } = props;

  const [pageSize, setPageSize] = useState(defaultPageSize || 10);

  // eslint-disable-next-line prefer-const
  let [current, setCurrent] = useState(defaultCurrent || 1);

  const changePageSize = (value: number) => {
    if (onChange) {
      onChange(1, value);
    }
    setPageSize(value);
  };

  const changeCurrent = (value: number) => {
    if (onChange) {
      onChange(value, pageSize);
    }
    setCurrent(value);
  };

  useEffect(() => {
    setCurrent(props.current || 1);
  }, [props.current]);

  useEffect(() => {
    setPageSize(props.pageSize || 10);
  }, [props.pageSize]);

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
            changeCurrent(--current);
          }}
          disabled={current === 1}
        >
          上一页
        </Button>
        <Button>{current}</Button>
        <Button
          onClick={() => {
            changeCurrent(++current);
          }}
        >
          下一页
        </Button>
      </Space>

      <Select style={{ width: 80 }} onChange={changePageSize} value={pageSize}>
        {pageSizeOptions?.map((i) => (
          <Option key={i} value={i}>
            {i}/页
          </Option>
        ))}
      </Select>
    </div>
  );
};

export default Pagination;
