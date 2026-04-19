import { createContext } from 'react';

export interface RoleItemType {
  id: number;
  name: string;
}

interface UserInfoType {
  id: string;
  name: string;
  avatar: string;
}

export interface UserRoleContextType {
  availableRoles?: RoleItemType[];
  activeRoleId?: number;
  setActiveRoleId?: (roleId: number) => void;
  userInfo?: UserInfoType;
}

const UserRoleContext = createContext<UserRoleContextType>({});

export default UserRoleContext;
