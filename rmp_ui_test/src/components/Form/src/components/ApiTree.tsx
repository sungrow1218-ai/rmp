import { Tree, TreeProps, Spin, TreeDataNode } from 'antd';
import { useMount } from 'ahooks';
import { get, isFunction } from 'lodash';
import React, { useRef, useState } from 'react';

export interface IProps extends TreeProps {
  api?: (arg: any) => Promise<Recordable>;
  params?: Recordable;
  immediate?: boolean;
  resultField?: string;
  beforeFetch?: Fn;
  afterFetch?: Fn;
  value?: TreeProps['selectedKeys'];
  onOptionsChange?: (treeData: TreeDataNode[]) => void;
}

const ApiTree = (props: IProps) => {
  const {
    api = null,
    params = {},
    immediate = true,
    resultField = '',
    beforeFetch = null,
    afterFetch = null,
    onOptionsChange = null,
    ...restProps
  } = props;

  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState<TreeDataNode[]>([]);

  const isFirstLoaded = useRef(false);

  useMount(() => {
    immediate && fetch();
  });

  async function fetch() {
    if (!api || !isFunction(api)) return;
    let _treeData = [];
    setLoading(true);
    let res;
    try {
      let _params = params;
      if (beforeFetch && isFunction(beforeFetch)) {
        _params = (await beforeFetch(params)) || params;
      }
      res = await api(params);
      if (afterFetch && isFunction(afterFetch)) {
        res = (await afterFetch(res)) || res;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
    if (!res) return;
    if (resultField) {
      res = get(res, resultField) || [];
    }
    _treeData = (res as (Recordable & { key: string | number })[]) || [];
    setTreeData(_treeData);
    isFirstLoaded.current = true;
    onOptionsChange && onOptionsChange(_treeData);
  }

  return (
    <div>
      {loading ? <Spin /> : <Tree treeData={treeData} {...restProps} />}
    </div>
  );
};

export default ApiTree;
