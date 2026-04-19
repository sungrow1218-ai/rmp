import { useContext } from 'react';
import { UserRoleContext } from '@/wrappers/UserRole';

const useUserRoles = () => {
  const {
    activeRoleId,
    availableRoles = [],
    setActiveRoleId,
  } = useContext(UserRoleContext);

  return {
    activeRoleId,
    availableRoles,
    setActiveRoleId,
  };
};

export default useUserRoles;
