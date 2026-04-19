import { type MenuItemType } from '../api';
import { getMenuByRole } from '../api';

/**
 * 获取菜单数据（包含后端数据和本地添加的报表管理菜单）
 */
export async function getMenuDataWithReport(
  params: any
): Promise<MenuItemType[]> {
  try {
    // 从后端获取菜单数据
    const response = await getMenuByRole(params);

    console.log('🔍 [getMenuDataWithReport] API响应:', response);

    if (!response) {
      throw new Error('API响应为空');
    }

    if (response.code !== 0) {
      throw new Error(`获取菜单数据失败，错误码: ${response.code}, 消息: ${response.message}`);
    }

    if (!response.data) {
      throw new Error('API响应数据为空');
    }

    if (!response.data.resultList) {
      throw new Error('API响应resultList为空');
    }

    const backendMenuData = response.data.resultList;

    // 创建报表管理菜单数据

    const reportMenuData: MenuItemType[] = [
      {
        menuId: 9,
        menuName: '报表管理',
        parentMenuId: -1,
        menuUrl: '/',
        functionList: [],
      },
      {
        menuId: 10,
        menuName: '股票集中度查询',
        parentMenuId: 9,
        menuUrl: '/',
        functionList: [
          { functionId: 12, functionName: '查询报表', functionDescrip: '查询股票集中度' },
          { functionId: 13, functionName: '导出报表', functionDescrip: '导出报表数据' },
        ],
      },
      {
        menuId: 11,
        menuName: '集中度额度管理',
        parentMenuId: 9,
        menuUrl: '/quota-manage',
        functionList: [
          { functionId: 14, functionName: '调整额度', functionDescrip: '调整集中度额度' },
          { functionId: 15, functionName: '批量调整', functionDescrip: '批量调整额度' },
        ],
      },
    ];

    // 合并后端数据和本地添加的报表管理菜单

    return [...backendMenuData, ...reportMenuData];
  } catch (error) {
    console.error('获取菜单数据失败:', error);
    throw error;
  }
}