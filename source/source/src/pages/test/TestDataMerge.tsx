import React, { useState, useEffect } from 'react';
import { Button, message, Card, Descriptions, Tag, Spin } from 'antd';
import { queryRuleTemplateDefaultConfiguration, queryRuleTemplate } from '@/services/api';
import { mergeDefaultParamAndValue } from '@/services/ruleTemplateTypes';
import {
  validateRuleTemplateData,
  fixRuleTemplateData,
  createFallbackTemplateData,
  checkApiResponse
} from '@/services/ruleTemplateDataValidator';

const TestDataMerge: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testDataMerge = async () => {
    setLoading(true);
    setError(null);
    setTestResult(null);

    try {
      console.log('🧪 开始测试数据合并功能');

      // 测试规则类型
      const ruleTypes = ['Z01101', 'Z01102', 'Z01201'];
      const ruleTmplGroupId = 1001; // 测试用的模板组ID

      // 1. 查询默认配置
      console.log('📤 查询默认配置，规则类型:', ruleTypes);
      const defaultRes = await queryRuleTemplateDefaultConfiguration(ruleTypes);

      console.log('📥 默认配置响应:', defaultRes);
      const isDefaultApiValid = checkApiResponse(defaultRes, 'queryRuleTemplateDefaultConfiguration');
      console.log('默认配置接口有效性:', isDefaultApiValid);

      // 2. 查询已有配置
      console.log('📤 查询已有配置，模板组ID:', ruleTmplGroupId);
      const templateRes = await queryRuleTemplate({
        pageId: 1,
        pageSize: 1000,
        authorityFlag: 0,
        filterCondition: [{ ruleTmplGroupId }],
      });

      console.log('📥 已有配置响应:', templateRes);
      const isTemplateApiValid = templateRes ? checkApiResponse(templateRes, 'queryRuleTemplate') : true;
      console.log('已有配置接口有效性:', isTemplateApiValid);

      // 3. 合并数据
      const result: { [key: string]: any } = {};

      if (defaultRes.data?.resultList?.length > 0) {
        for (const item of defaultRes.data.resultList) {
          try {
            const templateData =
              templateRes?.data?.resultList?.find(
                (i: any) => i.ruleType === item.ruleType
              ) || {};

            // 解析配置数据
            let defaultData;
            try {
              defaultData = JSON.parse(item.configuration);
            } catch (parseError) {
              console.error(`解析配置数据失败，规则类型: ${item.ruleType}`, parseError);
              result[item.ruleType] = {
                status: 'error',
                error: '解析配置数据失败',
                fallbackData: createFallbackTemplateData(item.ruleType)
              };
              continue;
            }

            const mergedData = mergeDefaultParamAndValue(defaultData, templateData);

            // 验证并修复数据
            const validation = validateRuleTemplateData(mergedData, item.ruleType);
            if (!validation.isValid) {
              console.warn(`规则类型 ${item.ruleType} 数据验证失败:`, validation.errors);
              const fixedData = fixRuleTemplateData(mergedData, defaultData);
              result[item.ruleType] = {
                status: 'fixed',
                originalData: mergedData,
                fixedData: fixedData,
                validationErrors: validation.errors
              };
            } else {
              result[item.ruleType] = {
                status: 'success',
                data: mergedData
              };
            }
          } catch (error) {
            console.error(`处理规则类型 ${item.ruleType} 失败:`, error);
            result[item.ruleType] = {
              status: 'error',
              error: error.message,
              fallbackData: createFallbackTemplateData(item.ruleType)
            };
            continue;
          }
        }
      } else {
        console.warn('默认配置接口返回空数据');
        for (const ruleType of ruleTypes) {
          result[ruleType] = {
            status: 'fallback',
            fallbackData: createFallbackTemplateData(ruleType)
          };
        }
      }

      // 设置测试结果
      setTestResult({
        ruleTypes,
        ruleTmplGroupId,
        defaultConfigCount: defaultRes.data?.resultList?.length || 0,
        existingConfigCount: templateRes?.data?.resultList?.length || 0,
        mergedResultCount: Object.keys(result).length,
        details: result,
        apiStatus: {
          defaultApi: isDefaultApiValid,
          templateApi: isTemplateApiValid
        }
      });

      message.success(`数据合并测试完成，共处理 ${Object.keys(result).length} 个规则类型`);
    } catch (err: any) {
      console.error('❌ 测试失败:', err);
      setError(err.message || '未知错误');
      message.error(`测试失败: ${err.message || '未知错误'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>数据合并功能测试</h1>
      <p>测试 queryRuleTemplateDefaultConfiguration 和 queryRuleTemplate 数据合并功能</p>

      <Button
        type="primary"
        onClick={testDataMerge}
        style={{ marginBottom: '20px' }}
        loading={loading}
      >
        开始测试
      </Button>

      {error && (
        <div style={{ color: 'red', marginBottom: '20px', padding: '10px', background: '#fff0f0', border: '1px solid #ffccc7' }}>
          <strong>错误信息:</strong> {error}
        </div>
      )}

      {testResult && (
        <div style={{ marginTop: '20px' }}>
          <h3>测试结果</h3>

          <Card title="接口状态" style={{ marginBottom: '20px' }}>
            <Descriptions column={2}>
              <Descriptions.Item label="默认配置接口">
                <Tag color={testResult.apiStatus.defaultApi ? 'success' : 'error'}>
                  {testResult.apiStatus.defaultApi ? '正常' : '异常'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="已有配置接口">
                <Tag color={testResult.apiStatus.templateApi ? 'success' : 'error'}>
                  {testResult.apiStatus.templateApi ? '正常' : '异常'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="默认配置数量">{testResult.defaultConfigCount}</Descriptions.Item>
              <Descriptions.Item label="已有配置数量">{testResult.existingConfigCount}</Descriptions.Item>
              <Descriptions.Item label="合并结果数量">{testResult.mergedResultCount}</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="规则类型详情">
            {Object.keys(testResult.details).map(ruleType => {
              const detail = testResult.details[ruleType];
              return (
                <Card
                  key={ruleType}
                  type="inner"
                  title={ruleType}
                  style={{ marginBottom: '10px' }}
                  extra={
                    <Tag color={
                      detail.status === 'success' ? 'success' :
                      detail.status === 'fixed' ? 'warning' :
                      detail.status === 'fallback' ? 'blue' : 'error'
                    }>
                      {detail.status === 'success' ? '成功' :
                       detail.status === 'fixed' ? '已修复' :
                       detail.status === 'fallback' ? '回退数据' : '错误'}
                    </Tag>
                  }
                >
                  {detail.status === 'success' && (
                    <div>
                      <p><strong>数据状态:</strong> 合并成功</p>
                      <p><strong>规则类型:</strong> {detail.data.ruleType}</p>
                      <p><strong>市场数量:</strong> {detail.data.marketList?.length || 0}</p>
                      {detail.data.marketList && detail.data.marketList.length > 0 && (
                        <div>
                          <p><strong>市场详情:</strong></p>
                          <ul>
                            {detail.data.marketList.map((market: any, index: number) => (
                              <li key={index}>
                                市场 {market.marketId} ({market.marketName}):
                                证券组数量: {market.securityGroupList?.length || 0}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {detail.status === 'fixed' && (
                    <div>
                      <p><strong>数据状态:</strong> 数据验证失败，已修复</p>
                      <p><strong>验证错误:</strong> {detail.validationErrors?.join(', ')}</p>
                      <p><strong>修复后市场数量:</strong> {detail.fixedData.marketList?.length || 0}</p>
                    </div>
                  )}

                  {detail.status === 'fallback' && (
                    <div>
                      <p><strong>数据状态:</strong> 使用回退数据</p>
                      <p><strong>原因:</strong> 默认配置接口返回空数据</p>
                      <p><strong>回退数据市场数量:</strong> {detail.fallbackData.marketList?.length || 0}</p>
                    </div>
                  )}

                  {detail.status === 'error' && (
                    <div>
                      <p><strong>数据状态:</strong> 处理失败</p>
                      <p><strong>错误信息:</strong> {detail.error}</p>
                      <p><strong>回退数据市场数量:</strong> {detail.fallbackData?.marketList?.length || 0}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </Card>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <Spin size="large" />
          <p>正在测试数据合并功能...</p>
        </div>
      )}
    </div>
  );
};

export default TestDataMerge;