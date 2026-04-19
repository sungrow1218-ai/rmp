import './TableHeader.less';
import type { ColumnChangeParam, TableHeaderProps } from '../types/table';
import { Divider } from '@ht/sprite-ui';
import Setting from './settings/Index';
import { useDesign } from '@/hooks/useDesign';
import TableSelectionBar from './TableSelectionBar';

const TableHeader = (props: TableHeaderProps) => {
  const {
    title,
    tableSetting,
    showTableSetting,
    titleHelpMessage = '',
    clearSelectedRowKeys,
    count = 0,
    showSelectionBar = false,
    onColumnsChange,

    headerTop,
    tableTitle,
    toolbar,
  } = props;

  const { prefixCls } = useDesign('basic-table-header');
  const handleColumnChange = (data: ColumnChangeParam[]) => {
    onColumnsChange?.(data);
  };

  return (
    <div className="w-full">
      {headerTop && <div style={{ margin: '5px' }}>{headerTop}</div>}
      {showSelectionBar && (
        <div style={{ margin: '5px' }}>
          <TableSelectionBar
            clearSelectedRowKeys={clearSelectedRowKeys}
            count={count}
          />
        </div>
      )}
      <div className="flex items-center">
        {tableTitle}
        <div className={`${prefixCls}__toolbar`}>
          {toolbar}
          {toolbar && showTableSetting && <Divider type="vertical" />}
          {showTableSetting && (
            <Setting
              setting={tableSetting}
              onColumnsChange={handleColumnChange}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TableHeader;
