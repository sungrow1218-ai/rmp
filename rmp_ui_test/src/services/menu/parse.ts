import { MenuItemType } from '.';
import { MenuItemTypeIDTO } from './Idto';

export const parseRoleMeun = (p: MenuItemTypeIDTO): MenuItemType => {
  const data: MenuItemType = {
    menuId: p.menuId,
    menuName: p.menuName,
    menuUrl: p.menuUrl,
    parentMenuId: p.parentMenuId,
    functionList: (p.functionList || [])?.map((q) => ({
      functionDescrip: q.functionDescription,
      functionId: q.functionId,
      functionName: q.functionName,
    })),
  };
  return data;
};
