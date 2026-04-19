import { useTableContextSelctor } from '../../hooks/useTableContext';
import { useFullscreen } from 'ahooks';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
} from '@ht-icons/sprite-ui-react';
import { Tooltip, TooltipProps } from '@ht/sprite-ui';

const FullScreenSetting = (props: TooltipProps) => {
  const wrapRef = useTableContextSelctor((state) => state.wrapRef);
  const [isFullscreen, { toggleFullscreen, exitFullscreen }] =
    useFullscreen(wrapRef);

  return (
    <Tooltip placement="top" title={'全屏'} {...props}>
      {!isFullscreen && <FullscreenOutlined onClick={toggleFullscreen} />}
      {isFullscreen && <FullscreenExitOutlined onClick={exitFullscreen} />}
    </Tooltip>
  );
};

export default FullScreenSetting;
