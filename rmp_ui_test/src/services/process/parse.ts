import { DetailState } from '@/pages/processManage/contant/typing';
import { InProgressList, ProcessListData, ProcessListParams } from '.';
import { parseQueryRuleSettingRsp } from '../ruleSetting/parse';
import {
  DetailStateIDTO,
  InProgressListIDTO,
  ProcessListDataIDTO,
  ProcessListParamsIDTO,
} from './Idto';
import { parseQuerySecurityPoolLayer } from '../securityPool/parse';

export const parseProcessListData = (
  prev: ProcessListDataIDTO
): ProcessListData => {
  const data: ProcessListData = {
    procedureCode: prev.procedureCode,
    procedureName: prev.procedureName,
    currentProcessors: prev.currentProcessors,
    creator: prev.createUserCode,
    createTime: prev.createTime,
    finishTime: prev.finishTime,
    alterType: prev.modifyType,
    isAuthProcess: prev.isAuthProcess,
    isSelf: prev.isSelf,
    procedureType: prev.procedureType,
    generalStatus: prev.generalStatus,
  };
  // console.log('====================================');
  // console.log(data);
  // console.log('====================================');
  return data;
};

export const parseProcessListParams = (
  prev: ProcessListParams
): ProcessListParamsIDTO => {
  console.log('====================================');
  console.log(prev);
  console.log('====================================');
  const data: ProcessListParamsIDTO = {
    pageId: prev.pageId,
    pageSize: prev.pageSize,
    filterCondition: prev.filterCondition
      ? {
          procedureCode: prev?.filterCondition?.procedureCode,
          procedureType: prev?.filterCondition?.procedureType,
          procedureName: prev?.filterCondition?.procedureName,
          currentProcessor: prev?.filterCondition?.currentProcessor,
          createUserCode: prev?.filterCondition?.creator,
          changeModule: prev?.filterCondition?.changeModule,
          finishStartTime: prev?.filterCondition?.finishStartTime,
          finishEndTime: prev?.filterCondition?.finishEndTime,
          createStartTime: prev?.filterCondition?.createStartTime,
          createEndTime: prev?.filterCondition?.createEndTime,
          generalStatus: prev?.filterCondition?.generalStatus,
        }
      : undefined,
  };
  return data;
};

// 是否有在途流程-出参
export const parseInProgressList = (
  prev: InProgressListIDTO
): InProgressList => {
  let _textBefore = prev.textBefore;
  let _textAfter = prev.textAfter;
  const parseTextBefore = prev.textBefore ? JSON.parse(prev.textBefore) : '';
  const parseTextAfter = prev.textAfter ? JSON.parse(prev.textAfter) : '';
  if ('ruleBaseInfo' in parseTextBefore) {
    _textBefore = parseTextBefore
      ? JSON.stringify(parseQueryRuleSettingRsp(parseTextBefore))
      : '';
  }
  if ('ruleBaseInfo' in parseTextAfter) {
    _textAfter = parseTextAfter
      ? JSON.stringify(parseQueryRuleSettingRsp(parseTextAfter))
      : '';
  }
  const data: InProgressList = {
    alterType: prev.modifyType,
    procedureCode: prev.procedureCode,
    procedureName: prev.procedureName,
    procedureType: prev.procedureType,
    procedureStatus: prev.procedureStatus,
    creator: prev.procedureCode,
    createTime: prev.createTime,
    textBefore: _textBefore,
    textAfter: _textAfter,
  };
  return data;
};

export const parseProgressDetail = (prev: DetailStateIDTO): DetailState => {
  let _textBefore = prev.textBefore;
  let _textAfter = prev.textAfter;
  if (prev.changeModule === 101 || prev.changeModule === 102) {
    const parseTextBefore = prev.textBefore ? JSON.parse(prev.textBefore) : '';
    try {
      _textBefore = parseTextBefore
        ? JSON.stringify(parseQueryRuleSettingRsp(parseTextBefore))
        : '';
    } catch (error) {
      console.log(error);
    }
  }
  if (prev.changeModule === 101 || prev.changeModule === 102) {
    const parseTextAfter = prev.textAfter ? JSON.parse(prev.textAfter) : '';
    try {
      _textAfter = parseTextAfter
        ? JSON.stringify(parseQueryRuleSettingRsp(parseTextAfter))
        : '';
    } catch (error) {
      console.log(error);
    }
  }
  if (prev.changeModule === 201) {
    const parseTextBefore = prev.textBefore ? JSON.parse(prev.textBefore) : '';
    try {
      _textBefore = parseTextBefore
        ? JSON.stringify(parseQuerySecurityPoolLayer(parseTextBefore))
        : '';
    } catch (error) {
      console.log(error);
    }
  }
  if (prev.changeModule === 201) {
    const parseTextAfter = prev.textAfter ? JSON.parse(prev.textAfter) : '';
    try {
      _textAfter = parseTextAfter
        ? JSON.stringify(parseQuerySecurityPoolLayer(parseTextAfter))
        : '';
    } catch (error) {
      console.log(error);
    }
  }
  const data: DetailState = {
    alterType: prev.modifyType,
    procedureCode: prev.procedureCode,
    procedureName: prev.procedureName,
    procedureType: prev.procedureType,
    // procedureStatus: prev.procedureStatus,
    creator: prev.createUserCode,
    createTime: prev.createTime,
    textBefore: _textBefore,
    textAfter: _textAfter,
    operationType: prev.operationType,
    busiStatus: prev.businessStatus,
    currentProcessors: prev.currentProcessors,
    changeModule: prev.changeModule,
    changeItem: prev.changeItem,
    changeItemId: prev.changeItemId,
    changeText: prev.changeText,
    finishTime: prev.finishTime,
    isSelf: prev.isSelf,
    errorInfo: prev.errorReason,
    comment: prev.comment,
  };
  return data;
};
