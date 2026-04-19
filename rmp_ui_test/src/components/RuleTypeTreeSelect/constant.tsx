import { TreeDataNode } from 'antd';

export const RuleTypeTreeData: TreeDataNode[] = [
  {
    title: '投资资产类风控',
    key: 'A',
    isLeaf: false,
    checkable: true,
    selectable: false,
    children: [
      {
        title: '证券持仓数量控制',
        key: 'A1',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '资产市值控制',
        key: 'E01',
        isLeaf: true,
        selectable: false,
      },
    ],
  },
  {
    title: '交易行为类风控',
    key: 'B',
    isLeaf: false,
    checkable: true,
    selectable: false,

    children: [
      {
        title: '交易额控制',
        key: 'F1',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '资金前端控制',
        key: 'F2',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '价格偏离度控制',
        key: 'H1',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '证券买卖控制',
        key: 'I1',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '证券禁买控制',
        key: 'I51',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '期货申报速率控制',
        key: 'Q51000',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '委托撤单比控制',
        key: 'O01',
        isLeaf: true,
        selectable: false,
      },
    ],
  },
  {
    title: '异常交易类风控',
    key: 'Z',
    isLeaf: false,
    checkable: true,
    selectable: false,
    children: [
      {
        title: '同反向控制',
        key: 'J1',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '同反向控制(单向豁免)',
        key: 'J2',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '自买自卖或互为对手方控制',
        key: 'J3',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '拉抬打压控制',
        key: 'Z01',
        isLeaf: false,
        checkable: true,
        selectable: false,

        children: [
          {
            title: '开盘集合竞价阶段拉抬打压控制',
            key: 'Z01101',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '开盘集合竞价阶段拉抬打压且反向控制',
            key: 'Z01102',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '连续竞价阶段拉抬打压控制',
            key: 'Z01201',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '连续竞价阶段拉抬打压且反向控制',
            key: 'Z01202',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '收盘集合竞价阶段拉抬打压控制',
            key: 'Z01301',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '收盘集合竞价阶段拉抬打压且反向控制',
            key: 'Z01302',
            isLeaf: true,
            selectable: false,
          },
        ],
      },
      {
        title: '严重异常波动标的申报速率控制',
        key: 'Z02',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '虚假申报控制',
        key: 'Z03',
        isLeaf: false,
        checkable: true,
        selectable: false,

        children: [
          {
            title: '开盘集合竞价阶段虚假申报控制',
            key: 'Z03101',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '连续竞价阶段虚假申报控制(创业板)',
            key: 'Z03201',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '连续竞价阶段虚假申报控制',
            key: 'Z03202',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '涨跌幅限制价位虚假申报控制',
            key: 'Z03203',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '连续竞价阶段虚假申报控制(简化)',
            key: 'Z03000',
            isLeaf: true,
            selectable: false,
          },
        ],
      },
      {
        title: '异常报撤单控制',
        key: 'Z04',
        isLeaf: true,
        selectable: false,
      },
      {
        title: '维持涨跌幅限制价格控制',
        key: 'Z05',
        isLeaf: false,
        checkable: true,
        selectable: false,

        children: [
          {
            title: '连续竞价阶段维持涨跌幅限制价格控制',
            key: 'Z05201',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '收盘集合竞价阶段维持涨跌幅限制价格控制',
            key: 'Z05301',
            isLeaf: true,
            selectable: false,
          },
        ],
      },
      {
        title: '回转交易控制',
        key: 'Z07',
        isLeaf: false,
        checkable: true,
        selectable: false,

        children: [
          {
            title: '大量频繁回转交易控制',
            key: 'Z07201',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '频繁日内回转控制',
            key: 'Z07301',
            isLeaf: true,
            selectable: false,
          },
        ],
      },
    ],
  },
  {
    title: '程序化交易控制',
    key: 'M',
    isLeaf: false,
    checkable: true,
    selectable: false,
    children: [
      {
        title: '证券交易所',
        key: 'Z06',
        isLeaf: false,
        checkable: true,
        selectable: false,
        children: [
          {
            title: '单日申报数量控制',
            key: 'Z06001',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '每秒申报数量控制',
            key: 'Z06002',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '频繁瞬时撤单控制',
            key: 'Z06003',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '频繁拉抬打压控制',
            key: 'Z06004',
            isLeaf: true,
          },
          {
            title: '短时间大额成交控制',
            key: 'Z06005',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '瞬时申报速率异常控制',
            key: 'Z06006',
            isLeaf: true,
            selectable: false,
          },
        ],
      },
      {
        title: '贵金属交易所',
        key: 'Z062',
        isLeaf: false,
        checkable: true,
        selectable: false,
        children: [
          {
            title: '瞬时申报速率控制',
            key: 'Z06202',
            isLeaf: true,
            selectable: false,
          },
        ],
      },
      {
        title: '期货交易所',
        key: 'Z061',
        isLeaf: false,
        checkable: true,
        selectable: false,
        children: [
          {
            title: '单日申报数量控制',
            key: 'Z06101',
            isLeaf: true,
            selectable: false,
          },
          {
            title: '每秒申报数量控制',
            key: 'Z06102',
            isLeaf: true,
            selectable: false,
          },
        ],
      },
    ],
  },
];

const formatTreeWithValue = (tree: TreeDataNode[]): TreeDataNode[] => {
  // 边界条件：如果不是数组或为空，直接返回
  if (!Array.isArray(tree) || tree.length === 0) return [];

  return tree.map((node) => {
    // 解构节点，避免直接修改原对象
    const { children, key, title, ...rest } = node;

    const formattedNode = {
      ...rest,
      key, // 保留原key（必须唯一）
      title,
      children,
      value: `${title as string}|${key}`, // value 赋值为 key
    };

    // 递归处理子节点（如果有children）
    if (Array.isArray(children) && children.length > 0) {
      formattedNode.children = formatTreeWithValue(children);
    }

    return formattedNode;
  });
};

export const RuleTypeTreeDataValue = formatTreeWithValue(RuleTypeTreeData);
