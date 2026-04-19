import useEIP from '@/directives/useEIP';
import { ListContext } from '@/hooks/useListClick';
import { queryWorkGroup, WorkGroupList } from '@/services/account';
import { alterRoleWorkGroupAuthority } from '@/services/roleManage';
import { Button, Checkbox, Col, message, Row } from '@ht/sprite-ui';
import { CheckboxGroupProps } from '@ht/sprite-ui/lib/checkbox';
import React, { useContext, useEffect, useState } from 'react';

const WorkGroupPermission = () => {
  const { selectedItem, authState, refreshAuthState } = useContext(ListContext);
  const [resetLoading, setResetLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [workGroup, setWorkGroup] = useState<WorkGroupList[]>([]);
  const [checkedValue, setCheckedValue] = useState<number[]>([]);

  const [isEIP, eipRef] = useEIP();

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await queryWorkGroup({
          pageId: 1,
          pageSize: 5000,
          authFlag: 0,
        });
        if (res.code !== 0) {
          throw Error('查询菜单功能失败');
        }
        setWorkGroup(res.data.resultList || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    };
    if (selectedItem) {
      fetch();
    }
  }, [selectedItem]);

  const handleChange: CheckboxGroupProps['onChange'] = (checked) => {
    setCheckedValue(checked as number[]);
  };

  useEffect(() => {
    if (authState?.workGroupAuthList) {
      setCheckedValue(authState.workGroupAuthList.map((i) => i.workGroupId));
    }
  }, [authState]);

  const handleReset = () => {
    try {
      setResetLoading(true);
      refreshAuthState();
    } catch (error) {
      console.error(error);
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      const res = await alterRoleWorkGroupAuthority({
        alterRoleId: selectedItem?.roleId,
        workGroupAuthList: checkedValue,
      });
      if (res.code !== 0) {
        throw Error(res.message);
      }
      message.success('提交成功');
      refreshAuthState();
    } catch (error) {
      console.error(error);
      message.error((error as any).message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <Checkbox.Group
        style={{ width: '100%' }}
        onChange={handleChange}
        value={checkedValue}
        disabled={isEIP}
      >
        <Row gutter={[16, 16]}>
          {workGroup.map((i) => (
            <Col key={i.workGroupId} span={24}>
              <Checkbox value={i.workGroupId}>{i.workGroupName}</Checkbox>
            </Col>
          ))}
        </Row>
      </Checkbox.Group>
      <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
        <Button
          type="primary"
          loading={submitLoading}
          style={{ marginLeft: '16px' }}
          onClick={handleSubmit}
          ref={eipRef}
        >
          确定
        </Button>
        <Button loading={resetLoading} ref={eipRef} onClick={handleReset}>
          重置
        </Button>
      </div>
    </div>
  );
};

export default WorkGroupPermission;
