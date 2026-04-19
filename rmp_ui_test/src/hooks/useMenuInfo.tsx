import { useMenuFunc } from '.';
import { useHistory } from '@oula/oula';

function useMenuInfo() {
  const menuArry = useMenuFunc();
  const { location } = useHistory();
  const menuObj = menuArry?.flatMenuData?.find((item) => {
    return item.menuUrl === location.pathname;
  });

  return menuObj;
}
export default useMenuInfo;
