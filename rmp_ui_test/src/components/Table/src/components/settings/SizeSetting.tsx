import type { SizeType } from '../../types/table';
import { Tooltip, Dropdown, TooltipProps } from '@ht/sprite-ui';
import { type MenuProps, Menu } from 'antd';
import { ColumnHeightOutlined } from '@ant-design/icons';
import { useTableContextSelctor } from '../../hooks/useTableContext';
import { getPopupContainer } from '@/utils/dom';
import { useState } from 'react';
import { useCreation } from 'ahooks';

const SizeSetting = (props: TooltipProps) => {
  const { setProps, getSize } = useTableContextSelctor((state) => ({
    setProps: state.setProps,
    getSize: state.getSize,
  }));
  const [selectedKeys, setSelectedKeys] = useState([getSize()]);
  const handleTitleClick: MenuProps['onClick'] = ({ key }) => {
    setSelectedKeys([key as SizeType]);

    setProps({
      size: key as SizeType,
    });
  };

  const menuProps = useCreation<MenuProps>(() => {
    return {
      onClick: handleTitleClick,
      selectedKeys,
      items: [
        {
          key: 'default',
          label: '默认',
        },
        {
          key: 'middle',
          label: '中等',
        },
        {
          key: 'small',
          label: '紧凑',
        },
      ],
    };
  }, [selectedKeys]);

  return (
    <Tooltip placement="top" title={'密度'} {...props}>
      <Dropdown
        placement="bottom"
        overlay={<Menu {...menuProps} />}
        trigger={['click']}
        getPopupContainer={getPopupContainer}
      >
        <ColumnHeightOutlined />
      </Dropdown>
    </Tooltip>
  );
};

export default SizeSetting;
