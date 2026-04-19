export const messageInfo = (alterType: number) => {
  switch (alterType) {
    case 1:
      return '风控规则已新增，需要复核后生效';
    case 2:
      return '风控规则已修改，需要复核后生效';
    case 3:
      return '风控规则已删除，需要复核后生效';
    default:
      return '';
  }
};
