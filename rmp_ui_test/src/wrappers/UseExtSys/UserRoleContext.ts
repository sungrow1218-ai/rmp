import { createContext } from 'react';
import { infoState, SobIdLisType } from './UseExtSys';

export interface UserRoleContextType {
  availabExSysInfo?: infoState;
  allWorkGroup?: SobIdLisType[];
}

const UserExtSysContext = createContext<UserRoleContextType>({});

export default UserExtSysContext;
