import { Link } from '@oula/oula';
import { Result, Button } from '@ht/sprite-ui';
import React from 'react';

export default () => {
  return (
    <Result
      status="404"
      title="404"
      style={{
        background: 'none',
      }}
      subTitle="抱歉，您当前访问的页面地址不存在"
      extra={
        <Link to="/welcome">
          <Button type="primary">返回</Button>
        </Link>
      }
    />
  );
};
