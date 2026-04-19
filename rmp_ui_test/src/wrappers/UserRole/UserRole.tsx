import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import { message } from '@ht/sprite-ui';
import { getCurrentUserRoles } from '@/services/auth/index';
import PageLoading from '@/components/PageLoading';
import request from '@/utils/request';
import UserRoleContext from './UserRoleContext';

type RoleItemTypeInState = {
  id: number;
  name: string;
};

const LOADING_STATUS = {
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAIL',
} as const;

const mockRoles = [
  {
    id: 1,
    name: '集团风控管理角色',
  },
  {
    id: 2,
    name: '集团合规管理角色',
  },
  {
    id: 3,
    name: '证投风控合规管理角色',
  },
  {
    id: 4,
    name: '机构风控合规管理角色',
  },
  {
    id: 5,
    name: '资管风控合规管理角色',
  },
  {
    id: 6,
    name: '交易室风控合规管理角色',
  },
  {
    id: 7,
    name: '运营管理角色',
  },
  {
    id: 8,
    name: '系统运维角色',
  },
];

type ChangeActiveTypeAction = {
  type: 'CHANGE_ACTIVE_ROLE';
  payload: number;
};

type RoleLoadingSuccessAction = {
  type: 'ROLE_LOADING_SUCCESS';
  payload: {
    availableRoles: RoleItemTypeInState[];
  };
};

type RoleLoadingFailAction = {
  type: 'ROLE_LOADING_FAIL';
  payload?: string;
};

type Action =
  | ChangeActiveTypeAction
  | RoleLoadingSuccessAction
  | RoleLoadingFailAction;

type State = {
  availableRoles?: RoleItemTypeInState[];
  activeRoleId?: number;
  status: typeof LOADING_STATUS[keyof typeof LOADING_STATUS];
  failReason?: string;
};

function userRoleReducer(state: State, action: Action) {
  if (action.type === 'CHANGE_ACTIVE_ROLE') {
    return {
      ...state,
      activeRoleId: action.payload,
    };
  }

  if (action.type === 'ROLE_LOADING_SUCCESS') {
    return {
      ...state,
      ...action.payload,
      status: LOADING_STATUS.SUCCESS,
    };
  }

  if (action.type === 'ROLE_LOADING_FAIL') {
    return {
      ...state,
      status: LOADING_STATUS.FAILED,
      failReason: action.payload || '未知错误',
    };
  }
  return state;
}

const UserRole: FC<PropsWithChildren<Record<string, any>>> = (props) => {
  const [state, dispatch] = useReducer(userRoleReducer, {
    status: LOADING_STATUS.LOADING,
  } as State);

  const setActiveRoleId = useCallback((roleId: number) => {
    dispatch({ type: 'CHANGE_ACTIVE_ROLE', payload: roleId });
    request.extendOptions({ headers: { 'Role-Id': `${roleId}` } });
  }, []);

  useEffect(() => {
    async function fetchRoles() {
      try {
        const { code, data } = await getCurrentUserRoles({
          pageId: 1,
          pageSize: 100,
        });

        if (code !== 0) {
          throw new Error('获取当前用户角色信息失败');
        }

        if (data?.resultList?.length === 0) {
          throw new Error('当前登录用户在本系统中没有任何角色');
        }

        const availableRoles = data.resultList.map((role) => ({
          id: role.roleId,
          name: role.roleName,
        }));
        const activeRoleId = availableRoles[0].id;
        dispatch({
          type: 'ROLE_LOADING_SUCCESS',
          payload: { availableRoles },
        });
        setActiveRoleId(activeRoleId);
      } catch (error: any) {
        dispatch({
          type: 'ROLE_LOADING_FAIL',
          payload: error?.message,
        });
      }
    }
    fetchRoles();
  }, []);

  if (state.status === LOADING_STATUS.LOADING) {
    return <PageLoading isLoading={true} />;
  }

  if (state.status === LOADING_STATUS.FAILED) {
    // TODO 增加错误页面替换
    return <div>出错啦，错误原因：{state.failReason}</div>;
  }

  if (!state.activeRoleId) {
    return <div>请选择一个角色以开始使用系统</div>;
  }

  return (
    <UserRoleContext.Provider value={{ ...state, setActiveRoleId }}>
      {props.children}
    </UserRoleContext.Provider>
  );
};

export default UserRole;
