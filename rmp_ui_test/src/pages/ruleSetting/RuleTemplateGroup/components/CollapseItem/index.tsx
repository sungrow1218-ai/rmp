import { Collapse, ConfigProvider } from 'antd';
import React, { CSSProperties, useState } from 'react';
import styles from './styles.less';
import { RightOutlined } from '@ant-design/icons';

interface Props {
  title: string;
  children: React.ReactNode;
  extra?: React.ReactNode;
  style?: CSSProperties;
}

const CollapseItem: React.FC<Props> = ({
  title,
  children,
  extra,
  style = {},
}) => {
  const [activeKey, setActiveKey] = useState(['1']);

  return (
    <ConfigProvider
      theme={{
        components: {
          Collapse: {
            headerBg: '#fbfbfb',
            borderlessContentPadding: '12px 16px 0',
          },
        },
      }}
    >
      <Collapse
        style={{
          boxShadow: '0px 4px 8px 0px rgba(0,0,0,0.14)',
          borderRadius: '4px',
          ...style,
        }}
        collapsible={'disabled'}
        bordered={false}
        activeKey={activeKey}
        expandIcon={({ isActive }) => (
          <RightOutlined
            rotate={isActive ? 90 : 0}
            style={{ color: '#444444', fontSize: '16px', cursor: 'pointer' }}
            onClick={() => setActiveKey(activeKey.length === 0 ? ['1'] : [])}
          />
        )}
        items={[
          {
            key: '1',
            label: (
              <div
                className={styles.blockTitle}
                onClick={() => {
                  if (activeKey.length === 0) {
                    setActiveKey(['1']);
                  } else {
                    setActiveKey([]);
                  }
                }}
              >
                {title}
              </div>
            ),
            extra,
            children,
          },
        ]}
      />
    </ConfigProvider>
  );
};

export default CollapseItem;
