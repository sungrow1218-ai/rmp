import { useState, useEffect, useCallback } from 'react';
import { queryWorkGroup } from '@/services/api';
import type { WorkGroupList } from '@/services/api';

export interface WorkGroupInfo {
  workGroupId: number;
  workGroupName: string;
  sobId: number;
}

export interface UseWorkGroupReturn {
  /** 工作台列表 */
  workGroupList: WorkGroupInfo[];
  /** 当前选中的工作台 */
  activeWorkGroup: WorkGroupInfo | null;
  /** 加载状态 */
  loading: boolean;
  /** 错误信息 */
  error: string | null;
  /** 手动刷新工作台列表 */
  refresh: () => Promise<void>;
  /** 设置当前工作台 */
  setActiveWorkGroup: (workGroup: WorkGroupInfo | null) => void;
}

/**
 * 工作台数据 Hook
 * 用于获取和管理工作台列表
 */
const useWorkGroup = (): UseWorkGroupReturn => {
  const [workGroupList, setWorkGroupList] = useState<WorkGroupInfo[]>([]);
  const [activeWorkGroup, setActiveWorkGroup] = useState<WorkGroupInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await queryWorkGroup({
        pageId: 1,
        pageSize: 1000,
        authFlag: 1,
      });

      if (response.code === 0 && response.data.resultList.length > 0) {
        const workGroups: WorkGroupInfo[] = response.data.resultList.map(item => ({
          workGroupId: item.workGroupId,
          workGroupName: item.workGroupName,
          sobId: item.sobId,
        }));

        setWorkGroupList(workGroups);

        // 默认选择第一个工作台（如果当前没有选中）
        if (!activeWorkGroup && workGroups.length > 0) {
          setActiveWorkGroup(workGroups[0]);
        }
      } else {
        // 如果接口返回空，使用默认数据
        const defaultWorkGroups: WorkGroupInfo[] = [
          { workGroupId: 1, workGroupName: '交易室合规风控工作台', sobId: 1 },
          { workGroupId: 2, workGroupName: '经纪业务风控工作台', sobId: 2 },
          { workGroupId: 3, workGroupName: '自营业务风控工作台', sobId: 3 },
          { workGroupId: 4, workGroupName: 'QFII业务风控工作台', sobId: 4 },
        ];
        setWorkGroupList(defaultWorkGroups);
        setActiveWorkGroup(defaultWorkGroups[0]);
      }
    } catch (err) {
      console.error('获取工作台列表失败:', err);
      setError('获取工作台列表失败，请检查网络连接');
      // 使用默认工作台数据
      const defaultWorkGroups: WorkGroupInfo[] = [
        { workGroupId: 1, workGroupName: '交易室合规风控工作台', sobId: 1 },
        { workGroupId: 2, workGroupName: '经纪业务风控工作台', sobId: 2 },
        { workGroupId: 3, workGroupName: '自营业务风控工作台', sobId: 3 },
        { workGroupId: 4, workGroupName: 'QFII业务风控工作台', sobId: 4 },
      ];
      setWorkGroupList(defaultWorkGroups);
      setActiveWorkGroup(defaultWorkGroups[0]);
    } finally {
      setLoading(false);
    }
  }, [activeWorkGroup]);

  useEffect(() => {
    fetchWorkGroups();
  }, [fetchWorkGroups]);

  const refresh = async () => {
    await fetchWorkGroups();
  };

  return {
    workGroupList,
    activeWorkGroup,
    loading,
    error,
    refresh,
    setActiveWorkGroup,
  };
};

export default useWorkGroup;
