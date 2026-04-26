import React from 'react';
import { Card, Descriptions, Spin, Button, Avatar, Tag } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons';
import { useUserInfo } from '@/hooks/useUserInfo';

interface UserInfoCardProps {
  /** 是否显示刷新按钮 */
  showRefresh?: boolean;
  /** 卡片标题 */
  title?: string;
  /** 是否显示为紧凑模式 */
  compact?: boolean;
  /** 自定义样式类名 */
  className?: string;
}

/**
 * 用户信息卡片组件
 * 用于展示当前登录用户的基本信息
 */
export const UserInfoCard: React.FC<UserInfoCardProps> = ({
  showRefresh = true,
  title = '用户信息',
  compact = false,
  className = '',
}) => {
  const { userData, loading, error, refresh, displayName, department, email, mobile } = useUserInfo();

  // 生成用户姓名的首字母作为头像
  const getAvatarText = () => {
    if (!displayName) return 'U';
    return displayName.charAt(0).toUpperCase();
  };

  // 获取头像颜色
  const getAvatarColor = () => {
    const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1'];
    const index = displayName.length % colors.length;
    return colors[index];
  };

  if (error) {
    return (
      <Card title={title} className={className}>
        <div className="text-center py-8">
          <div className="text-red-500 mb-2">加载用户信息失败</div>
          <div className="text-gray-500 text-sm mb-4">{error}</div>
          {showRefresh && (
            <Button type="primary" onClick={refresh}>
              重试
            </Button>
          )}
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card title={title} className={className}>
        <div className="text-center py-8">
          <Spin tip="加载用户信息中..." />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={title}
      className={className}
      extra={
        showRefresh && (
          <Button type="link" size="small" onClick={refresh}>
            刷新
          </Button>
        )
      }
    >
      <div className="flex flex-col md:flex-row gap-6">
        {/* 头像区域 */}
        <div className="flex flex-col items-center">
          <Avatar
            size={compact ? 64 : 80}
            style={{ backgroundColor: getAvatarColor(), fontSize: compact ? 24 : 32 }}
          >
            {getAvatarText()}
          </Avatar>
          {displayName && (
            <div className="mt-3 text-center">
              <div className="font-semibold text-lg">{displayName}</div>
              {department && (
                <Tag color="blue" className="mt-1">
                  <TeamOutlined className="mr-1" />
                  {department}
                </Tag>
              )}
            </div>
          )}
        </div>

        {/* 详细信息区域 */}
        <div className="flex-1">
          <Descriptions column={1} size={compact ? 'small' : 'default'}>
            {displayName && (
              <Descriptions.Item label="姓名">
                <div className="flex items-center">
                  <UserOutlined className="mr-2 text-gray-400" />
                  {displayName}
                </div>
              </Descriptions.Item>
            )}

            {department && (
              <Descriptions.Item label="部门">
                <div className="flex items-center">
                  <TeamOutlined className="mr-2 text-gray-400" />
                  {department}
                </div>
              </Descriptions.Item>
            )}

            {email && (
              <Descriptions.Item label="邮箱">
                <div className="flex items-center">
                  <MailOutlined className="mr-2 text-gray-400" />
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              </Descriptions.Item>
            )}

            {mobile && (
              <Descriptions.Item label="手机号">
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2 text-gray-400" />
                  {mobile}
                </div>
              </Descriptions.Item>
            )}

            {!displayName && !department && !email && !mobile && (
              <Descriptions.Item label="状态">
                <div className="text-gray-500">暂无用户信息</div>
              </Descriptions.Item>
            )}
          </Descriptions>
        </div>
      </div>
    </Card>
  );
};