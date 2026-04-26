import { useContext } from 'react';
import { MenuFuncContext } from '@/wrappers/MenuFuncContext';

const useMenuFunc = () => {
  const ctxValue = useContext(MenuFuncContext);

  return ctxValue;
};

export default useMenuFunc;