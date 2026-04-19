// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-depth */
import { IRuleConfiguration, IRuleConfigurationItem } from '../type';
import { RuleTypeItem } from './type';

// 请求数据打扁成集合
export const parseToList = (
  workGroupList: IRuleConfiguration['workGroupList']
): { ruleTypeList: RuleTypeItem[]; ruleTmplGroupMap: Recordable } => {
  const ruleTypeList: RuleTypeItem[] = [];
  const ruleTmplGroupMap: Recordable<IRuleConfigurationItem[]> = {};
  for (const { WorkGroupId, WorkGroupName, RuleTypeList } of workGroupList) {
    for (const tItem of RuleTypeList.rule || []) {
      if (tItem.SubList && tItem.SubList.length > 0) {
        for (const sItem of tItem.SubList) {
          if (sItem.SubList && sItem.SubList.length > 0) {
            for (const item of sItem.SubList) {
              ruleTypeList.push({
                workGroupId: WorkGroupId,
                workGroupName: WorkGroupName,
                typeId: tItem.Id,
                typeName: tItem.Name,
                subTypeId: sItem.Id,
                subTypeName: sItem.Name,
                ruleTypeId: item.Id,
                ruleTypeName: item.Name,
              });
            }
          } else {
            ruleTypeList.push({
              workGroupId: WorkGroupId,
              workGroupName: WorkGroupName,
              ruleTypeId: sItem.Id,
              ruleTypeName: sItem.Name,
              typeId: tItem.Id,
              typeName: tItem.Name,
            });
          }
        }
      }
    }
    ruleTmplGroupMap[WorkGroupId] = RuleTypeList.template || [];
  }
  return { ruleTypeList, ruleTmplGroupMap };
};
