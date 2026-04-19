import React from 'react';
import type { DropDownProps, MenuProps, PopconfirmProps } from '@ht/sprite-ui';
import { Dropdown, Popconfirm } from '@ht/sprite-ui';
import { Menu } from 'antd';

import { DropMenu } from './types';

interface IProps {
  popconfirm?: boolean;
  trigger?: DropDownProps['trigger'];
  dropMenuList?: (DropMenu & Recordable)[];
  selectedKeys?: MenuProps['selectedKeys'];
  menuEvent?: (...args: any[]) => void;
}

const DropdownComp: React.FC<
  IProps & Partial<PopconfirmProps> & DropDownProps
> = (props) => {
  const {
    popconfirm,
    trigger = ['contextMenu'],
    dropMenuList = [],
    selectedKeys = [],
    children,
    menuEvent,
    ..._restProps
  } = props;

  const restProps = _restProps as any;

  const handleClickMenu = (item: DropMenu) => {
    const { event } = item;
    const menu = dropMenuList.find((item) => `${item.event}` === `${event}`);
    menuEvent?.(menu);
    item.onClick?.();
  };

  const getMenuItemJSX = (item: DropMenu & Recordable) => {
    const textJSX = (
      <div>
        {item.icon}
        <span className="ml-1">{item.text}</span>
      </div>
    );

    let jsxEle: React.JSX.Element;

    if (popconfirm && item.popConfirm) {
      jsxEle = (
        <Popconfirm
          {...restProps}
          disabled={item.disabled}
          icon={item.popConfirm.icon}
        >
          {textJSX}
        </Popconfirm>
      );
    } else {
      jsxEle = textJSX;
    }
    jsxEle = (
      <>
        {jsxEle}
        {item.divider && <Menu.Divider />}
      </>
    );
    return jsxEle;
  };

  const getMenuJSX = () => {
    return (
      <Menu selectedKeys={selectedKeys}>
        {dropMenuList.map((item) => (
          <Menu.Item
            onClick={() => handleClickMenu(item)}
            disabled={item.disabled}
            key={item.event}
          >
            {getMenuItemJSX(item)}
          </Menu.Item>
        ))}
      </Menu>
    );
  };

  return (
    <Dropdown trigger={trigger} {...restProps} overlay={getMenuJSX()}>
      <span>{children}</span>
    </Dropdown>
  );
};

export default DropdownComp;
