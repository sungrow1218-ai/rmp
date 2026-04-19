import React, { useEffect, useState } from 'react';
import { Button, Form, message, Modal } from '@ht/sprite-ui';

import { v4 as uuidv4 } from 'uuid';
import SearchForm from './Form/SearchForm';
import TimeForm from './Form/TimeForm';
import {
  FutureOptionList,
  FutureOptionParams,
  queryFuturDetail,
  queryFutureOptionLimitDetail,
  queryFuturTemplate,
  ResultList,
  TemplateParams,
} from '@/services/FutureOption';
import { FormInstance } from '@ht/sprite-ui/es/form';
import ModalTable from './Table/ModalTable';
// import { templateData } from './Fututres/futureposlimit';
import {
  addHaveKey,
  filterHaveKey,
  sortEditData,
  tranformKindInfo,
  tranTimeForm,
} from './until';
import { useMemoizedFn } from 'ahooks';

interface Props {
  tabKey: string;
  open: boolean;
  handChange: (open: boolean) => void;
  selectItems: FutureOptionList[];
  buttonType: string;
  form: FormInstance;
  allKindCode: ResultList[];
  setFuteres: (data: FutureOptionList[]) => Promise<void>;
  groupId: number;
}

const OptinsModal: React.FC<Props> = ({
  tabKey,
  open,
  handChange,
  selectItems,
  buttonType,
  form,
  setFuteres,
  allKindCode,
  groupId,
}) => {
  const [timeOpen, setTimeOpen] = useState(false);
  const [timeForm] = Form.useForm();
  const [editData, setEditData] = useState<FutureOptionList[]>([]);
  const [editTimeData, setTimeEditData] = useState<FutureOptionList | null>(
    null
  );
  const [timeType, setTimeType] = useState('Edit'); // Edit Add Delete
  const [templateData, SetTemplateData] = useState<FutureOptionList[]>([]);
  const [tempHaveList, setTempHaveList] = useState<FutureOptionList[]>([]);
  const watchMarket = Form.useWatch('marketId', form);
  const watchKind = Form.useWatch('kindCode', form);

  const onTemplate = useMemoizedFn(async () => {
    // try {
    if (!(watchMarket && watchKind)) {
      SetTemplateData([]);
      return;
    }
    const params: TemplateParams = {
      marketId: Number(watchMarket),
      limitType: Number(tabKey),
      kindCode: watchKind,
    };
    const result = await queryFuturTemplate(params);
    if (result.code !== 0) {
      // message.error({
      //   content: `${result.message}`,
      // });
      return;
    }
    const tempData = result.data?.templateData
      ? JSON.parse(result.data?.templateData)
      : [];
    SetTemplateData(tempData);
  });
  const onTempHaveSet = useMemoizedFn(async () => {
    try {
      if (!(watchMarket && watchKind)) {
        setTempHaveList([]);
        return;
      }
      const params: FutureOptionParams = {
        pageId: 1,
        pageSize: 5000,
        filterCondition: {
          marketId: [Number(watchMarket)],
          limitType: Number(tabKey),
          kindCode: [watchKind],
          groupId,
        },
      };
      const result = await queryFutureOptionLimitDetail(params);
      if (result.code !== 0) {
        // message.error({
        //   content: `${result.message}`,
        // });
        return;
      }
      setTempHaveList(result.data?.resultList ?? []);
    } catch (error) {
      // message.error({ content: `${JSON.stringify(error)}` });
    }
  });
  useEffect(() => {
    if (buttonType === 'Edit' || buttonType === 'Copy') {
      setEditData([...sortEditData(selectItems)]);
    } else if (buttonType === 'Add' && watchKind && watchMarket) {
      const _modeData = tranformKindInfo(templateData);
      const modelKeyData = addHaveKey(_modeData);
      const haveSetData = addHaveKey(tempHaveList);
      const modelData = filterHaveKey(modelKeyData, haveSetData);
      setEditData([...sortEditData(modelData)]);
    } else {
      setEditData([]);
    }
  }, [
    buttonType,
    selectItems,
    tempHaveList,
    templateData,
    groupId,
    watchKind,
    watchMarket,
  ]);

  useEffect(() => {
    if (buttonType === 'Add' && open) {
      onTemplate();
      onTempHaveSet();
    }
  }, [buttonType, onTempHaveSet, onTemplate, watchKind, watchMarket, open]);

  const compareChange = (value: string, record: FutureOptionList) => {
    setEditData((prenList) => {
      return prenList.map((item) => {
        if (item.key === record.key) {
          return {
            ...item,
            compareDirection: Number(value),
          };
        }
        return item;
      });
    });
  };
  const onQuantityChange = (value: number, record: FutureOptionList) => {
    setEditData((prenList) => {
      return prenList.map((item) => {
        if (item.key === record.key) {
          if (Number(value) < 1) {
            return {
              ...item,
              marketPositionQuantity: 1,
            };
          }
          return {
            ...item,
            marketPositionQuantity: Number(value),
          };
        }
        return item;
      });
    });
  };
  const onThresholdNumberChange = (value: number, record: FutureOptionList) => {
    setEditData((prenList) => {
      return prenList.map((item) => {
        if (item.key === record.key) {
          if (Number(value) < 0) {
            return {
              ...item,
              threshold: 0,
            };
          }
          if (Number(value) > 9999999) {
            return {
              ...item,
              threshold: 9999999,
            };
          }
          return {
            ...item,
            threshold: Number(value),
          };
        }
        return item;
      });
    });
  };
  const onThresholdChange = (value: number, record: FutureOptionList) => {
    setEditData((prenList) => {
      return prenList.map((item) => {
        if (item.key === record.key) {
          if (Number(value) < 0.01) {
            return {
              ...item,
              threshold: 0.0,
            };
          }
          if (Number(value) > 100) {
            return {
              ...item,
              threshold: 100,
            };
          }
          return {
            ...item,
            threshold: value,
          };
        }
        return item;
      });
    });
  };
  const submitTimeForm = async () => {
    const formData = await timeForm.validateFields();
    const timeData = tranTimeForm(formData) as FutureOptionList;
    if (timeType === 'Edit') {
      setEditData((prenList) => {
        return prenList.map((item) => {
          if (item.key === editTimeData?.key) {
            return {
              ...item,
              ...timeData,
            };
          }
          return item;
        });
      });
    }
    if (timeType === 'Add') {
      setEditData([...editData, timeData]);
    }
    setTimeOpen(false);
    setTimeEditData(null);
  };

  return (
    <div>
      <Modal
        width={1200}
        open={open}
        centered={true}
        maskClosable={false}
        okButtonProps={{
          disabled:
            !(watchKind && watchMarket) ||
            (buttonType === 'Add' && editData.length === 0),
        }}
        onOk={() => {
          setFuteres(editData);
        }}
        onCancel={() => {
          handChange(false);
          form.resetFields();
          SetTemplateData([]);
          setEditData([]);
        }}
        title={tabKey === '1' ? '期货限仓额度' : '期权限仓额度'}
      >
        <div
          style={{
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'space-between',
          }}
        >
          <SearchForm
            tabKey={tabKey}
            form={form}
            buttonType={buttonType}
            selectItems={selectItems}
          />
          <Button
            style={{ paddingBottom: '10px' }}
            disabled={
              buttonType === 'Edit' ||
              !watchMarket ||
              !watchKind ||
              buttonType === 'Copy'
            }
            onClick={() => {
              setTimeOpen(true);
              setTimeType('Add');
            }}
          >
            新增自定义时段
          </Button>
        </div>
        <div style={{ color: '#bb744a' }}>*双击时段可进行详情编辑</div>
        <div
          style={{
            height: 300,
            marginTop: 15,
          }}
        >
          <ModalTable
            tabKey={tabKey}
            disabled={false}
            buttonType={buttonType}
            compareChange={compareChange}
            setTimeType={setTimeType}
            onQuantityChange={onQuantityChange}
            setTimeOpen={setTimeOpen}
            setTimeEditData={setTimeEditData}
            setEditData={setEditData}
            onThresholdNumberChange={onThresholdNumberChange}
            onThresholdChange={onThresholdChange}
            editData={editData}
          />
        </div>
      </Modal>
      <Modal
        width={750}
        open={timeOpen}
        maskClosable={false}
        // open={true}
        onCancel={() => {
          setTimeOpen(false);
          setTimeEditData(null);
        }}
        // okButtonProps={{ disabled: buttonType === 'Copy' }}
        onOk={submitTimeForm}
        centered={true}
        title="自定义时段限额设置"
      >
        <TimeForm
          timeOpen={timeOpen}
          tabKey={tabKey}
          disabled={false}
          editTimeData={editTimeData}
          form={timeForm}
        />
      </Modal>
    </div>
  );
};

export default OptinsModal;
