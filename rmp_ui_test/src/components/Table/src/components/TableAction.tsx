import styles from './TableAction.less';
import { MoreOutlined } from '@ant-design/icons';
import {
  Divider,
  Tooltip,
  TooltipProps,
  Popconfirm,
  Button,
} from '@ht/sprite-ui';
// import { Icon } from '@/components/Icon';
import type { TableActionProps } from '../types/table';
import type { ActionItem } from '../types/tableAction';
import { Dropdown } from '@/components/Dropdown';
import { useDesign } from '@/hooks/useDesign';
import { useTableContextSelctor } from '../hooks/useTableContext';
import { isBoolean, isFunction, isString } from 'lodash-es';
import { pick } from 'lodash';
import { ACTION_COLUMN_FLAG } from '../const';
import { useCreation } from 'ahooks';
import React, { ReactNode } from 'react';

const TableAction = (props: TableActionProps) => {
  const {
    actions = null,
    dropDownActions = null,
    divider = true,
    // outside,
    stopButtonPropagation = false,
    more,
    className = '',
  } = props;

  const { prefixCls } = useDesign('basic-table-action');
  const { wrapRef, getColumns } = useTableContextSelctor((state) => ({
    wrapRef: state.wrapRef,
    getColumns: state.getColumns,
  }));

  const getIfShow = (action: ActionItem): boolean => {
    const { ifShow } = action;

    let isIfShow = true;

    if (isBoolean(ifShow)) {
      isIfShow = ifShow;
    }
    if (isFunction(ifShow)) {
      isIfShow = ifShow(action);
    }
    return isIfShow;
  };

  const currentActions = useCreation(() => {
    return (actions || [])
      .filter((action) => {
        return getIfShow(action);
      })
      .map((action) => {
        const { popConfirm } = action;
        return {
          getPopupContainer: () => wrapRef.current ?? document.body,
          type: 'link',
          size: 'small',
          ...action,
          ...(popConfirm || {}),
          onConfirm: popConfirm?.confirm,
          onCancel: popConfirm?.cancel,
          enable: !!popConfirm,
        };
      });
  }, [actions]);

  const currentDropdownList = useCreation((): any[] => {
    const list = (dropDownActions || []).filter((action) => {
      return getIfShow(action);
    });
    return list.map((action, index) => {
      const { label, popConfirm } = action;
      return {
        ...action,
        ...popConfirm,
        onConfirm: popConfirm?.confirm,
        onCancel: popConfirm?.cancel,
        text: label,
        divider: index < list.length - 1 ? divider : false,
      };
    });
  }, [dropDownActions]);

  const getAlign = () => {
    const columns = getColumns?.() || [];
    const actionColumn = columns.find(
      (item) => item.flag === ACTION_COLUMN_FLAG
    );
    return actionColumn?.align ?? 'left';
  };

  const getTooltip = (data: string | TooltipProps): TooltipProps => {
    return {
      getPopupContainer: () => wrapRef.current ?? document.body,
      placement: 'bottom',
      ...(isString(data) ? { title: data } : data),
    };
  };

  const onCellClick: any = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stopButtonPropagation) {
      return;
    }
    const path = e.nativeEvent.composedPath() as HTMLElement[];
    const isInButton = path.find((ele) => {
      return ele.tagName?.toUpperCase() === 'BUTTON';
    });
    isInButton && e.stopPropagation();
  };

  const renderAction = (action: Recordable): ReactNode => {
    if (action.popConfirm) {
      return (
        <Popconfirm
          okButtonProps={{
            icon: isString(action.icon) ? null : action.icon,
          }}
          title={action.popConfirm.title || ''}
          {...(action as any)}
        >
          <Button type="link" size="small">
            {action.label}
          </Button>
        </Popconfirm>
      );
    } else {
      return (
        <Button
          type="link"
          {...(pick(action, ['type', 'size', 'onClick']) as any)}
          size="small"
        >
          {action.label}
        </Button>
      );
    }
  };

  return (
    <div
      className={`${styles[prefixCls]} ${styles[getAlign()]} ${className}`}
      onClick={onCellClick}
    >
      {currentActions?.map((action, index) => {
        return (
          <div
            key={index}
            className={`${styles[prefixCls]} ${styles[getAlign()]}`}
          >
            {action.tooltip && (
              <Tooltip {...getTooltip(action.tooltip)}>
                {renderAction(action)}
              </Tooltip>
            )}
            {!action.tooltip && renderAction(action)}
            {action.divider && currentActions.length > 0 && (
              <Divider type="vertical" className="action-divider" />
            )}
          </div>
        );
      })}
      {currentDropdownList.length > 0 && (
        <Dropdown
          trigger={['hover']}
          dropMenuList={currentDropdownList}
          popconfirm={true}
        >
          {more ? (
            more
          ) : (
            <Button type="link" size="small">
              <MoreOutlined className="icon-more" />
            </Button>
          )}
        </Dropdown>
      )}
    </div>
  );
};

export default TableAction;
