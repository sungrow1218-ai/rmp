import { useContext } from 'react';
import { UserExtSysContext } from '@/wrappers/UseExtSys';

const useExyInfo = () => {
  const { availabExSysInfo, allWorkGroup } = useContext(UserExtSysContext);

  return {
    availabExSysInfo,
    allWorkGroup,
  };
};

export default useExyInfo;
