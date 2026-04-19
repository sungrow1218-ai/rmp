import React, { useState } from 'react';

import { KEEPALIVE_CACHE_KEY } from '@/utils/constant';
import withKeepAlive from '@/wrappers/KeepAlive';

import RiskMain, { TableDataList } from './components/RiskMain/RiskMain';
import RiskDetails from './components/Riskdetails/RiskDetails';
import { useSystemInfo } from '@/hooks';

const RiskControlAlarm = () => {
  const [openDetails, setOpenDetails] = useState(false);
  const [detailData, setDetailData] = useState<TableDataList | undefined>(
    undefined
  );
  const systemInfo = useSystemInfo();
  return (
    <div>
      <RiskMain
        open={openDetails}
        setDetailData={setDetailData}
        setOpen={setOpenDetails}
        systemInfo={systemInfo}
      />
      <RiskDetails
        open={openDetails}
        detailData={detailData}
        setOpen={setOpenDetails}
        systemInfo={systemInfo}
      />
    </div>
  );
};

export default withKeepAlive({
  cacheKey: KEEPALIVE_CACHE_KEY.RISK_CONTROL_ALARM,
})(RiskControlAlarm);
