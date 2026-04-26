import { createContext } from 'react';

export interface RoleItemTypeInState {
  id: number;
  name: string;
}

export interface UserRoleContextType {
  availableRoles?: RoleItemTypeInState[];
  activeRoleId?: number;
  setActiveRoleId?: (roleId: number) => void;
}

export const UserRoleContext = createContext<UserRoleContextType>({});

export default UserRoleContext;