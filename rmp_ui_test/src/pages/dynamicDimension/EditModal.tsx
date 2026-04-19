// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import React, { useRef, useState } from 'react';
import { BasicModal, useModalInner } from '@/components/Modal';
import { RegisterFn } from '@/components/Modal/src/types';
import Card from '@/components/Card';
import {
  Button,
  ConfigProvider,
  Empty,
  Form,
  Input,
  message,
} from '@ht/sprite-ui';
import { Condition, symbolColumns } from './data';
import { BasicTable, TableActionType } from '@/components/Table';
import { SearchOutlined } from '@ht-icons/sprite-ui-react';
import { AlterType, DynamicDimCondition } from './const';
import Explain, { STATUS } from './components/Explain';
import { debounce, isString } from 'lodash';
import ConditionTable from './components/ConditionTable';
import styles from './style.less';
import { useGetState } from 'ahooks';
import {
  alterDynamicDimension,
  verifyDynamicDimension,
} from '@/services/dynamicDimension/index';

const { TextArea } = Input;

const titleMap: Recordable = {
  [AlterType.ADD]: '动态维度新增',
  [AlterType.EDIT]: '动态维度编辑',
  [AlterType.VIEW]: '动态维度详情',
};

const EditModal = (props: { [key: string]: any }) => {
  const [title, setTitle] = useState('');

  // 规则列表
  const [conditions, setConditions] = useState<Condition[]>([]);

  // 基础信息
  const [basicForm] = Form.useForm();

  // 弹框类型
  const [mode, setMode] = useState(AlterType.ADD);

  // 默认规则
  const [defaultConditions, setDefaultConditions] = useState<
    DynamicDimCondition[]
  >([]);

  // 运算解析结果
  const [expressionResult, setExpressionResult] = useState<{
    code: STATUS;
    message?: string;
  }>();

  // 模态框
  const [register, modalMethods] = useModalInner(
    props as { onRegister: RegisterFn },
    async ({
      alterType,
      dyndimId = null,
      dyndimFormula,
      dyndimName,
      dyndimConditionList,
    }) => {
      setTitle(titleMap[alterType]);
      setMode(alterType);
      // 编辑/展示
      if (alterType === AlterType.EDIT || alterType === AlterType.VIEW) {
        basicForm.setFieldsValue({ code: dyndimId, name: dyndimName });
        setDefaultConditions(dyndimConditionList);
        setExpression(dyndimFormula);
      }
      // 添加
      if (alterType === AlterType.ADD) {
        basicForm.resetFields();
        setDefaultConditions([]);
        setExpression('');
      }
    }
  );

  // 表格-标的
  const tableRef = useRef<TableActionType>(null);

  const [searchValue, setSearchValue, getSearchValue] = useGetState('');

  // 表达式
  const [expression, setExpression] = useState('');

  // 查询证券列表
  const searchSymbols = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setTimeout(() => {
      if (tableRef.current) {
        tableRef.current.reload({ pagination: { current: 1 } });
      }
    }, 100);
  };

  // 搜索处理
  const handleSearch = debounce(searchSymbols, 500);

  // 提交
  const handleSubmit = async () => {
    if (expressionResult?.code === STATUS.ERROR) {
      message.error(expressionResult.message);
      return;
    }
    if (conditions.some((i) => !i.code)) {
      message.error('预览不能有未设置完全的条件');
      return;
    }
    try {
      const { code = null, name } = await basicForm.validateFields();
      const data = {
        modifyType: mode,
        dyndimId: code || 0,
        dyndimName: name,
        dyndimFormula: expression,
        dyndimConditionList: conditions.map((i, index) => ({
          conditionCode: isString(i.code)
            ? i.code
            : (i.code as any).conditionCode,
          conditionOperation: i.operator,
          conditionValue: Array.isArray(i.value) ? i.value : [i.value],
          conditionOrderId: index,
        })),
      };
      const response = await alterDynamicDimension(data as any);
      if (response.code !== 0) {
        // message.error(response.message);
        return;
      }
      message.success('操作成功');
      modalMethods.closeModal();
      props.onRefresh && props.onRefresh();
    } catch (error) {
      console.error(error);
    }
  };

  // 预览操作
  const handlePreview = () => {
    if (expressionResult?.code === STATUS.ERROR) {
      message.error(expressionResult.message);
      return;
    }
    if (conditions.some((i) => !i.code)) {
      message.error('预览不能有未设置完全的条件');
    }
    if (tableRef.current) {
      tableRef.current.reload({ pagination: { current: 1 } });
    }
  };

  return (
    <BasicModal
      onRegister={register}
      title={title}
      width={1200}
      style={{ top: 50 }}
      centered={false}
      footer={
        <>
          {mode === AlterType.ADD || mode === AlterType.EDIT ? (
            <>
              <Button onClick={() => modalMethods.closeModal()}>取消</Button>
              <Button type="primary" onClick={handleSubmit}>
                确认
              </Button>
              <Button type="primary" onClick={handlePreview}>
                预览
              </Button>
            </>
          ) : null}
          {mode === AlterType.VIEW && (
            <Button type="primary" onClick={() => modalMethods.closeModal()}>
              关闭
            </Button>
          )}
        </>
      }
    >
      <div className={styles.wrapper}>
        <Form layout="inline" name="basic" form={basicForm} preserve={false}>
          <Form.Item label="维度编号" name={'code'}>
            <Input
              disabled={true}
              placeholder="自动生成"
              style={{ width: '240px' }}
            />
          </Form.Item>
          <Form.Item
            label="维度名称"
            name={'name'}
            rules={[
              { required: true, message: '请填写维度名称', type: 'string' },
            ]}
          >
            <Input
              disabled={mode === AlterType.VIEW}
              style={{ width: '240px' }}
              autoComplete="off"
            />
          </Form.Item>
        </Form>
        <Card
          title="条件列表"
          style={{ marginTop: '24px' }}
          bodyStyle={{ padding: '16px 0' }}
        >
          <ConditionTable
            defaultConditions={defaultConditions}
            onChange={(value) => setConditions(value)}
            onResetExpression={() => setExpression('')}
            mode={mode}
          />
        </Card>
        <Card
          title="条件计算公式"
          style={{ marginTop: '8px' }}
          bodyStyle={{ padding: '16px 0' }}
          headerRight={() =>
            mode === AlterType.VIEW ? null : (
              <>
                <Button
                  size="small"
                  style={{ width: '44px' }}
                  onClick={() => setExpression((prev) => `${prev}(`)}
                >
                  &#40;
                </Button>
                <Button
                  size="small"
                  style={{ width: '44px', marginLeft: '16px' }}
                  onClick={() => setExpression((prev) => `${prev})`)}
                >
                  &#41;
                </Button>
                <Button
                  size="small"
                  style={{ width: '44px', marginLeft: '16px' }}
                  onClick={() => setExpression((prev) => `${prev}|`)}
                >
                  &#124;
                </Button>
                <Button
                  size="small"
                  style={{ width: '44px', marginLeft: '16px' }}
                  onClick={() => setExpression((prev) => `${prev}&`)}
                >
                  &#38;
                </Button>
              </>
            )
          }
        >
          <TextArea
            rows={3}
            value={expression}
            disabled={mode === AlterType.VIEW}
            onChange={(e) => setExpression(e.target.value)}
          />
        </Card>
        <Card
          title="中文描述"
          style={{ marginTop: '8px' }}
          bodyStyle={{ padding: '16px 0' }}
        >
          <Explain
            expression={expression}
            conditions={conditions}
            onChange={(status) => setExpressionResult(status)}
          />
        </Card>
        {mode === AlterType.ADD || mode === AlterType.EDIT ? (
          <Card
            title="证券列表"
            style={{ marginTop: '8px' }}
            bodyStyle={{ padding: '16px 0 0' }}
          >
            <div>
              <Input
                prefix={<SearchOutlined />}
                onChange={handleSearch}
                placeholder="请输入证券代码"
                allowClear={true}
                style={{ marginBottom: '16px', width: '240px' }}
              />
              <BasicTable
                ref={tableRef}
                fetchSetting={{
                  listField: 'data.resultList',
                  pageField: 'pageId',
                  totalField: 'data.totalSize',
                }}
                scroll={{ y: 300 }}
                columns={symbolColumns as any}
                api={async (params) => {
                  const reqParams = {
                    ...params,
                    securityDimensionFormula: expression,
                    secuDimConditionList: conditions.map((i, index) => ({
                      conditionCode: isString(i.code)
                        ? i.code
                        : (i.code as any).conditionCode,
                      conditionOperation: i.operator,
                      conditionValue: Array.isArray(i.value)
                        ? i.value
                        : [i.value],
                      conditionOrderId: index,
                    })),
                    ...(getSearchValue()
                      ? { filterCondition: { securityCode: getSearchValue() } }
                      : {}),
                  };
                  return verifyDynamicDimension(reqParams);
                }}
                immediate={false}
                autoCreateKey={true}
                pagination={{
                  showTotal: (total) => `总数：${total}`,
                  showQuickJumper: true,
                }}
              />
            </div>
          </Card>
        ) : null}
      </div>
    </BasicModal>
  );
};

export default EditModal;
