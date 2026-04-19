// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-depth */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import styles from './styles.less';
import { Empty, Input, Tooltip, Tree, FormInstance } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import NoDataSimpleSvg from '@/assets/empty/noDataSimple.svg';
import { RULE_TYPE_LEVEL_2 } from '@/utils/dict';
import { WorkGroupList } from './type';

interface TreeData {
  key: string;
  title: React.ReactNode;
  workGroupId?: number;
  workGroupName?: string;
  ruleTypeId?: string;
  ruleTypeName?: string;
  typeId?: string;
  typeName?: string;
  subTypeId?: string;
  subTypeName?: string;
  selectable: boolean;
  isLeaf: boolean;
  children?: TreeData[];
}

interface RuleTypeItem {
  ruleTypeId: string;
  ruleTypeName: string;
  typeId: string;
  typeName: string;
  subTypeId?: string;
  subTypeName?: string;
  workGroupId: number;
  workGroupName: string;
}

// 获取点击key的时候的全部ruleType和工作台
const getChilrenInfo = (nodeData: Recordable) => {
  const list: any[] = [];
  function helper(node1: Recordable) {
    if (RULE_TYPE_LEVEL_2.some((item) => item.code === node1.ruleTypeId)) {
      list.push({
        workGroupId: node1.workGroupId,
        ruleType: node1.ruleTypeId,
      });
    }
    if (node1.children && node1.children.length > 0) {
      node1.children.forEach((child: Recordable) => helper(child));
    }
  }

  helper(nodeData);
  const map = new Map();
  for (const item of list) {
    const { workGroupId, ruleType } = item;
    // 如果已存在该workGroupId，就往数组里添加新的ruleType
    if (map.has(workGroupId)) {
      map.get(workGroupId).push(ruleType);
    } else {
      map.set(workGroupId, [ruleType]);
    }
  }
  return Array.from(map, ([workGroupId, ruleType]) => ({
    workGroupId,
    ruleType,
  }));
};

interface Props {
  workGroupRuleType: WorkGroupList[];
  setWorkGroupRuleType: (value: WorkGroupList[]) => void;
  setIsBackTreeKey: (value?: boolean) => void;
  form: FormInstance;
  isVisible: boolean;
  ruleTypeList: RuleTypeItem[];
}
interface Ref {
  onHighSelectKey: () => void;
}

const LeftClassify = forwardRef<Ref, Props>(
  (
    {
      workGroupRuleType,
      setWorkGroupRuleType,
      setIsBackTreeKey,
      form,
      isVisible,
      ruleTypeList,
    },
    ref
  ) => {
    const [selectedKey, setSelectedKey] = useState<string[]>(['-1']);
    const [searchValue, setSearchValue] = useState<string>();
    const [treeData, setTreeData] = useState<TreeData[]>([]);
    const [expandedKeys, setExpandedKeys] = useState<string[]>([]);

    const onSelect = (_: any, info: Recordable) => {
      const _workGroupList = getChilrenInfo(info.node);
      form.resetFields(['ruleType']);
      setWorkGroupRuleType(_workGroupList as WorkGroupList[]);
      setSelectedKey([info.node.key]);
      setIsBackTreeKey();
    };

    useEffect(() => {
      if (ruleTypeList && ruleTypeList.length > 0) {
        const map = new Map();
        for (const item of ruleTypeList) {
          const { workGroupId, ruleTypeId } = item;
          // 如果已存在该workGroupId，就往数组里添加新的ruleType
          if (map.has(workGroupId)) {
            map.get(workGroupId).push(ruleTypeId);
          } else {
            map.set(workGroupId, [ruleTypeId]);
          }
        }
        const data = Array.from(map, ([workGroupId, ruleTypeId]) => ({
          workGroupId,
          ruleType: ruleTypeId,
        }));
        setWorkGroupRuleType(data);
        setIsBackTreeKey();
      }
    }, [ruleTypeList]);

    useImperativeHandle(
      ref,
      () => {
        return {
          onHighSelectKey: () => {
            setSearchValue('');
            if (workGroupRuleType && workGroupRuleType.length === 1) {
              const key = workGroupRuleType[0].workGroupId;
              setSelectedKey(['-1']);
              setIsBackTreeKey(true);
              const _ruleType = ruleTypeList.map((p) => p.ruleTypeId);
              const workGroupId = Number(key);
              const ruleType = [...new Set(_ruleType)];
              setWorkGroupRuleType([{ workGroupId, ruleType }]);
            }
          },
        };
      },
      [searchValue, workGroupRuleType, setIsBackTreeKey]
    );

    const filterRuleTypeList = useMemo(() => {
      if (searchValue) {
        return ruleTypeList.filter((i) => i.ruleTypeName.includes(searchValue));
      } else {
        return ruleTypeList;
      }
    }, [searchValue, ruleTypeList]);

    useEffect(() => {
      const workGroupList: TreeData[] = [];
      const subMap: { [key: string]: TreeData } = {};
      const typeMap: { [key: string]: TreeData } = {};
      const expanded: string[] = ['-1'];
      for (const {
        workGroupId,
        workGroupName,
        typeId,
        typeName,
        subTypeId,
        subTypeName,
        ruleTypeId,
        ruleTypeName,
      } of filterRuleTypeList) {
        const node: TreeData = {
          key: subTypeId
            ? `${workGroupId}-${typeId}-${subTypeId}-${ruleTypeId}`
            : `${workGroupId}-${typeId}-${ruleTypeId}`,
          workGroupId,
          workGroupName,
          typeId,
          typeName,
          subTypeId,
          subTypeName,
          ruleTypeId,
          ruleTypeName,
          selectable: true,
          isLeaf: true,
          title: (
            <Tooltip title={ruleTypeName}>
              <div>{ruleTypeName}</div>
            </Tooltip>
          ),
        };
        // 子类
        if (subTypeId) {
          const subKey = `${workGroupId}-${typeId}-${subTypeId}`;
          const parent = subMap[subKey];
          expanded.push(subKey);
          if (parent) {
            parent.children!.push(node);
          } else {
            subMap[subKey] = {
              key: subKey,
              workGroupId,
              workGroupName,
              typeId,
              typeName,
              subTypeId,
              subTypeName,
              selectable: true,
              isLeaf: false,
              title: (
                <Tooltip title={subTypeName}>
                  <div>{subTypeName}</div>
                </Tooltip>
              ),
              children: [node],
            };
          }
        }
        // 大类
        const typeKey = `${workGroupId}-${typeId}`;
        const typeParent = typeMap[typeKey];
        expanded.push(typeKey);
        if (typeParent) {
          if (subTypeId) {
            if (
              !typeParent.children?.find(
                (i) => i.key === `${workGroupId}-${typeId}-${subTypeId}`
              )
            ) {
              typeParent.children!.push(
                subMap[`${workGroupId}-${typeId}-${subTypeId}`]
              );
            }
          } else {
            typeParent.children!.push(node);
          }
        } else {
          typeMap[typeKey] = {
            key: typeKey,
            workGroupId,
            workGroupName,
            typeId,
            typeName,
            subTypeId,
            subTypeName,
            selectable: true,
            isLeaf: false,
            title: (
              <Tooltip title={typeName}>
                <div>{typeName}</div>
              </Tooltip>
            ),
            children: [
              subTypeId
                ? subMap[`${workGroupId}-${typeId}-${subTypeId}`]
                : node,
            ],
          };
        }
        // 工作台
        const workGroup = workGroupList.find(
          (i) => i.workGroupId === workGroupId
        );
        expanded.push(`${workGroupId}`);
        if (workGroup) {
          if (workGroup.children?.find((i) => i.key === typeKey)) {
            continue;
          } else {
            workGroup.children!.push(typeMap[typeKey]);
          }
        } else {
          workGroupList.push({
            key: `${workGroupId}`,
            workGroupId,
            workGroupName,
            selectable: true,
            isLeaf: false,
            title: (
              <Tooltip title={workGroupName}>
                <div>{workGroupName}</div>
              </Tooltip>
            ),
            children: [typeMap[typeKey]],
          });
        }
      }
      if (searchValue) {
        setTreeData(workGroupList[0] ? workGroupList[0].children || [] : []);
      } else {
        setTreeData([
          {
            key: '-1',
            title: '全部',
            isLeaf: false,
            selectable: true,
            children: workGroupList[0] ? workGroupList[0].children || [] : [],
          },
        ]);
      }
      setExpandedKeys([...new Set(expanded)]);
    }, [filterRuleTypeList, searchValue]);

    // 切换规则树默认选中全部
    useEffect(() => {
      setTimeout(() => setSelectedKey(['-1']), 50);
    }, [ruleTypeList]);

    return (
      <div
        className={styles.leftClassify}
        style={{
          boxShadow: isVisible ? 'none' : '0 4px 8px 0 rgba(0, 0, 0, 0.14)',
        }}
      >
        <Input
          placeholder="请输入规则类型"
          suffix={<SearchOutlined />}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          allowClear={true}
        />
        <div className={styles.treeBlock}>
          {treeData.length > 0 ? (
            <Tree
              defaultExpandAll={true}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKey}
              onSelect={onSelect}
              treeData={treeData}
              blockNode={true}
              onExpand={(keys) => setExpandedKeys(keys as string[])}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
              <Empty
                style={{ width: '100%', alignSelf: 'center' }}
                image={NoDataSimpleSvg}
                description={'暂无数据'}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default LeftClassify;
