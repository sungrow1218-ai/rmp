import { useContext } from 'react';
import { UserRoleContext } from '@/wrappers/UserRoleContext';

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