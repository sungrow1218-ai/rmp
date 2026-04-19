// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-depth */
import React, { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  useSensor,
  useSensors,
  MouseSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button, Checkbox, Dropdown, message } from 'antd';
import ColumnSrc from '@/assets/common/column.png';
import { CSS } from '@dnd-kit/utilities';
import styles from './styles.less';
import { buildShortUUID } from '@/utils/uuid';
import useMenuInfo from '@/hooks/useMenuInfo';
import { useUserInfo } from '@/hooks';
import {
  alterUserMenuConfiguration,
  queryUserMenuConfiguration,
} from '@/services/riskControlAlarm';
import { UserInfoResponseDataType } from '@/services/auth/index';
import { MenuItemType } from '@/services/menu';
import { useUpdateEffect } from 'ahooks';

export interface ColumnItem {
  label: string;
  value: any;
  checked?: boolean;
  disabled?: boolean;
}

interface IProp {
  columns: ColumnItem[];
  onColumnChange: (columns: ColumnItem[]) => void;
  customKey?: string;
}

const ColItem: React.FC<{
  id: string;
  colItem: ColumnItem;
  onChange: (checked: boolean) => void;
}> = ({ id, colItem, onChange }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Checkbox
        checked={colItem.checked}
        disabled={colItem.disabled || false}
        onChange={(e) => onChange(e.target.checked)}
      >
        {colItem.label}
      </Checkbox>
    </div>
  );
};

const ColManage: React.FC<IProp> = ({ columns, onColumnChange, customKey }) => {
  const [columnList, setColumnList] = useState<({ id: string } & ColumnItem)[]>(
    []
  );

  const hasGetConfig = useRef(false);

  const userInfo = useUserInfo();
  const userInfoCache = useRef<UserInfoResponseDataType>();
  const menuInfo = useMenuInfo();
  const menuInfoCache = useRef<MenuItemType>();

  const cacheRef = useRef();

  useEffect(() => {
    const queryConfig = async () => {
      try {
        const res = await queryUserMenuConfiguration({
          pageId: 1,
          pageSize: 5000,
          filterCondition: {
            menuId: menuInfoCache.current!.menuId,
            userCode: userInfoCache.current!.displayName,
          },
        });
        if (res.code !== 0) {
          throw Error(res.message);
        }
        if (
          res.data &&
          res.data.resultList &&
          res.data.resultList[0] &&
          res.data.resultList[0].configuration
        ) {
          const config = JSON.parse(res.data.resultList[0].configuration);
          cacheRef.current = config;
          const columnConfig = customKey ? config[customKey] : config;
          if (columnConfig && columnConfig.length !== 0) {
            const result = [];
            const copyed = [...columns];
            for (const item of columnConfig) {
              const targetIndex = copyed.findIndex((i) => i.value === item.key);
              if (targetIndex > -1) {
                result.push({
                  ...copyed[targetIndex],
                  checked: item.show === 1,
                });
                copyed.splice(targetIndex, 1);
              }
            }
            setColumnList(
              [...result, ...copyed].map((i) => ({
                ...i,
                id: buildShortUUID(),
                disabled: i.disabled || false,
              }))
            );
            return;
          }
        }
        setColumnList(
          [...columns].map((i) => ({
            ...i,
            id: buildShortUUID(),
            disabled: i.disabled || false,
            checked: true,
          }))
        );
      } catch (error: any) {
        console.error(error);
      } finally {
        hasGetConfig.current = true;
      }
    };
    // 缓存数据
    if (userInfo && menuInfo && !hasGetConfig.current) {
      userInfoCache.current = userInfo;
      menuInfoCache.current = menuInfo;
      queryConfig();
    }
  }, [menuInfo, userInfo]);

  const sensors = useSensors(
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setColumnList((prev) => {
        const indexList = prev.map((i) => i.id);
        const oldIndex = indexList.indexOf(active.id);
        const newIndex = indexList.indexOf(over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  useUpdateEffect(() => {
    const alterConfig = async (config: string) => {
      try {
        const res = await alterUserMenuConfiguration({
          userCode: userInfoCache.current!.displayName,
          menuId: menuInfoCache.current!.menuId,
          configuration: config,
        });
        if (res.code !== 0) {
          throw Error(res.message);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    if (hasGetConfig.current) {
      const columnsConfig = columnList.map((i) => ({
        colName: i.label,
        key: i.value,
        show: i.checked ? 1 : 0,
      }));
      alterConfig(
        JSON.stringify(
          customKey
            ? { ...(cacheRef.current || {}), [customKey]: columnsConfig }
            : columnsConfig
        )
      );
      onColumnChange(columnList);
    }
  }, [columnList]);

  const handleChecked = (id: string, checked: boolean) => {
    setColumnList((prev) => {
      const copyed = [...prev];
      const targetIndex = copyed.findIndex((i) => i.id === id);
      if (targetIndex > -1) {
        copyed[targetIndex].checked = checked;
      }
      return copyed;
    });
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columnList}
        strategy={verticalListSortingStrategy}
      >
        <Dropdown
          popupRender={(menu) => (
            <div
              className={styles.disableCheckGroup}
              style={{
                padding: '16px 10px',
                background: '#fff',
                boxShadow: '1px',
                border: '1px solid #f2f2f3',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                maxHeight: '500px',
                overflowY: 'auto',
              }}
            >
              {columnList.map((i) => (
                <ColItem
                  key={i.id}
                  id={i.id}
                  colItem={i}
                  onChange={(checked) => handleChecked(i.id, checked)}
                />
              ))}
            </div>
          )}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            icon={
              <img
                style={{
                  paddingBottom: '3px',
                  paddingRight: '4px',
                }}
                src={ColumnSrc}
              ></img>
            }
            type="primary"
            style={{ marginLeft: '16px' }}
          >
            <span>列管理</span>
          </Button>
        </Dropdown>
      </SortableContext>
    </DndContext>
  );
};

export default ColManage;
