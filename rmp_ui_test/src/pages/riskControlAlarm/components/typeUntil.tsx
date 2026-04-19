export const showIndexValueTable = (data: any, isT: number, unit: string) => {
  if (data === 'inf') {
    return '默认触警';
  }
  if (data === '-inf') {
    return '默认触警';
  }
  if (data === 'nan') {
    return '无效';
  }
  if (isT === 1 && typeof data === 'number') {
    const value = (data * 100).toFixed(2);
    return `${value}${unit}`;
  }
  if (isT === 2 && typeof data === 'number') {
    const value = (data / 10000).toFixed(6);
    return `${value}${unit}`;
  }
  if (isT === 3 && typeof data === 'number') {
    const value = data;
    if (unit === '倍') {
      const value1 = value.toFixed(2);
      return `${value1}${unit}`;
    }
    return `${value}${unit}`;
  }
  return '--';
};
