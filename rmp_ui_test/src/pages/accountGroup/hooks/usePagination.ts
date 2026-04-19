// src/pages/.../hooks/usePagination.ts
import { useMemo, useState, useEffect } from 'react';

export default function usePagination<T>(items: T[], pageSize: number) {
  const [page, setPage] = useState(1);

  // 当数据源或 pageSize 变化时，校正当前页
  useEffect(() => {
    if (!Array.isArray(items)) return;
    const totalPages = Math.max(1, Math.ceil(items.length / (pageSize || 1)));
    setPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [items, pageSize]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil((items?.length || 0) / (pageSize || 1))),
    [items, pageSize]
  );

  const pagedItems = useMemo(() => {
    if (!Array.isArray(items)) return [];
    const start = (page - 1) * (pageSize || 1);
    return items.slice(start, start + (pageSize || 1));
  }, [items, page, pageSize]);

  return {
    page,
    totalPages,
    pagedItems,
    setPage,
  };
}
