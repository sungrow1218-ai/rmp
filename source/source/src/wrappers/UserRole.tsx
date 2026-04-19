import React, {
  type FC,
  type PropsWithChildren,
  useEffect,
  useReducer,
  useCallback,
} from 'react';
import { message, Spin } from 'antd';
import { getCurrentUserRoles } from '@/services/auth/index';
import request, { extendOptions } from '@/utils/request';
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
    // 只有在角色已经加载完成后才允许切换
    if (state.status === LOADING_STATUS.SUCCESS && state.activeRoleId !== roleId) {
      // 使用 requestAnimationFrame 避免在渲染过程中更新状态
      requestAnimationFrame(() => {
        dispatch({ type: 'CHANGE_ACTIVE_ROLE', payload: roleId });
        extendOptions({ headers: { 'Role-Id': `${roleId}` } });
      });
    }
  }, [state.status, state.activeRoleId]);

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
          payload: { availableRoles, activeRoleId },
        });
        // 设置 Role-Id
        extendOptions({ headers: { 'Role-Id': `${activeRoleId}` } });
      } catch (error: any) {
        console.error('获取用户角色失败:', error);
        dispatch({
          type: 'ROLE_LOADING_FAIL',
          payload: error?.message,
        });
      }
    }
    fetchRoles();
  }, []);

  if (state.status === LOADING_STATUS.LOADING) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <Spin size="large" tip="加载用户角色中..." />
      </div>
    );
  }

  if (state.status === LOADING_STATUS.FAILED) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">角色权限加载失败</div>
          <div className="text-gray-600">{state.failReason}</div>
        </div>
      </div>
    );
  }

  if (!state.activeRoleId) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">无可用角色</div>
          <div className="text-gray-600">请选择一个角色以开始使用系统</div>
        </div>
      </div>
    );
  }

  return (
    <UserRoleContext.Provider value={{ ...state, setActiveRoleId }}>
      {props.children}
    </UserRoleContext.Provider>
  );
};

export default UserRole;