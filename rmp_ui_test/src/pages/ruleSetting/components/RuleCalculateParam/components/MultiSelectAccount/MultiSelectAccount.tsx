// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import { Button, Form, message, Select, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { isArray, isEmpty, isEqual } from 'lodash';
import React, { FC, useEffect, useRef, useState } from 'react';
import { RuleProps } from './typing';
import AccountList from './AccountList';
import { DeleteOutlined, PlusOutlined } from '@ht-icons/sprite-ui-react';
import { v4 as uuidv4 } from 'uuid';
import { FORM_MODES } from '@/pages/ruleSetting/constant';

interface Props {
  mode: keyof typeof FORM_MODES;
  values: Recordable;
  onChange?: (value?: string) => void;
  ruleSecuParams: any;
}

const MultiSelectAccount: FC<Props> = ({
  values = {},
  onChange,
  ruleSecuParams = {},
  mode,
}) => {
  const [dataSource, setDataSource] = useState<RuleProps[]>([]);
  const [selectKeys, setSelectKeys] = useState<React.Key[]>([]);
  const initVal = useRef(false);
  const dom = useRef(null);
  const latestId = useRef(0);

  const onAdd = () => {
    const [bookLevel, acctType] = ruleSecuParams.controlAcctType.split('|');
    const isEys = !bookLevel && acctType === '3';
    const validated = !isEys
      ? (isArray(ruleSecuParams?.controlAcctList) &&
          ruleSecuParams.controlAcctList.length === 0) ||
        ruleSecuParams?.extSysIds.length === 0
      : ruleSecuParams?.extSysIds.length === 0;

    if (validated) {
      message.error('请填写账户控制范围中的必填项');
      return;
    }
    setDataSource((prev) => {
      const id = latestId.current + 1;
      latestId.current += 1;
      return [
        ...prev,
        {
          id,
          status: 1,
          excemptAcct: [],
          orderSide: -1,
          opponentAcct: [],
          key: uuidv4(),
        },
      ];
    });
    initVal.current = true;
  };

  const handleSwitchChange = (
    id: number,
    newVal: boolean | number,
    fileds: string
  ) => {
    setDataSource((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [fileds]: typeof newVal === 'boolean' ? (newVal ? 1 : 0) : newVal,
            }
          : item
      )
    );
  };

  const changeFun = (id: number, list: any[], filed: string) => {
    setDataSource((prev) =>
      prev.map((item) => {
        return item.id === id ? { ...item, [filed]: list } : item;
      })
    );
  };

  // 数据缓存
  const dataSourceCache = useRef<RuleProps[]>([]);

  useEffect(() => {
    // 防止重复渲染
    if (!isEqual(dataSource, dataSourceCache.current)) {
      const list = dataSource.map((p) => {
        return {
          ...p,
          excemptAcct: p.excemptAcct
            ? p.excemptAcct.map((m) => (m.extSysId ? m : { extSysId: m }))
            : [],
          opponentAcct: p.opponentAcct
            ? p.opponentAcct.map((m) => (m.extSysId ? m : { extSysId: m }))
            : [],
          key: undefined,
        };
      });
      onChange && onChange(JSON.stringify(list));
    }
    dataSourceCache.current = [...dataSource];
  }, [dataSource]);

  useEffect(() => {
    if (values && !isEmpty(values)) {
      if (typeof values.ruleParamValue === 'string') {
        const data = JSON.parse(values.ruleParamValue).map((p: any) => ({
          ...p,
          key: uuidv4(),
        }));
        setDataSource(data);
        latestId.current = data[data.length - 1].id;
        initVal.current = true;
      }
    } else {
      setDataSource([]);
      initVal.current = false;
    }
  }, []);

  useEffect(() => {
    const [bookLevel, acctType] = ruleSecuParams.controlAcctType.split('|');
    const isEys = !bookLevel && acctType === '3';
    const valdate = !isEys
      ? (ruleSecuParams.controlAcctList &&
          isArray(ruleSecuParams?.controlAcctList) &&
          ruleSecuParams.controlAcctList.length === 0) ||
        ruleSecuParams?.extSysIds.length === 0
      : ruleSecuParams?.extSysIds.length === 0 ||
        (isArray(ruleSecuParams?.controlAcctList) &&
          ruleSecuParams.controlAcctList.length > 0);
    if (valdate) {
      setDataSource([]);
      initVal.current = false;
    }
    if (
      ruleSecuParams?.extSysIds.length === 0 ||
      (!isEys && !isArray(ruleSecuParams?.controlAcctList))
    ) {
      setDataSource([]);
      initVal.current = false;
    }
  }, [ruleSecuParams]);

  const validateFun = (value: any[], acct: any[], isEys: boolean) => {
    if (isArray(acct) && acct?.length > 0) {
      const tMap = new Map();
      const generateKey = (obj: any) =>
        isEys
          ? obj
          : `${obj?.bookLevel ?? 0}-${obj.extSysId}-${obj?.acctCode ?? 0}-${
              obj?.marketId ?? 0
            }`;
      acct.forEach((item) => {
        tMap.set(generateKey(item), true);
      });
      return value.some((item: any) => {
        return tMap.has(generateKey(item));
      });
    }
    return false;
  };

  const columns: ColumnsType<NullableProperties<RuleProps>> = [
    {
      title: '启用状态',
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (_text, record) => (
        <Switch
          checkedChildren="ON"
          unCheckedChildren="OFF"
          checked={!!record.status}
          onChange={(val) => handleSwitchChange(record.id ?? 1, val, 'status')}
        />
      ),
    },
    {
      title: '单项豁免组',
      dataIndex: 'excemptAcct',
      align: 'center',
      width: 240,
      render: (_text, record) => {
        let isEys = false;
        if (ruleSecuParams.controlAcctType) {
          const [bookLevel, acctType] =
            ruleSecuParams.controlAcctType.split('|');
          isEys = !bookLevel && acctType === '3';

          return (
            <Form.Item
              name={['items', record.key ?? 1, 'excemptAcct']}
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: record.opponentAcct?.length === 0,
                  message: '该字段必填',
                },
                {
                  validateTrigger: ['onChange'],
                  validator: (_rule, value, _callback) => {
                    if (
                      isArray(record.opponentAcct) &&
                      record.opponentAcct?.length > 0
                    ) {
                      const isTue = validateFun(
                        value,
                        record.opponentAcct,
                        isEys
                      );
                      if (isTue) {
                        return Promise.reject('选项同单项豁免组对手账户重复');
                      } else {
                        return Promise.resolve();
                      }
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
              initialValue={
                initVal.current
                  ? isEys
                    ? record.excemptAcct?.map((p) =>
                        p.extSysId ? Number(p.extSysId) : p
                      )
                    : record.excemptAcct ?? []
                  : []
              }
            >
              <AccountList
                integrationSystemIds={ruleSecuParams.extSysIds}
                sobInfo={ruleSecuParams.sobInfo}
                controlAcctType={ruleSecuParams.controlAcctType}
                extSystems={ruleSecuParams.extSystems}
                controlAcctList={ruleSecuParams.controlAcctList}
                isEys={isEys}
                value={
                  isEys
                    ? record.excemptAcct?.map((p) =>
                        p.extSysId ? Number(p.extSysId) : p
                      )
                    : record.excemptAcct ?? []
                }
                onChange={(val) => {
                  changeFun(record.id ?? 1, val, 'excemptAcct');
                }}
                mode={mode}
              />
            </Form.Item>
          );
        }
        return <></>;
      },
    },
    {
      title: '单项豁免组对手账户',
      dataIndex: 'opponentAcct',
      align: 'center',
      width: 240,
      render: (_text, record) => {
        let isEys = false;
        if (ruleSecuParams.controlAcctType) {
          const [bookLevel, acctType] =
            ruleSecuParams.controlAcctType.split('|');
          isEys = !bookLevel && acctType === '3';
          const newData = initVal.current
            ? isEys
              ? record.opponentAcct?.map((p) =>
                  p.extSysId ? Number(p.extSysId) : p
                )
              : record.opponentAcct ?? []
            : [];

          return (
            <Form.Item
              name={['items', record.key ?? 1, 'opponentAcct']}
              style={{ marginBottom: 0 }}
              rules={[
                {
                  required: record.opponentAcct?.length === 0,
                  message: '该字段必填',
                },
                {
                  validateTrigger: ['onChange'],
                  validator: (_rule, value, _callback) => {
                    if (
                      isArray(record.excemptAcct) &&
                      record.excemptAcct?.length > 0
                    ) {
                      const isTue = validateFun(
                        value,
                        record.excemptAcct,
                        isEys
                      );
                      if (isTue) {
                        return Promise.reject('选项同单项豁免组重复');
                      } else {
                        return Promise.resolve();
                      }
                    } else {
                      return Promise.resolve();
                    }
                  },
                },
              ]}
              initialValue={newData}
            >
              <AccountList
                integrationSystemIds={ruleSecuParams.extSysIds}
                sobInfo={ruleSecuParams.sobInfo}
                controlAcctType={ruleSecuParams.controlAcctType}
                extSystems={ruleSecuParams.extSystems}
                controlAcctList={ruleSecuParams.controlAcctList}
                isEys={isEys}
                value={
                  isEys
                    ? record.opponentAcct?.map((p) =>
                        p.extSysId ? Number(p.extSysId) : p
                      )
                    : record.opponentAcct ?? []
                }
                onChange={(val) =>
                  changeFun(record.id ?? 1, val, 'opponentAcct')
                }
                mode={mode}
              />
            </Form.Item>
          );
        }
        return <></>;
      },
    },
    {
      title: '委托方向',
      dataIndex: 'orderSide',
      align: 'center',
      width: 120,
      render: (_val, record) => {
        return (
          <Select
            options={[
              {
                label: '不区分',
                value: -1,
              },
              {
                label: '买',
                value: 1,
              },
              {
                label: '卖',
                value: 2,
              },
            ]}
            value={record.orderSide}
            onChange={(val) =>
              handleSwitchChange(record.id ?? 1, val, 'orderSide')
            }
            getPopupContainer={(triggerNode) => document.body}
          />
        );
      },
    },
  ];

  const changeSelectKeys = (keys: React.Key[]) => {
    setSelectKeys(keys);
  };

  // 删除
  const onDelete = (selected: React.Key[]) => {
    if (selectKeys.length === 0) {
      message.warn('请选择至少一条单项豁免账户组');
    }
    if (selected.length === dataSource.length) {
      setDataSource([]);
    } else {
      setDataSource((prev) =>
        [...prev].filter((i) => !selected.includes(i.key))
      );
    }
    initVal.current = false;
    setSelectKeys([]);
  };

  return (
    <div style={{ padding: 0, width: '923px' }} ref={dom}>
      <>
        <Button style={{ fontSize: '14px' }} type="link" onClick={onAdd}>
          <PlusOutlined />
          新增
        </Button>
        {dataSource.length > 0 ? (
          <Button
            onClick={() => {
              onDelete(selectKeys);
            }}
            style={{ fontSize: '14px' }}
            type="link"
          >
            <DeleteOutlined />
            删除
          </Button>
        ) : (
          <></>
        )}
      </>
      {dataSource.length > 0 && (
        <Table
          size="small"
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          rowKey={'key'}
          scroll={{ y: 186 }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectKeys,
            onChange: changeSelectKeys,
          }}
        />
      )}
    </div>
  );
};

export default MultiSelectAccount;
