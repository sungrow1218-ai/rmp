import { useTableContextSelctor } from '../../hooks/useTableContext';
import { Tooltip, TooltipProps } from '@ht/sprite-ui';
import { RedoOutlined } from '@ant-design/icons';

const RedoSetting = (props: TooltipProps) => {
  const reload = useTableContextSelctor((state) => state.reload);

  return (
    <Tooltip placement="top" title={'刷新'} {...props}>
      <RedoOutlined
        onClick={() => {
          reload();
        }}
      />
    </Tooltip>
  );
};

export default RedoSetting;
