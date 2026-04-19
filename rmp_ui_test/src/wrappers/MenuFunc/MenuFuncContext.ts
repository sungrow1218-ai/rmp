import { createContext } from 'react';
import { type MenuItemType } from '@/services/menu';

export type MenuItemProps = {
  label: string;
  key: string;
  children?: MenuItemProps[];
};

export type MenuIdToPathMapType = {
  [key: number]: string;
};

export type MenuPathToIdMapType = {
  [key: string]: number;
};

export type LeafMenuIdListType = number[];

export interface MenuFuncContextType {
  menuItemConfig?: MenuItemProps[];
  leafMenuIds?: LeafMenuIdListType;
  menuIdToPathMap?: MenuIdToPathMapType;
  menuPathToIdMap?: MenuPathToIdMapType;
  flatMenuData?: MenuItemType[];
}

/**
 * 1、保存原始的菜单数据-平铺，只做简单的处理，增加一个递归处理的版本
 * 2、将菜单的 functionList 转换为一个对象，key 为 menuId，value 为 functionList
 * 3、将所有子菜单的 id 保存到一个数组中，方便查找，需要支持通过 path 匹配 id 的能力
 */

const MenuFuncContext = createContext<MenuFuncContextType>({});

export default MenuFuncContext;
