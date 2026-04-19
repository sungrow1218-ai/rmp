// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { useEffect, useMemo, useState } from 'react';
import { Button, message, Modal, Space } from '@ht/sprite-ui';
import { isArray, isEmpty } from 'lodash';
import { getSchemas } from './config';
import { BasicForm } from '@/components/Form';
import { FormProps } from 'rc-field-form/es/Form';
import TableTransfer from './TableTransfer';
// import { querySeatGroupDetail, querySeatInfo } from '../../contants/mock';
import { SeatGroupDetailParams, SeatGroupState } from '../../contants/tyeping';
import { getColumnsAdd } from '../../contants/contants';
import { useDebounce } from 'ahooks';
import {
  alterSeatGroupDetail,
  querySeatGroupDetail,
  querySeatInfo,
} from '@/services/seatGroup';

interface Props {
  selectRecord?: SeatGroupState;
  treeKey?: any;
  onClose: () => void;
  reFresh: (p?: any) => void;
}
type SearchParam = {
  seatCode?: string;
  seatName?: string;
};
const AddSeat: React.FC<Props> = ({
  selectRecord,
  onClose,
  reFresh,
  treeKey,
}) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [seatData, setSeatData] = useState<SeatGroupDetailParams[]>([]);
  const [seatDataInit, setSeatDataInit] = useState<SeatGroupDetailParams[]>([]);
  const [targetKeys, setTargetKeys] = useState<string[]>([]);
  const [searchForm, setSearchForm] = useState<SearchParam>();
  const debounceSeatch = useDebounce(searchForm, { wait: 300 });
  const handleValChange: FormProps['onValuesChange'] = (_, allValues) => {
    setSearchForm(allValues);
  };
  const handleSubmit = async () => {
    try {
      setBtnLoading(true);
      const targetItems = seatDataInit
        .filter((item) =>
          targetKeys.includes(
            `${item.seatCode}-${item.marketId}-${item.extSysId}`
          )
        )
        .map((p) => ({
          seatCode: p.seatCode,
          extSysId: p.extSysId,
          seatName: p.seatName,
          marketId: p.marketId,
        }));
      const seatGroupDetailRes = await alterSeatGroupDetail({
        modifyType: 1,
        seatGroupId: selectRecord?.seatGroupId ?? 0,
        poolSecurityList: targetItems as any[],
      });
      if (seatGroupDetailRes.code !== 0) {
        // message.error({
        //   content: `${seatGroupDetailRes.message}`,
        // });
      } else {
        onClose();
        reFresh();
        message.success({ content: '新增成功' });
      }
    } catch (error) {
    } finally {
      setBtnLoading(false);
    }
  };
  const handleCel = () => {
    onClose();
  };
  const fetch = async (form?: SearchParam) => {
    try {
      setLoading(true);
      const [resDetail, resSeatInfo] = await Promise.all([
        querySeatGroupDetail({
          pageId: 1,
          pageSize: 5000,
          seatGroupId: selectRecord?.seatGroupId ?? 0,
        }),
        querySeatInfo({
          pageId: 1,
          pageSize: 5000,
          filterCondition: {
            marketId: selectRecord?.marketId
              ? [selectRecord?.marketId]
              : undefined,
          },
        }),
      ]);
      if (resSeatInfo.code !== 0) {
        throw new Error('获取席位信息失败');
      }
      if (resDetail.code !== 0) {
        throw new Error('获取席位详细失败');
      }
      const aMap = new Map<string, boolean>();
      if (
        resDetail.data &&
        isArray(resDetail.data.resultList) &&
        resDetail.data.resultList.length > 0
      ) {
        resDetail.data.resultList.forEach((item) =>
          aMap.set(`${item.seatCode}-${item.extSysId}`, true)
        );
      }
      if (
        resSeatInfo.data &&
        isArray(resSeatInfo.data.resultList) &&
        resSeatInfo.data.resultList.length > 0
      ) {
        const data = resSeatInfo.data.resultList
          .filter((item) => !aMap.get(`${item.seatCode}-${item.extSysId}`))
          .map((p) => {
            return {
              ...p,
              key: `${p.seatCode}-${p.marketId}-${p.extSysId}`,
            };
          });
        setSeatData(data);
        if (isEmpty(form)) {
          setSeatDataInit(data);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetch();
  }, [selectRecord]);
  const transferData: SeatGroupDetailParams[] = useMemo(() => {
    const filterData = seatData.filter((item: SeatGroupDetailParams) => {
      if (debounceSeatch?.seatCode && debounceSeatch?.seatName) {
        return (
          item.seatCode!.toLowerCase().includes(debounceSeatch?.seatCode) &&
          item.seatName!.toLowerCase().includes(debounceSeatch?.seatName)
        );
      } else if (debounceSeatch?.seatCode && !debounceSeatch?.seatName) {
        return item.seatCode!.toLowerCase().includes(debounceSeatch?.seatCode);
      } else if (debounceSeatch?.seatName && !debounceSeatch?.seatCode) {
        return item.seatName!.toLowerCase().includes(debounceSeatch?.seatName);
      } else {
        return item;
      }
    });
    // 获取当前已选中的目标项
    const targetItems = seatData.filter((item) =>
      targetKeys.includes(`${item.seatCode}-${item.marketId}-${item.extSysId}`)
    );
    // 合并过滤后的源数据和全部目标数据
    return [
      ...filterData,
      ...targetItems.filter(
        (targetItem) => !filterData.some((item) => item.key === targetItem.key)
      ),
    ];
  }, [debounceSeatch, targetKeys, seatData]);
  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };
  const leftTotalSize = useMemo(() => {
    return transferData.filter(
      (item) =>
        !targetKeys.includes(
          `${item.seatCode}-${item.marketId}-${item.extSysId}`
        )
    ).length;
  }, [transferData, targetKeys]);
  const domWidth = useMemo(() => {
    return document.body.offsetWidth > 1500
      ? Math.floor(document.body.offsetWidth * 0.7)
      : 1350;
  }, []);
  return (
    <Modal
      title="添加席位"
      destroyOnClose={true}
      open={true}
      maskClosable={false}
      onCancel={handleCel}
      transitionName={''}
      maskTransitionName={''}
      centered={true}
      width={domWidth}
      footer={[
        <Button key="back" onClick={handleCel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmit}
          loading={btnLoading}
        >
          确认
        </Button>,
      ]}
    >
      <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
        <BasicForm
          layout="inline"
          schemas={getSchemas()}
          onValuesChange={handleValChange}
        />
        <TableTransfer
          dataSource={transferData}
          targetKeys={targetKeys}
          showSearch={false}
          onChange={onChange}
          leftColumns={getColumnsAdd()}
          rightColumns={getColumnsAdd()}
          showSelectAll={true}
          rowKey={(record) =>
            `${record.seatCode}-${record.marketId}-${record.extSysId}`
          }
          loaded={loading}
          selectAllLabels={['未添加席位', '待添加席位']}
          titles={[`共${leftTotalSize}条`, `共${targetKeys.length}条`]}
          initData={seatDataInit}
        />
      </Space>
    </Modal>
  );
};

export default AddSeat;
