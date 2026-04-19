import React, { useEffect, useMemo, useRef, useState } from 'react';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { Button, Input, message } from '@ht/sprite-ui';
import styles from './style.less';
import { useHeightResize } from '@/hooks';
import { DownloadOutlined, SearchOutlined } from '@ht-icons/sprite-ui-react';
import { BasicColumn, BasicTable, TableActionType } from '@/components/Table';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import { downloadByUrl } from '@/utils/file';
import { MenuAuthListParamType } from '../roleManage/contant/typing';
import { FUNC_TYPE, USE_AUTH } from '@/enum';
import useEIP from '@/directives/useEIP';
import {
  exportDynamicDimSecurity,
  queryDynDimDetail,
} from '@/services/dynamicDimension/index';

const columns: BasicColumn[] = [
  {
    title: '动态维度',
    dataIndex: 'dyndimName',
    align: 'left',
    width: '30%',
    render: (value) => value || '--',
  },
  {
    title: '证券代码',
    dataIndex: 'securityCode',
    align: 'left',
    render: (value) => value || '--',
  },
  {
    title: '证券名称',
    dataIndex: 'securityName',
    align: 'left',
    render: (value) => value || '--',
  },
  {
    title: '交易所',
    dataIndex: 'marketId',
    align: 'left',
    render: (value) =>
      transformDictCodeToNameHelper(value.toString(), TRADING_MARKETS),
  },
  {
    title: '更新时间',
    dataIndex: 'lastUpdateTime',
    align: 'left',
    render: (value) => value || '--',
  },
];

let debounceTimer: any = null;

const List: React.FC<{
  selected: Nullable<Recordable>;
  menuAuth: Nullable<MenuAuthListParamType>;
}> = ({ selected, menuAuth }) => {
  const domRef = useRef(null);

  const domHeight = useHeightResize(domRef);

  const tableRef = useRef<TableActionType>(null);

  const [searchValue, setSearchValue] = useState('');

  const [_, eipRef] = useEIP();

  useEffect(() => {
    calculate();
  }, [domHeight]);

  const calculate = () => {
    if (tableRef.current) {
      tableRef.current.setProps({
        scroll: {
          y: domHeight
            ? tableRef.current.getDataSource().length > 0
              ? domHeight - 167
              : domHeight - 110
            : 400,
        },
      });
    }
  };

  useEffect(() => {
    setSearchValue('');
    if (selected && tableRef.current) {
      tableRef.current?.reload({
        pagination: { current: 1 },
        searchInfo: {
          filterCondition: {
            dyndimId: selected.dyndimId,
            securityCode: null,
          },
        },
      });
    } else {
      tableRef.current?.clearTableData();
    }
  }, [selected]);

  // 搜索处理
  const handleSearch = (value: string) => {
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    debounceTimer = setTimeout(() => {
      if (tableRef.current && selected) {
        tableRef.current?.reload({
          pagination: { current: 1 },
          searchInfo: {
            filterCondition: {
              dyndimId: selected.dyndimId,
              securityCode: value || null,
            },
          },
        });
      }
    }, 500);
  };

  // 导出操作
  const doExport = async () => {
    try {
      const {
        data: { fileUrl },
      } = await exportDynamicDimSecurity({
        securityDimensionId: selected!.dyndimId,
      });
      downloadByUrl({ url: fileUrl });
      message.success('操作成功');
    } catch (error) {
      console.error(error);
    }
  };

  // 权限-查询
  const queryPermission = useMemo(() => {
    if (menuAuth) {
      const auth =
        menuAuth.functionAuthList?.find(
          (item) => item.functionId === FUNC_TYPE.QUERY
        )?.useAuth === USE_AUTH.USED;
      return !!auth;
    }
    return false;
  }, [menuAuth]);

  return (
    <>
      <div className={styles.title}>
        <img src={TitleImgSrc} style={{ width: '24px', height: '24px' }} />
        <span>证券明细列表</span>
      </div>
      <div ref={domRef} className={styles.symbols}>
        <div className={styles.actionBar}>
          <Input
            prefix={<SearchOutlined />}
            className={styles.symbolsSearch}
            onChange={(e) => {
              setSearchValue(e.target.value);
              handleSearch(e.target.value);
            }}
            placeholder="请输入证券代码"
            value={searchValue}
            allowClear={true}
            style={{ width: '240px' }}
          />
          {selected && queryPermission ? (
            <Button type="link" ref={eipRef} onClick={doExport}>
              <DownloadOutlined />
              下载
            </Button>
          ) : null}
        </div>
        <div style={{ height: 'calc(100% - 64px)' }}>
          <BasicTable
            ref={tableRef}
            fetchSetting={{
              listField: 'data.resultList',
              pageField: 'pageId',
              totalField: 'data.totalSize',
            }}
            style={{ width: '100%', height: '100%' }}
            columns={columns}
            api={queryDynDimDetail}
            immediate={false}
            onDataChange={calculate}
            autoCreateKey={true}
            pagination={{
              showTotal: (total) => `总数：${total}`,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showQuickJumper: true,
              size: 'default',
            }}
          />
        </div>
      </div>
    </>
  );
};

export default List;
