import React from 'react';
import { Link } from '@oula/oula';
import { Result, Button } from '@ht/sprite-ui';

export default () => {
  return (
    <Result
      status="403"
      title="403"
      style={{
        background: 'none',
      }}
      subTitle="抱歉，您没有访问当前页面的权限"
      extra={
        <Link to="/">
          <Button type="primary">返回</Button>
        </Link>
      }
    />
  );
};
