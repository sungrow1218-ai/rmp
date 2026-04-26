/**
 * 集成测试示例
 * 展示如何在实际场景中使用 ops 服务接口
 */

import {
  querySobIdByWorkGroupId,
  querySetOfBook,
  querySetOfBookbySobId,
  queryExternSystem,
} from './ops';

/**
 * 场景1: 获取工作台信息并查询其账套详情
 */
export async function getWorkGroupAndSobInfo(workGroupId: number) {
  console.log(`\n=== 场景1: 查询工作台 ${workGroupId} 信息 ===`);

  try {
    // 1. 通过workGroupId查询sobId
    console.log('步骤1: 查询sobId');
    const sobResult = await querySobIdByWorkGroupId(workGroupId);

    if (sobResult.code !== 0) {
      console.error('步骤1失败:', sobResult.message);
      return null;
    }

    const workGroupInfo = sobResult.data?.resultList?.[0];
    if (!workGroupInfo) {
      console.error('未找到工作台信息');
      return null;
    }

    const sobId = workGroupInfo.sobId;
    console.log(`找到工作台: ID=${workGroupInfo.workGroupId}, 名称=${workGroupInfo.workGroupName}, 账套ID=${sobId}`);

    // 2. 查询账套详情
    console.log('\n步骤2: 查询账套详情');
    const sobDetailResult = await querySetOfBookbySobId(sobId);

    if (sobDetailResult.code !== 0) {
      console.error('步骤2失败:', sobDetailResult.message);
      return null;
    }

    const sobDetail = sobDetailResult.data?.resultList?.[0];
    if (!sobDetail) {
      console.error('未找到账套详情');
      return null;
    }

    console.log('账套详情:', {
      sobId: sobDetail.sobId,
      sobName: sobDetail.sobName,
      bookTypesCount: sobDetail.bookList.length,
    });

    // 3. 查询外部交易系统
    console.log('\n步骤3: 查询外部交易系统');
    const systemResult = await queryExternSystem({
      pageId: 1,
      pageSize: 10,
      filterCondition: { sobId },
    });

    if (systemResult.code !== 0) {
      console.error('步骤3失败:', systemResult.message);
      return null;
    }

    const systems = systemResult.data?.resultList || [];
    console.log(`找到 ${systems.length} 个交易系统:`);
    systems.forEach((system, index) => {
      console.log(`  ${index + 1}. ${system.extSysName} (ID: ${system.extSysId})`);
    });

    return {
      workGroupInfo,
      sobDetail,
      systems,
    };
  } catch (error) {
    console.error('集成测试异常:', error);
    return null;
  }
}

/**
 * 场景2: 完整的账户系统查询流程
 */
export async function completeAccountSystemWorkflow() {
  console.log('\n=== 场景2: 完整账户系统查询流程 ===');

  try {
    // 1. 查询所有账套
    console.log('步骤1: 查询所有账套');
    const allSobResult = await querySetOfBook({
      pageId: 1,
      pageSize: 10,
    });

    if (allSobResult.code !== 0) {
      console.error('步骤1失败:', allSobResult.message);
      return null;
    }

    const allSobs = allSobResult.data?.resultList || [];
    console.log(`查询到 ${allSobs.length} 个账套`);

    if (allSobs.length === 0) {
      console.log('没有找到账套信息');
      return null;
    }

    // 2. 对每个账套进行详细查询
    console.log('\n步骤2: 查询每个账套的详细信息');
    const detailedResults = [];

    for (const sob of allSobs) {
      console.log(`\n查询账套 ${sob.sobName} (ID: ${sob.sobId})`);

      // 查询账套详情
      const detailResult = await querySetOfBookbySobId(sob.sobId);
      if (detailResult.code === 0 && detailResult.data?.resultList?.length > 0) {
        const sobDetail = detailResult.data.resultList[0];
        detailedResults.push(sobDetail);

        console.log('账套详情:', {
          sobId: sobDetail.sobId,
          sobName: sobDetail.sobName,
          bookTypesCount: sobDetail.bookList.length,
        });

        // 查询该账套下的交易系统
        const systemResult = await queryExternSystem({
          pageId: 1,
          pageSize: 10,
          filterCondition: { sobId: sob.sobId },
        });

        if (systemResult.code === 0) {
          const systems = systemResult.data?.resultList || [];
          console.log(`  关联交易系统: ${systems.length} 个`);
        }
      }
    }

    return {
      totalSobs: allSobs.length,
      detailedResults,
    };
  } catch (error) {
    console.error('集成测试异常:', error);
    return null;
  }
}

/**
 * 场景3: 模拟业务操作流程
 */
export async function simulateBusinessWorkflow() {
  console.log('\n=== 场景3: 模拟业务操作流程 ===');

  try {
    // 1. 用户输入工作台ID
    const workGroupId = 123;

    // 2. 查询工作台信息
    console.log('步骤1: 查询工作台信息');
    const workGroupResult = await querySobIdByWorkGroupId(workGroupId);

    if (workGroupResult.code !== 0) {
      console.error('工作台查询失败:', workGroupResult.message);
      return null;
    }

    const workGroup = workGroupResult.data?.resultList?.[0];
    if (!workGroup) {
      console.error('工作台不存在');
      return null;
    }

    console.log(`工作台信息: ID=${workGroup.workGroupId}, 名称=${workGroup.workGroupName}`);

    // 3. 查询该工作台对应的账套
    const sobId = workGroup.sobId;
    console.log(`\n步骤2: 查询账套 ${sobId} 的详细信息`);

    const sobDetailResult = await querySetOfBookbySobId(sobId);
    if (sobDetailResult.code !== 0) {
      console.error('账套详情查询失败:', sobDetailResult.message);
      return null;
    }

    const sobDetail = sobDetailResult.data?.resultList?.[0];
    if (!sobDetail) {
      console.error('账套不存在');
      return null;
    }

    console.log('账套详情:', {
      sobId: sobDetail.sobId,
      sobName: sobDetail.sobName,
      accountTypes: sobDetail.bookList.map(book => ({
        type: book.bookType,
        depth: book.bookDepth,
        levels: book.bookLevelList.map(level => ({
          level: level.bookLevel,
          name: level.bookLevelName,
        })),
      })),
    });

    // 4. 查询该账套下的交易系统
    console.log('\n步骤3: 查询外部交易系统');
    const systemResult = await queryExternSystem({
      pageId: 1,
      pageSize: 20,
      filterCondition: { sobId },
    });

    if (systemResult.code !== 0) {
      console.error('交易系统查询失败:', systemResult.message);
      return null;
    }

    const systems = systemResult.data?.resultList || [];
    console.log(`找到 ${systems.length} 个交易系统:`);
    systems.forEach((system, index) => {
      console.log(`  ${index + 1}. ${system.extSysName} (ID: ${system.extSysId})`);
    });

    // 5. 返回完整信息
    return {
      workGroup,
      sobDetail,
      systems,
    };
  } catch (error) {
    console.error('业务操作流程异常:', error);
    return null;
  }
}

// 运行所有集成测试
export async function runAllIntegrationTests() {
  console.log('开始运行所有集成测试...\n');

  const results = await Promise.allSettled([
    getWorkGroupAndSobInfo(123),
    completeAccountSystemWorkflow(),
    simulateBusinessWorkflow(),
  ]);

  const passed = results.filter(r => r.status === 'fulfilled').length;
  const total = results.length;

  console.log('\n=== 集成测试结果 ===');
  console.log(`通过: ${passed}/${total}`);
  console.log(`失败: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('✅ 所有集成测试通过！');
    return true;
  } else {
    console.log('❌ 部分集成测试失败');
    return false;
  }
}

// 如果是直接运行此脚本
if (require.main === module) {
  runAllIntegrationTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('集成测试运行异常:', error);
    process.exit(1);
  }
}