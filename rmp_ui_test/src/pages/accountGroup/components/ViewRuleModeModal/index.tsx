import { BasicForm, FormActionType } from '@/components/Form';
import useMenuInfo from '@/hooks/useMenuInfo';
import {
  AllSobInfo,
  useSobInfo,
} from '@/pages/ruleSetting/components/allSobInfo';
import { parseToList } from '@/pages/ruleSetting/RuleIndex/util';
import TemplateGroupView from '@/pages/ruleSetting/RuleTemplateGroup/TemplateGroupView';
import {
  IRuleConfiguration,
  IRuleConfigurationItem,
} from '@/pages/ruleSetting/type';
import {
  AccountGroupRelationResultList,
  modifyAccountGroupRelation,
  modifyAccountGroupRelationParams,
} from '@/services/accountGroup';
import { queryMenuConfig } from '@/services/menu';
import { queryRuleTemplateGroup } from '@/services/ruleSetting';
import { RuleTemplateGroupIDTO } from '@/services/ruleSetting/idto';
import { PaginationType } from '@/services/typing';
import { Modal } from '@ht/sprite-ui';
import { useMemoizedFn } from 'ahooks';
import { Button, message, Radio, RadioChangeEvent, Switch, Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { forEach } from 'lodash';
import { number } from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';

export interface IProps {
  ruleTemplateGroupId?: number;
  open: boolean;
  setOpen: (value: boolean) => void;
}

const ViewRuleModeModal: React.FC<IProps> = ({
  open,
  setOpen,
  ruleTemplateGroupId,
}) => {
  const hasGetConfig = useRef(false);

  const [ruleTmplGroupMap, setRuleTmplGroupMap] = useState<
    Recordable<IRuleConfigurationItem[]>
  >({});

  const [ruleData, setRuleData] = useState<RuleTemplateGroupIDTO | undefined>();

  const queryRuleModeInfo = useMemoizedFn(async () => {
    try {
      if (ruleTemplateGroupId === undefined) {
        return;
      }
      const res = await queryRuleTemplateGroup({
        pageId: 1,
        pageSize: 5000,
        authorityFlag: 1,
        filterCondition: [
          {
            ruleTmplGroupId: ruleTemplateGroupId,
          },
        ],
      });
      if (res.errorId !== 0) {
        setRuleData(undefined);
        return;
      }
      const _data = res?.data?.resultList ?? [];
      setRuleData(_data[0]);
    } catch (error) {
      console.log(error);
    } finally {
    }
  });

  useEffect(() => {
    if (ruleTemplateGroupId !== undefined && open) {
      queryRuleModeInfo();
    }
  }, [ruleTemplateGroupId, open]);

  useEffect(() => {
    // 查询配置
    const queryConfig = async () => {
      try {
        const result = await queryMenuConfig({
          pageId: 1,
          pageSize: 100,
          filterCondition: {
            menuId: 101,
          },
        });
        if (result.code !== 0) {
          throw new Error('请求菜单配置失败');
        }
        if (result.data?.resultList?.length) {
          const ruleConfiguration = JSON.parse(
            result.data?.resultList[0]?.displayConfig
          ) as IRuleConfiguration;
          const parseData = parseToList(ruleConfiguration.workGroupList);
          setRuleTmplGroupMap(parseData.ruleTmplGroupMap);
        }
      } catch (error: any) {
        console.error(error);
        // error.message && message.error(error.message);
      } finally {
        hasGetConfig.current = true;
      }
    };

    if (open) {
      queryConfig();
    }
  }, [ruleTemplateGroupId, open]);
  console.log('====================================');
  console.log(ruleTmplGroupMap, 'ruleTmplGroupMap');
  console.log('====================================');

  const getRuleTmplGroupTree = useMemo(() => {
    if (ruleData && ruleData.workGroupId) {
      return ruleTmplGroupMap[ruleData.workGroupId] || [];
    }
    return [];
  }, [ruleTmplGroupMap, ruleData]);

  const allSobInfo = useSobInfo();
  const accountType = useMemo(() => {
    const accType: {
      [key: string]: string;
    } = {};
    if (allSobInfo && ruleData) {
      const workGroupInfo = allSobInfo.find(
        (item: any) => item.workGroupId === ruleData.workGroupId
      );
      forEach(workGroupInfo?.bookList, (item) => {
        forEach(item.bookLevelList, (level) => {
          const lable = `${item.bookType}|${level.bookLevel}`;
          accType[lable] = level.bookLevelName;
        });
      });
    }
    return accType;
  }, [allSobInfo, ruleData]);

  return (
    <Modal
      title={'查看规则模板'}
      open={open}
      footer={null}
      width={'98%'}
      onCancel={() => setOpen(false)}
      destroyOnClose={true}
    >
      <div style={{ display: 'flex', height: '80vh', position: 'relative' }}>
        {ruleData && getRuleTmplGroupTree.length > 0 && allSobInfo && (
          <TemplateGroupView
            workGroupId={ruleData.workGroupId}
            onVisableChange={() => {}}
            ruleTypeTree={getRuleTmplGroupTree}
            groupInfo={ruleData}
            accountType={accountType}
            allSobInfo={allSobInfo}
            showBackBtn={false}
            showAccountGroupTab={false}
          />
        )}
      </div>
    </Modal>
  );
};

export default ViewRuleModeModal;
