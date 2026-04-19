import { Link } from 'react-router-dom';
import { Result, Button } from 'antd';
import React from 'react';

const NotFoundPage = () => {
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

export default NotFoundPage;
