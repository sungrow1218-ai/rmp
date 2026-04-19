import React, { useState, useEffect, useRef } from 'react';
import { Form, message, Button, Input, Modal } from '@ht/sprite-ui';
import {
  SeatGroupDetailParams,
  SeatGroupDetailState,
  SeatGroupState,
} from '@/pages/seatGroup/contants/tyeping';
import TitleImgSrc from '@/assets/common/card-title-icon.png';
import { SearchOutlined } from '@ht-icons/sprite-ui-react';
import { useHeightResize } from '@/hooks';
import styles from './style.less';
import { debounce, isEmpty } from 'lodash';
import AddSeat from './components/RightTable/AddSeat';
import useEIP from '@/directives/useEIP';
import { BasicTable, TableActionType } from '@/components/Table';
import { getColumns } from './contants/contants';
import { Col, Row } from 'antd';
import { TRADING_MARKETS, transformDictCodeToNameHelper } from '@/utils/dict';
import {
  alterSeatGroupDetail,
  querySeatGroupDetail,
} from '@/services/seatGroup';

const { confirm } = Modal;

const FormItem = Form.Item;

interface Props {
  selectKey: string | undefined;
  selectRecord: SeatGroupState | undefined;
  permission: boolean;
  [key: string]: any;
}

const RightTable: React.FC<Props> = ({
  selectKey,
  selectRecord,
  permission = false,
}) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState<boolean>(false);
  const [rowData, setRowData] = useState<SeatGroupDetailState[]>([]);
  const [_, eipRef] = useEIP();

  const delRowData = async (record: SeatGroupDetailParams[]) => {
    let dataList: SeatGroupDetailParams[] = [];
    if (record.length > 0) {
      dataList = record.map((p) => {
        return {
          seatCode: p.seatCode,
          extSysId: p.extSysId,
          seatName: p.seatName,
          marketId: p.marketId,
        };
      });
    }
    try {
      const seatGroupDetailRes = await alterSeatGroupDetail({
        modifyType: 3,
        seatGroupId: Number(selectKey),
        poolSecurityList: dataList as any[],
      });
      if (seatGroupDetailRes.code !== 0) {
        // message.error({
        //   content: `${seatGroupDetailRes.message}`,
        // });
      } else {
        form.resetFields();
        tableRef.current?.reload();
        message.success({ content: '删除成功' });
      }
    } catch (error) {
      console.error({ content: `${JSON.stringify(error)}` });
    } finally {
      setRowData([]);
      tableRef.current?.clearSelectedRowKeys();
    }
  };

  const debouncedSearch = debounce(() => {
    tableRef.current?.reload();
  }, 500);

  const tableRef = useRef<TableActionType>(null);

  useEffect(() => {
    form.resetFields();
    setRowData([]);
    tableRef.current?.clearSelectedRowKeys();
    if (selectKey) {
      tableRef.current?.reload({
        searchInfo: { seatGroupId: Number(selectKey) },
      });
    } else {
      tableRef.current?.clearTableData();
    }
  }, [selectKey]);

  const domRef = useRef(null);

  const domHeight = useHeightResize(domRef);

  useEffect(() => {
    calculate();
  }, [domHeight]);

  const calculate = () => {
    if (tableRef.current) {
      tableRef.current.setProps({
        scroll: {
          y: domHeight
            ? tableRef.current.getDataSource().length > 0
              ? domHeight - 64 - 47 - 48
              : domHeight - 64 - 47
            : 400,
        },
      });
    }
  };

  return (
    <>
      <div className={styles.info}>
        <div className={styles.title}>
          <img src={TitleImgSrc} style={{ width: '24px', height: '24px' }} />
          <span>基本信息</span>
        </div>
        <Row className={styles.desc}>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>席位组ID：</div>
            <div className={styles.value}>
              {selectRecord?.seatGroupId || '--'}
            </div>
          </Col>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>席位组名称：</div>
            <div
              className={styles.value}
              title={selectRecord?.seatGroupName || '--'}
            >
              {selectRecord?.seatGroupName || '--'}
            </div>
          </Col>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>交易所：</div>
            <div className={styles.value}>
              {selectRecord?.marketId
                ? transformDictCodeToNameHelper(
                    `${selectRecord?.marketId}`,
                    TRADING_MARKETS
                  )
                : '--'}
            </div>
          </Col>
          <Col span={6} className={styles.descItem}>
            <div className={styles.label}>备注：</div>
            <div className={styles.value} title={selectRecord?.remark || '--'}>
              {selectRecord?.remark || '--'}
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.title}>
        <img src={TitleImgSrc} style={{ width: '24px', height: '24px' }} />
        <span>席位列表</span>
      </div>
      <div className={styles.symbols} ref={domRef}>
        <div className={styles.actionBar}>
          <Form
            name="deatailNav"
            autoComplete="off"
            form={form}
            layout="inline"
            onValuesChange={debouncedSearch}
            style={{ margin: '16px 0' }}
          >
            <FormItem label="" name="seatCode">
              <Input
                placeholder="请输入席位编码"
                style={{ width: '240px', marginRight: '10px' }}
                prefix={<SearchOutlined />}
                allowClear={true}
              />
            </FormItem>
            <FormItem label="" name="seatName">
              <Input
                placeholder="请输入席位名称"
                style={{ width: '240px' }}
                prefix={<SearchOutlined />}
                allowClear={true}
              />
            </FormItem>
          </Form>
          {permission ? (
            <div className={styles.rigthBtns}>
              {selectKey && (
                <>
                  <Button
                    type="primary"
                    ref={eipRef}
                    onClick={() => setVisible(true)}
                    style={{ marginRight: '16px' }}
                  >
                    添加
                  </Button>
                  <Button
                    ref={eipRef}
                    disabled={rowData.length === 0}
                    onClick={() => {
                      confirm({
                        title: '确认删除',
                        content: `是否要删除${rowData.length}条席位？`,
                        onOk: () => delRowData(rowData),
                      });
                    }}
                  >
                    删除
                  </Button>
                </>
              )}
            </div>
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
            columns={getColumns()}
            api={async (params) => {
              try {
                const formData = form.getFieldsValue();
                return await querySeatGroupDetail({
                  ...params,
                  filterCondition: isEmpty(formData) ? undefined : formData,
                });
              } catch (error) {
                console.error(error);
              }
            }}
            rowSelection={
              permission
                ? {
                    type: 'checkbox',
                    onChange: (selectedRowKeys, selectedRows) => {
                      tableRef.current?.setSelectedRowKeys(selectedRowKeys);
                      setRowData(selectedRows);
                    },
                  }
                : undefined
            }
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
      {visible && (
        <AddSeat
          onClose={() => {
            setVisible(false);
          }}
          reFresh={() => tableRef.current?.reload()}
          treeKey={Number(selectKey)}
          selectRecord={selectRecord}
        />
      )}
    </>
  );
};

export default RightTable;
