/**
 * 真实登录测试脚本
 * 直接在浏览器控制台运行，测试登录API是否正常工作
 */

async function testRealLogin() {
  console.log('🔍 开始真实登录测试...\n');

  // 测试数据
  const testData = {
    userName: 'testuser',
    password: 'testpassword123'
  };

  console.log('📤 准备发送登录请求:');
  console.log('   URL: /rmp/aegis/api/authority/login');
  console.log('   方法: POST');
  console.log('   数据:', testData);
  console.log('');

  try {
    // 使用fetch直接测试API
    const response = await fetch('/rmp/aegis/api/authority/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
      credentials: 'include'
    });

    console.log('📥 收到响应:');
    console.log('   状态码:', response.status);
    console.log('   状态文本:', response.statusText);
    console.log('');

    const data = await response.json();
    console.log('📊 响应数据:', data);

    if (response.ok) {
      console.log('\n✅ API调用成功');
      if (data.code === 0) {
        console.log('✅ 登录业务成功');
        if (data.data?.token) {
          console.log('✅ 获取到Token:', data.data.token.substring(0, 20) + '...');
        } else {
          console.log('⚠️  未获取到Token');
        }
      } else {
        console.log('❌ 登录业务失败:', data.message);
      }
    } else {
      console.log('\n❌ API调用失败');
    }

    console.log('\n🔍 测试完成');

  } catch (error) {
    console.error('❌ 请求异常:', error);
    console.error('错误详情:', error.message);
  }
}

// 自动运行测试
console.log('🔄 3秒后自动运行登录测试...');
setTimeout(() => {
  testRealLogin();
}, 3000);

// 在控制台运行 testRealLogin() 手动测试