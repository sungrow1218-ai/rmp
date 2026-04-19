import { useDesign } from '@/hooks/useDesign';
import { TableActionType } from '../types/table';
import './TableSelectionBar.less';
import { Alert, Button } from '@ht/sprite-ui';

interface IProps {
  count?: number;
  clearSelectedRowKeys?: TableActionType['clearSelectedRowKeys'];
}

const TableSelectionBar = (props: IProps) => {
  const { count = 0, clearSelectedRowKeys } = props;
  const { prefixCls } = useDesign('table-select-bar');

  return (
    <Alert
      type="info"
      showIcon={true}
      className={prefixCls}
      message={
        <>
          {count > 0 && <span>{`已选择${props.count!}条记录`}</span>}
          {count <= 0 && <span>未选中任何记录</span>}
          {count > 0 && (
            <Button onClick={clearSelectedRowKeys} size="small">
              清空
            </Button>
          )}
        </>
      }
    />
  );
};

export default TableSelectionBar;
