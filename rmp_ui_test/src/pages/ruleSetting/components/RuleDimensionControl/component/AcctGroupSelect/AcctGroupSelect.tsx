import React, {
  CSSProperties,
  FC,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { SobInfo } from '@/services/account';
import DisabledContext from 'antd/es/config-provider/DisabledContext';
import {
  ConfigProvider,
  Empty,
  message,
  Popover,
  Select,
  SelectProps,
  Tree,
  TreeProps,
} from 'antd';
import {
  queryAccountGroup,
  ResponseAccountGroupItem,
} from '@/services/accountGroup';
import styles from './styles.less';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import { CloseOutlined } from '@ant-design/icons';

interface Props {
  sobInfo?: SobInfo;
  value?: { accountCode: string }[];
  onChange?: (value: { accountCode: string }[]) => void;
  style?: CSSProperties;
}

interface TreeData {
  key: string | number;
  bookLevel: number;
  bookType: number;
  isLeaf: boolean;
  selectable: boolean;
  checkable: boolean;
  title: React.ReactNode;
  acctGroupId?: number;
  acctGroupName?: string;
  children?: TreeData[];
}

const convertToTree = (
  arr: (ResponseAccountGroupItem & { bookLevelName: string })[]
) => {
  const tree: TreeData[] = [];
  for (const item of arr) {
    const exist = tree.find(
      (i) => i.bookLevel === item.bookLevel && i.bookType === item.bookType
    );
    const acctGroupItem = {
      key: item.acctGroupId,
      acctGroupId: item.acctGroupId,
      acctGroupName: item.acctGroupName,
      bookType: item.bookType,
      bookLevel: item.bookLevel,
      isLeaf: true,
      selectable: true,
      checkable: true,
      title: `${item.acctGroupId}-${item.acctGroupName}`,
    };
    if (exist) {
      exist.children!.push(acctGroupItem);
    } else {
      tree.push({
        key: `${item.bookType}|${item.bookLevel}`,
        bookType: item.bookType,
        bookLevel: item.bookLevel,
        isLeaf: false,
        title: item.bookLevelName,
        selectable: false,
        checkable: false,
        children: [acctGroupItem],
      });
    }
  }
  return tree;
};

const AcctGroupSelect: FC<Props> = ({
  sobInfo,
  value,
  onChange,
  style = {},
}) => {
  const disabled = useContext(DisabledContext);

  const [checkedKeys, setCheckedKeys] = useState<number[]>([]);

  const [acctGroups, setAcctGroups] = useState<
    (ResponseAccountGroupItem & { bookLevelName: string })[]
  >([]);

  const [searchValue, setSearchValue] = useState<string>();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      // 节点映射
      let nodeMap: Recordable = {};
      for (const { bookLevelList, bookType } of sobInfo!.bookList) {
        nodeMap = bookLevelList.reduce(
          (prev, cur) => ({
            ...prev,
            [`${bookType}|${cur.bookLevel}`]: cur.bookLevelName,
          }),
          nodeMap
        );
      }
      // 获取数据
      try {
        const res = await queryAccountGroup({
          pageId: 1,
          pageSize: 5000,
          authFlag: 1,
          filterCondition: {
            workGroupId: sobInfo?.workGroupId,
          },
        });
        if (res.code !== 0) {
          throw Error('查询账户组失败');
        }
        if (res.data && res.data.resultList) {
          setAcctGroups(
            res.data.resultList.map((i) => ({
              ...i,
              bookLevelName: nodeMap[`${i.bookType}|${i.bookLevel}`],
            }))
          );
        }
      } catch (error: any) {
        console.error(error);
        // error.message && message.error(error.message);
      }
    };
    if (sobInfo && sobInfo.workGroupId) {
      fetch();
    }
  }, [sobInfo]);

  const filterAcctGroups = useMemo(() => {
    if (searchValue) {
      return acctGroups.filter((item) =>
        `${item.acctGroupId}-${item.acctGroupName}`.includes(searchValue)
      );
    } else {
      return acctGroups;
    }
  }, [searchValue, acctGroups]);

  const getTreeData = useMemo<TreeData[]>(
    () => convertToTree(filterAcctGroups),
    [filterAcctGroups]
  );

  const handleCheck: TreeProps['onCheck'] = (
    _,
    e: { checked: boolean; node: any }
  ) => {
    let result: number[] = [...checkedKeys];
    if (e.checked) {
      result.push((e.node as TreeData).key as number);
    } else {
      result = result.filter((i) => i !== e.node.key);
    }
    setCheckedKeys(result);
    const filters = acctGroups.filter((i) => result.includes(i.acctGroupId));
    onChange &&
      onChange(
        filters.map((i) => ({
          accountCode: `${i.acctGroupId}`,
          type: `${i.bookType}|${i.bookLevel}`,
        }))
      );
  };

  const realValue = useMemo(() => {
    if (value && value.length > 0) {
      const result = [];
      for (const item of acctGroups) {
        if (value.find((i) => Number(i.accountCode) === item.acctGroupId)) {
          result.push({
            label: `${item.acctGroupId}-${item.acctGroupName}`,
            value: item.acctGroupId,
            type: `${item.bookType}|${item.bookLevel}`,
          });
        }
      }
      return result;
    }
    return [];
  }, [value, acctGroups]);

  const renderPopoverContent = (
    <div className={styles.previewContent}>
      {(realValue || []).map((i, index: number) => (
        <div className={styles.item} key={index}>
          <div className={styles.text}>{i.label}</div>
          {!disabled && (
            <CloseOutlined
              onClick={() => {
                const list = realValue.filter((o) => o.value !== i.value);
                onChange &&
                  onChange(
                    list.map((o) => ({
                      accountCode: `${o.value}`,
                      type: o.type,
                    }))
                  );
              }}
              style={{
                marginLeft: '4px',
                fontSize: '10px',
                cursor: 'pointer',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

  useEffect(() => {
    if (value) {
      setCheckedKeys(value.map((i) => Number(i.accountCode)));
    } else {
      setCheckedKeys([]);
    }
  }, [value]);

  const [expandedKeys, setExpandedKeys] = useState<number[]>([]);

  useEffect(() => {
    setExpandedKeys(getTreeData.map((i) => i.key as number));
  }, [getTreeData]);

  const getProps: SelectProps = {
    mode: 'multiple',
    labelInValue: true,
    allowClear: true,
    value: realValue,
    placeholder: '请选择',
    maxTagCount: 'responsive',
    dropdownStyle: { maxHeight: '300px', overflow: 'auto' },
    searchValue,
    style,
    onChange: (values) =>
      onChange &&
      onChange(
        values.map((i: { label: string; value: string; type: string }) => ({
          accountCode: `${i.value}`,
          type: i.type,
        }))
      ),
    onDropdownVisibleChange: (open) => {
      if (!open) {
        setSearchValue('');
      }
    },
    onSearch: (search) => setSearchValue(search),
    dropdownRender: () => {
      if (getTreeData.length === 0) {
        return <Empty image={NoDataSimpleSvg} description={'暂无数据'} />;
      } else {
        return (
          <Tree
            treeData={getTreeData}
            checkable={true}
            defaultExpandAll={true}
            onCheck={handleCheck}
            checkedKeys={checkedKeys}
            expandedKeys={expandedKeys}
            onExpand={(keys) => setExpandedKeys(keys as number[])}
          />
        );
      }
    },
  };

  useEffect(() => {
    if (value && value.length === 0) {
      setOpen(false);
    }
  }, [value]);

  return (
    <ConfigProvider getPopupContainer={() => document.body}>
      <Popover
        content={renderPopoverContent}
        placement="topRight"
        getPopupContainer={() => document.body}
        open={open}
        onOpenChange={(state) => {
          if (value && value.length > 0) {
            setOpen(state);
          } else {
            setOpen(false);
          }
        }}
      >
        <Select {...getProps} />
      </Popover>
    </ConfigProvider>
  );
};

export default AcctGroupSelect;
