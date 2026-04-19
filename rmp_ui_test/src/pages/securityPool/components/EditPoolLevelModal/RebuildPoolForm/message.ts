export const messageInfo = (alterType: number) => {
  switch (alterType) {
    case 1:
      return '券池层级已新增，需要复核后生效';
    case 2:
      return '券池层级已修改，需要复核后生效';
    case 3:
      return '券池层级已删除，需要复核后生效';
    case 4:
      return '已有在途流程，请撤销流程或流程办结后再操作';
    case 5:
      return '本券池有标的变更的流程未办结';
    default:
      return '';
  }
};
export const messageTopInfo = (alterType: number) => {
  switch (alterType) {
    case 1:
      return '券池已新增，需要复核后生效';
    case 2:
      return '券池已修改，需要复核后生效';
    case 3:
      return '券池已删除，需要复核后生效';
    case 4:
      return '已有在途流程，请撤销流程或流程办结后再操作';
    default:
      return '';
  }
};
export const messageDetailInfo = (alterType: number) => {
  switch (alterType) {
    case 1:
      return '已新增证券明细，需要复核后生效';
    case 2:
      return '已修改证券明细，需要复核后生效';
    case 3:
      return '已删除证券明细，需要复核后生效';
    case 4:
      return '已有在途流程，请撤销流程或流程办结后再操作';
    default:
      return '';
  }
};
