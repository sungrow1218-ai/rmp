/**
 * 接口使用示例
 * 这些示例展示了如何调用 ops 服务中的接口
 */

import {
  querySobIdByWorkGroupId,
  querySetOfBook,
  querySetOfBookbySobId,
  queryExternSystem,
  type SobInfo,
  type ExtSysItem,
  type WorkGroupItem,
} from './ops';

// ==================== 示例1: 通过workGroupId查询sobId ====================
export async function exampleQuerySobIdByWorkGroupId() {
  try {
    const workGroupId = 123; // 示例工作台ID
    const result = await querySobIdByWorkGroupId(workGroupId);

    if (result.code === 0 && result.data?.resultList?.length > 0) {
      const workGroupItem: WorkGroupItem = result.data.resultList[0];
      console.log('查询成功:', {
        workGroupId: workGroupItem.workGroupId,
        workGroupName: workGroupItem.workGroupName,
        sobId: workGroupItem.sobId,
      });
      return workGroupItem.sobId;
    } else {
      console.error('查询失败:', result.message);
      return null;
    }
  } catch (error) {
    console.error('查询异常:', error);
    return null;
  }
}

// ==================== 示例2: 查询账户体系（账套） ====================
export async function exampleQuerySetOfBook() {
  try {
    // 方式1: 查询所有账套
    const result1 = await querySetOfBook({
      pageId: 1,
      pageSize: 100,
    });

    // 方式2: 按条件查询
    const result2 = await querySetOfBook({
      pageId: 1,
      pageSize: 10,
      filterCondition: {
        sobName: '测试账套',
      },
    });

    if (result1.code === 0) {
      console.log('账套总数:', result1.data.totalSize);
      console.log('账套列表:', result1.data.resultList);

      // 处理账套信息
      result1.data.resultList.forEach((sobInfo: SobInfo) => {
        console.log(`账套ID: ${sobInfo.sobId}, 名称: ${sobInfo.sobName}`);
        sobInfo.bookList.forEach((book) => {
          console.log(`  账户类型: ${book.bookType}, 深度: ${book.bookDepth}`);
        });
      });
    }

    return result1.data?.resultList || [];
  } catch (error) {
    console.error('查询异常:', error);
    return [];
  }
}

// ==================== 示例3: 通过sobId获取账户体系 ====================
export async function exampleQuerySetOfBookbySobId() {
  try {
    const sobId = 456; // 示例账套ID
    const result = await querySetOfBookbySobId(sobId);

    if (result.code === 0 && result.data?.resultList?.length > 0) {
      const sobInfo: SobInfo = result.data.resultList[0];
      console.log('账套详情:', {
        sobId: sobInfo.sobId,
        sobName: sobInfo.sobName,
        bookTypesCount: sobInfo.bookList.length,
      });

      // 获取账户层级信息
      sobInfo.bookList.forEach((book, index) => {
        console.log(`账户类型 ${index + 1}:`);
        book.bookLevelList.forEach((level) => {
          console.log(`  层级 ${level.bookLevel}: ${level.bookLevelName}`);
        });
      });

      return sobInfo;
    } else {
      console.error('查询失败:', result.message);
      return null;
    }
  } catch (error) {
    console.error('查询异常:', error);
    return null;
  }
}

// ==================== 示例4: 查询外部交易系统 ====================
export async function exampleQueryExternSystem() {
  try {
    // 方式1: 查询所有交易系统
    const result1 = await queryExternSystem({
      pageId: 1,
      pageSize: 100,
    });

    // 方式2: 按账套ID查询
    const result2 = await queryExternSystem({
      pageId: 1,
      pageSize: 50,
      filterCondition: {
        sobId: 456, // 账套ID
      },
    });

    // 方式3: 按系统ID查询
    const result3 = await queryExternSystem({
      pageId: 1,
      pageSize: 10,
      filterCondition: {
        extSysId: [1, 2, 3], // 系统ID数组
      },
    });

    if (result1.code === 0) {
      console.log('交易系统总数:', result1.data.totalSize);

      result1.data.resultList.forEach((sys: ExtSysItem) => {
        console.log(`系统ID: ${sys.extSysId}, 名称: ${sys.extSysName}, 账套: ${sys.sobId}`);
      });
    }

    return result1.data?.resultList || [];
  } catch (error) {
    console.error('查询异常:', error);
    return [];
  }
}

// ==================== 综合示例: 完整工作流 ====================
export async function exampleCompleteWorkflow() {
  console.log('=== 开始完整工作流示例 ===');

  // 1. 通过workGroupId查询sobId
  const sobId = await exampleQuerySobIdByWorkGroupId();
  if (!sobId) {
    console.error('无法获取sobId，工作流终止');
    return;
  }

  console.log(`获取到sobId: ${sobId}`);

  // 2. 通过sobId获取账户体系
  const sobInfo = await exampleQuerySetOfBookbySobId();
  if (!sobInfo) {
    console.error('无法获取账套信息，工作流终止');
    return;
  }

  // 3. 查询该账套下的外部交易系统
  const systems = await queryExternSystem({
    pageId: 1,
    pageSize: 100,
    filterCondition: { sobId },
  });

  if (systems.code === 0) {
    console.log(`账套 ${sobInfo.sobName} 下的交易系统:`);
    systems.data?.resultList?.forEach((sys) => {
      console.log(`  - ${sys.extSysName} (ID: ${sys.extSysId})`);
    });
  }

  console.log('=== 完整工作流示例结束 ===');
}

// 导出所有示例函数
export default {
  exampleQuerySobIdByWorkGroupId,
  exampleQuerySetOfBook,
  exampleQuerySetOfBookbySobId,
  exampleQueryExternSystem,
  exampleCompleteWorkflow,
};