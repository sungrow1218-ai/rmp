import { createContext } from 'react';
import { type MenuItemType } from '@/services/api';

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

export const MenuFuncContext = createContext<MenuFuncContextType>({});

export default MenuFuncContext;