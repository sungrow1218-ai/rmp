import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useReducer,
} from 'react';
import UserRoleContext from './UserRoleContext';
import { queryExternSystem } from '@/services/roleManage';
import { ExternSystemState } from '@/pages/roleManage/contant/typing';
import { queryWorkGroup } from '@/services/account';

const LOADING_STATUS = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAIL',
} as const;
export type infoState = {
  [key: number]: ExternSystemState;
};
export interface SobIdLisType {
  workGroupId: number;
  workGroupName: string;
  sobId: number;
}
type RoleLoadingSuccessAction = {
  type: 'LOADING_SUCCESS';
  payload: {
    availabExSysInfo: infoState;
    allWorkGroup: SobIdLisType[];
  };
};

type RoleLoadingFailAction = {
  type: 'LOADING_FAIL';
  payload?: string;
};
type Action = RoleLoadingSuccessAction | RoleLoadingFailAction;
type State = {
  availabExSysInfo?: infoState;
  allWorkGroup: SobIdLisType[];
  status: typeof LOADING_STATUS[keyof typeof LOADING_STATUS];
  failReason?: string;
};

function userRoleReducer(state: State, action: Action) {
  if (action.type === 'LOADING_SUCCESS') {
    return {
      ...state,
      ...action.payload,
      status: LOADING_STATUS.SUCCESS,
    };
  }

  if (action.type === 'LOADING_FAIL') {
    return {
      ...state,
      status: LOADING_STATUS.FAILED,
      failReason: action.payload || '未知错误',
    };
  }
  return state;
}

const UseExtSys: FC<PropsWithChildren<Record<string, any>>> = (props) => {
  const [state, dispatch] = useReducer(userRoleReducer, {
    status: LOADING_STATUS.LOADING,
  } as State);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const [resWorkGroup, resExy] = await Promise.all([
          queryWorkGroup({
            pageId: 1,
            pageSize: 1000,
          }),
          queryExternSystem({
            pageId: 1,
            pageSize: 5000,
            authFlag: 0,
          }),
        ]);
        if (resExy.code !== 0) {
          throw new Error('获取对接系统信息失败');
        }
        if (resWorkGroup.code !== 0) {
          throw new Error('获取工作台信息失败');
        }

        const availabExSysInfo: {
          [key: number]: ExternSystemState;
        } = resExy.data.resultList.reduce((prev, cur) => {
          const { extSysId } = cur;
          return {
            ...prev,
            [extSysId]: {
              ...cur,
            },
          };
        }, {});
        const allWorkGroup = resWorkGroup.data.resultList;
        dispatch({
          type: 'LOADING_SUCCESS',
          payload: { availabExSysInfo, allWorkGroup },
        });
      } catch (error) {
        dispatch({
          type: 'LOADING_FAIL',
          payload: '错误',
        });
      }
    }
    fetchRoles();
  }, []);

  return (
    <UserRoleContext.Provider value={{ ...state }}>
      {props.children}
    </UserRoleContext.Provider>
  );
};

export default UseExtSys;
