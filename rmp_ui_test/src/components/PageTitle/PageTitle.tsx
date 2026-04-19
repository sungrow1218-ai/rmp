import { InfoCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import React, { ReactNode } from 'react';

type Props = {
  title: string;
  popRender?: ReactNode | string;
  showIcon?: boolean;
  extra?: ReactNode | string;
};

const PageTitle: React.FC<Props> = ({
  title,
  popRender = undefined,
  showIcon = false,
  extra,
}) => {
  return (
    <div
      style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#444',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div>
        {title}
        {showIcon && popRender && (
          <Popover content={popRender}>
            <InfoCircleOutlined
              style={{ marginLeft: '8px', color: '#A1A7AD', cursor: 'pointer' }}
            />
          </Popover>
        )}
        {showIcon && !popRender && (
          <InfoCircleOutlined
            style={{ marginLeft: '8px', color: '#A1A7AD', cursor: 'pointer' }}
          />
        )}
      </div>
      {extra}
    </div>
  );
};

export default PageTitle;
