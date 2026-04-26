/**
 * 测试 ops 服务接口
 * 这个脚本用于验证接口是否正确实现
 */

import {
  querySobIdByWorkGroupId,
  querySetOfBook,
  querySetOfBookbySobId,
  queryExternSystem,
} from './ops';

async function testQuerySobIdByWorkGroupId() {
  console.log('=== 测试 querySobIdByWorkGroupId ===');

  try {
    // 测试1: 正常查询
    console.log('测试1: 查询workGroupId=123');
    const result1 = await querySobIdByWorkGroupId(123);
    console.log('返回结果:', {
      code: result1.code,
      message: result1.message,
      data: result1.data,
    });

    // 测试2: 不存在的workGroupId
    console.log('\n测试2: 查询不存在的workGroupId=999999');
    const result2 = await querySobIdByWorkGroupId(999999);
    console.log('返回结果:', {
      code: result2.code,
      message: result2.message,
    });

    return true;
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

async function testQuerySetOfBook() {
  console.log('\n=== 测试 querySetOfBook ===');

  try {
    // 测试1: 查询所有账套
    console.log('测试1: 查询所有账套');
    const result1 = await querySetOfBook({
      pageId: 1,
      pageSize: 5,
    });
    console.log('返回结果:', {
      code: result1.code,
      message: result1.message,
      totalSize: result1.data?.totalSize,
      resultCount: result1.data?.resultList?.length,
    });

    // 测试2: 按条件查询
    console.log('\n测试2: 按条件查询');
    const result2 = await querySetOfBook({
      pageId: 1,
      pageSize: 10,
      filterCondition: {
        sobName: '测试',
      },
    });
    console.log('返回结果:', {
      code: result2.code,
      message: result2.message,
      resultCount: result2.data?.resultList?.length,
    });

    return true;
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

async function testQuerySetOfBookbySobId() {
  console.log('\n=== 测试 querySetOfBookbySobId ===');

  try {
    // 测试1: 查询存在的sobId
    console.log('测试1: 查询sobId=456');
    const result1 = await querySetOfBookbySobId(456);
    console.log('返回结果:', {
      code: result1.code,
      message: result1.message,
      data: result1.data?.resultList?.[0],
    });

    // 测试2: 查询不存在的sobId
    console.log('\n测试2: 查询不存在的sobId=999999');
    const result2 = await querySetOfBookbySobId(999999);
    console.log('返回结果:', {
      code: result2.code,
      message: result2.message,
    });

    return true;
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

async function testQueryExternSystem() {
  console.log('\n=== 测试 queryExternSystem ===');

  try {
    // 测试1: 查询特定账套的交易系统
    console.log('测试1: 查询sobId=456的交易系统');
    const result1 = await queryExternSystem({
      pageId: 1,
      pageSize: 10,
      filterCondition: { sobId: 456 },
    });
    console.log('返回结果:', {
      code: result1.code,
      message: result1.message,
      resultCount: result1.data?.resultList?.length,
    });

    // 测试2: 查询所有交易系统
    console.log('\n测试2: 查询所有交易系统');
    const result2 = await queryExternSystem({
      pageId: 1,
      pageSize: 20,
    });
    console.log('返回结果:', {
      code: result2.code,
      message: result2.message,
      totalSize: result2.data?.totalSize,
    });

    return true;
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

async function runAllTests() {
  console.log('开始测试 ops 服务接口...\n');

  const results = await Promise.all([
    testQuerySobIdByWorkGroupId(),
    testQuerySetOfBook(),
    testQuerySetOfBookbySobId(),
    testQueryExternSystem(),
  ]);

  const passed = results.filter(Boolean).length;
  const total = results.length;

  console.log('\n=== 测试结果 ===');
  console.log(`通过: ${passed}/${total}`);
  console.log(`失败: ${total - passed}/${total}`);

  if (passed === total) {
    console.log('✅ 所有测试通过！');
    return true;
  } else {
    console.log('❌ 部分测试失败');
    return false;
  }
}

// 如果是直接运行此脚本
if (require.main === module) {
  runAllTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('测试运行异常:', error);
    process.exit(1);
  });
}

export {
  testQuerySobIdByWorkGroupId,
  testQuerySetOfBook,
  testQuerySetOfBookbySobId,
  testQueryExternSystem,
  runAllTests,
};