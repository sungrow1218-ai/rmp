import { FutureOptionList } from '@/services/FutureOption';
import { v4 as uuidv4 } from 'uuid';

export /**
 * 计算合并的数量
 */
const rowSpanInfo = (tableData: FutureOptionList[]) => {
  const data = [...tableData].sort((a, b) => {
    if (a.marketId !== b.marketId) {
      return a.marketId - b.marketId;
    }
    if (a.kindCode !== b.kindCode) {
      return a.kindCode.localeCompare(b.kindCode);
    }
    const monthA =
      a.monthControlType === 1
        ? a.contractMonth
        : a.monthControlType === 2
        ? 0 - a.contractMonth
        : 0;
    const monthB =
      b.monthControlType === 1
        ? b.contractMonth
        : b.monthControlType === 2
        ? 0 - b.contractMonth
        : 0;

    // if (a.monthControlType !== b.monthControlType) {
    //   return b.monthControlType - a.monthControlType;
    // }
    // if (a.contractMonth !== b.contractMonth) {
    //   return a.contractMonth - b.contractMonth;
    // }
    if (monthA !== monthB) {
      return monthA - monthB;
    }
    if (a.beginDateType !== b.beginDateType) {
      return b.beginDateType - a.beginDateType;
    }
    if (a.beginMonthOffset !== b.beginMonthOffset) {
      return a.beginMonthOffset - b.beginMonthOffset;
    }
    if (a.beginDayOffset !== b.beginDayOffset) {
      return a.beginDayOffset - b.beginDayOffset;
    }
    if (a.beginInfluenceDirection !== b.beginInfluenceDirection) {
      return a.beginInfluenceDirection - b.beginInfluenceDirection;
    }
    if (a.endMonthOffset !== b.beginMonthOffset) {
      return b.endMonthOffset - a.endMonthOffset;
    }
    if (a.endDayOffset !== b.endDayOffset) {
      return a.endDayOffset - b.endDayOffset;
    }
    if (a.endDateType !== b.endDateType) {
      return b.endDateType - a.endDateType;
    }
    if (a.endInfluenceDirection !== b.endInfluenceDirection) {
      return a.endInfluenceDirection - b.endInfluenceDirection;
    }

    return a.createDateTime.localeCompare(b.createDateTime);
  });

  const rowInfo: { [key: string]: any } = {};
  const isRowSpan: { [key: string]: any } = {};
  data.forEach((item) => {
    /** 第一行 */
    const markInfo = `marketId${item.marketId}`;
    const kindCodeInfo = `${markInfo}-kindCode${item.kindCode}`;
    const monthInfo = `${kindCodeInfo}-monthControlType${item.monthControlType}-contractMonth${item.contractMonth}`;
    const timeInfo = `${monthInfo}-beginDateType${item.beginDateType}-beginInfluenceDirection${item.beginInfluenceDirection}-beginDayOffset${item.beginDayOffset}-beginMonthOffset${item.beginMonthOffset}-endDateType${item.endDateType}-endInfluenceDirection${item.endInfluenceDirection}-endDayOffset${item.endDayOffset}-${item.endMonthOffset}`;
    const markLenght = data.filter(
      (itemMarket) => itemMarket.marketId === item.marketId
    )?.length;
    const kindLenght = data.filter(
      (itemKind) =>
        itemKind.marketId === item.marketId &&
        item.kindCode === itemKind.kindCode
    )?.length;
    const monthLenght = data.filter(
      (itemMonth) =>
        itemMonth.marketId === item.marketId &&
        item.kindCode === itemMonth.kindCode &&
        itemMonth.monthControlType === item.monthControlType &&
        item.contractMonth === itemMonth.contractMonth
    )?.length;
    const timeLenght = data.filter(
      (itemTime) =>
        itemTime.marketId === item.marketId &&
        item.kindCode === itemTime.kindCode &&
        itemTime.monthControlType === item.monthControlType &&
        item.contractMonth === itemTime.contractMonth &&
        itemTime.beginDateType === item.beginDateType &&
        item.beginInfluenceDirection === itemTime.beginInfluenceDirection &&
        itemTime.beginDayOffset === item.beginDayOffset &&
        item.beginMonthOffset === itemTime.beginMonthOffset &&
        itemTime.endDateType === item.endDateType &&
        item.endInfluenceDirection === itemTime.endInfluenceDirection &&
        itemTime.endDayOffset === item.endDayOffset &&
        item.endMonthOffset === itemTime.endMonthOffset
    )?.length;
    if (!rowInfo[markInfo]) {
      rowInfo[markInfo] = markLenght;
    }
    if (!rowInfo[kindCodeInfo]) {
      rowInfo[kindCodeInfo] = kindLenght;
    }
    if (!rowInfo[monthInfo]) {
      rowInfo[monthInfo] = monthLenght;
    }
    if (!rowInfo[timeInfo]) {
      rowInfo[timeInfo] = timeLenght;
    }
  });
  const newData = data.map((item) => {
    const markInfo = `marketId${item.marketId}`;
    const kindCodeInfo = `${markInfo}-kindCode${item.kindCode}`;
    const monthInfo = `${kindCodeInfo}-monthControlType${item.monthControlType}-contractMonth${item.contractMonth}`;
    const timeInfo = `${monthInfo}-beginDateType${item.beginDateType}-beginInfluenceDirection${item.beginInfluenceDirection}-beginDayOffset${item.beginDayOffset}-beginMonthOffset${item.beginMonthOffset}-endDateType${item.endDateType}-endInfluenceDirection${item.endInfluenceDirection}-endDayOffset${item.endDayOffset}-${item.endMonthOffset}`;
    let marketIdRowSpan = 1;
    let kindCodeRowSpan = 1;
    let monthRowSpan = 1;
    let timeRowSpan = 1;
    if (isRowSpan[markInfo] && rowInfo[markInfo] > 1) {
      marketIdRowSpan = 0;
    }
    if (!isRowSpan[markInfo]) {
      marketIdRowSpan = rowInfo[markInfo];
      isRowSpan[markInfo] = true;
    }
    if (isRowSpan[kindCodeInfo] && rowInfo[kindCodeInfo] > 1) {
      kindCodeRowSpan = 0;
    }
    if (!isRowSpan[kindCodeInfo]) {
      kindCodeRowSpan = rowInfo[kindCodeInfo];
      isRowSpan[kindCodeInfo] = true;
    }
    if (isRowSpan[monthInfo] && rowInfo[monthInfo] > 1) {
      monthRowSpan = 0;
    }
    if (!isRowSpan[monthInfo]) {
      monthRowSpan = rowInfo[monthInfo];
      isRowSpan[monthInfo] = true;
    }
    if (isRowSpan[timeInfo] && rowInfo[timeInfo] > 1) {
      timeRowSpan = 0;
    }
    if (!isRowSpan[timeInfo]) {
      timeRowSpan = rowInfo[timeInfo];
      isRowSpan[timeInfo] = true;
    }
    return {
      ...item,
      marketIdRowSpan,
      kindCodeRowSpan,
      monthRowSpan,
      timeRowSpan,
    };
  });
  return newData;
};

export const filterSlect = (
  tableData: FutureOptionList[],
  record: FutureOptionList,
  type: number
) => {
  const marketData = tableData.filter(
    (item) => item.marketId === record.marketId
  );
  const kindData = marketData.filter(
    (item) => item.kindCode === record.kindCode
  );
  const monthData = kindData.filter(
    (item) =>
      item.monthControlType === record.monthControlType &&
      item.contractMonth === record.contractMonth
  );
  const timeData = monthData.filter(
    (item) =>
      item.beginDateType === record.beginDateType &&
      item.beginInfluenceDirection === record.beginInfluenceDirection &&
      item.beginDayOffset === record.beginDayOffset &&
      item.beginMonthOffset === record.beginMonthOffset &&
      item.endDateType === record.endDateType &&
      item.endInfluenceDirection === record.endInfluenceDirection &&
      item.endDayOffset === record.endDayOffset &&
      item.endMonthOffset === record.endMonthOffset
  );
  let selectList: FutureOptionList[] = [];
  switch (type) {
    case 0:
      selectList = marketData;
      break;
    case 1:
      selectList = kindData;
      break;
    case 2:
      selectList = monthData;
      break;
    case 3:
      selectList = timeData;
      break;
    default:
      selectList = [record];
  }
  return selectList;
};

export const tranformKindInfo = (data: any) => {
  const defaultList: any[] = [];

  data?.forEach((item: any) => {
    const _contractMonth = Number(item['合约月份']);
    const monthControlType =
      _contractMonth === 0 ? 0 : _contractMonth > 0 ? 1 : 2;
    const contractMonth = monthControlType === 0 ? 0 : Math.abs(_contractMonth);
    if (monthControlType === 1) {
    }
    const timeArry = Array.isArray(item['时段'])
      ? item['时段']
      : [item['时段']];
    timeArry?.forEach((timeItem: any) => {
      const marketPositionQuantity = Number(timeItem['持仓规模']);
      const thresholdType = Number(timeItem['比例']) === 1 ? 2 : 1;
      const threshold =
        thresholdType === 1
          ? Number(timeItem['数量'])
          : Number(timeItem['比例']);
      let compareDirection = 0;
      if (marketPositionQuantity !== 0) {
        compareDirection = 1;
      }
      const beginTime = timeItem['起始时间'];
      const beginInfluenceDirection = Number(beginTime['是否包含']) ? 3 : 1;

      let beginMonthOffset = 0;
      let beginDayOffset = 0;
      let beginDateType = 0;

      if (beginTime['上市日'] === '') {
        beginMonthOffset = 0;
        beginDayOffset = 0;
        beginDateType = 3;
      }
      if (beginTime['交割月']) {
        beginMonthOffset = 0;
        beginDayOffset = Number(beginTime['交割月']['天数']);
        beginDateType = Number(beginTime['交割月']['单位']);
      }
      if (beginTime['交割月前']) {
        beginMonthOffset = Number(-beginTime['交割月前']['月份']);
        beginDayOffset = Number(beginTime['交割月前']['天数']);
        beginDateType = Number(beginTime['交割月前']['单位']);
      }

      const endTime = timeItem['截止时间'];
      const endInfluenceDirection = Number(endTime['是否包含']) ? 4 : 2;
      let endMonthOffset = 0;
      let endDayOffset = 0;
      let endDateType = 0;

      if (endTime['上市日'] === '') {
        endMonthOffset = 0;
        endDayOffset = 0;
        endDateType = 3;
      }
      if (endTime['交割月']) {
        endMonthOffset = 0;
        endDayOffset = Number(endTime['交割月']['天数']);
        endDateType = Number(endTime['交割月']['单位']);
      }
      if (endTime['交割月前']) {
        endMonthOffset = Number(-endTime['交割月前']['月份']);
        endDayOffset = Number(endTime['交割月前']['天数']);
        endDateType = Number(endTime['交割月前']['单位']);
      }
      defaultList.push({
        key: uuidv4(),
        limitId: 0,
        kindCode: item['代码'],
        marketId: Number(item['交易所代码']),
        monthControlType,
        contractMonth,
        beginDateType,
        beginInfluenceDirection,
        beginDayOffset,
        beginMonthOffset,
        endDateType,
        endInfluenceDirection,
        endDayOffset,
        endMonthOffset,
        thresholdType,
        threshold,
        compareDirection,
        marketPositionQuantity,
      });
    });
  });
  return defaultList;
};

export const tranTimeForm = (data: any) => {
  const editObj = {
    key: uuidv4(),
    groupId: 0,
    monthControlType: Number(data.monthControlType),
    contractMonth:
      data.monthControlType !== '0' ? Number(data.contractMonth) : 0,

    beginInfluenceDirection: Number(data.beginInfluenceDirection),
    beginDayOffset:
      data.beginMonthOffset !== '1' ? Number(data.beginDayOffset) : 0,
    beginMonthOffset:
      data.beginMonthOffset !== '1' ? Number(data.beginMonthOffset) : 0,
    beginDateType:
      data.beginMonthOffset !== '1' ? Number(data.beginDateType) : 3,

    endInfluenceDirection: Number(data.endInfluenceDirection),
    endDayOffset: data.endMonthOffset !== '1' ? Number(data.endDayOffset) : 0,
    endMonthOffset:
      data.endMonthOffset !== '1' ? Number(data.endMonthOffset) : 0,
    endDateType: data.endMonthOffset !== '1' ? Number(data.endDateType) : 3,

    thresholdType: Number(data.thresholdType),
    threshold: data.threshold,
    compareDirection: Number(data.compareDirection)
      ? Number(data.compareDirection)
      : 0,
    marketPositionQuantity: Number(data.marketPositionQuantity)
      ? Number(data.marketPositionQuantity)
      : 0,
  };
  return editObj;
};
export const addHaveKey = (data: FutureOptionList[]) => {
  return data.map((item) => {
    return {
      ...item,
      haveKey: `${item.monthControlType}-${item.contractMonth}-${item.beginDateType}-${item.beginInfluenceDirection}-${item.beginDayOffset}-${item.beginMonthOffset}-${item.endDateType}-${item.endInfluenceDirection}-${item.endDayOffset}-${item.endMonthOffset}-${item.thresholdType}
      `,
    };
  });
};

type haveKeyFutureOptionList = { haveKey: string } & FutureOptionList;

export const filterHaveKey = (
  modelData: haveKeyFutureOptionList[],
  haveSetData: haveKeyFutureOptionList[]
) => {
  const haveDataKey = haveSetData.map((item) => item.haveKey);
  return modelData.filter((modelItem) => {
    return !haveDataKey.includes(modelItem.haveKey);
  });
};

export const sortEditData = (tableData: FutureOptionList[]) => {
  const data = [...tableData].sort((a, b) => {
    if (a.marketId !== b.marketId) {
      return a.marketId - b.marketId;
    }
    if (a.kindCode !== b.kindCode) {
      return a.kindCode.localeCompare(b.kindCode);
    }
    const monthA =
      a.monthControlType === 1
        ? a.contractMonth
        : a.monthControlType === 2
        ? 0 - a.contractMonth
        : 0;
    const monthB =
      b.monthControlType === 1
        ? b.contractMonth
        : b.monthControlType === 2
        ? 0 - b.contractMonth
        : 0;

    if (monthA !== monthB) {
      return monthA - monthB;
    }
    if (a.beginDateType !== b.beginDateType) {
      return b.beginDateType - a.beginDateType;
    }
    if (a.beginMonthOffset !== b.beginMonthOffset) {
      return a.beginMonthOffset - b.beginMonthOffset;
    }
    if (a.beginDayOffset !== b.beginDayOffset) {
      return a.beginDayOffset - b.beginDayOffset;
    }
    if (a.beginInfluenceDirection !== b.beginInfluenceDirection) {
      return a.beginInfluenceDirection - b.beginInfluenceDirection;
    }
    if (a.endMonthOffset !== b.beginMonthOffset) {
      return b.endMonthOffset - a.endMonthOffset;
    }
    if (a.endDayOffset !== b.endDayOffset) {
      return a.endDayOffset - b.endDayOffset;
    }
    if (a.endDateType !== b.endDateType) {
      return b.endDateType - a.endDateType;
    }
    if (a.endInfluenceDirection !== b.endInfluenceDirection) {
      return a.endInfluenceDirection - b.endInfluenceDirection;
    }

    return a.createDateTime.localeCompare(b.createDateTime);
  });
  return data;
};
