// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-lines */
import request, { parseRequestByPage } from '@/utils/request';
import {
  ResponseParameterPagination,
  type RequestParameterPagination,
  type CommonResponseIWrapper,
} from '../typing';

/**
 * 筛选条件传参格式
 */
interface QueryCondDTO {
  securityCode?: string;
  marketId?: number[];
  securityName?: string;
  securityType?: number[] | string[];
  securityList?: { securityCode: string; marketId: number }[];
}

/**
 * 角色参数
 */

interface SecurityResponseDTO {
  /** 证券代码 */
  securityCode: string;
  /** 市场编号 */
  marketId: number;
  /** 证券名称 */
  securityName: string;
  /** 证券类别 */
  securityType: number;
  /** 昨收盘价 */
  previousClosePrice: number;
  /** 涨停板价格 */
  uplimitedPrice: number;
  /** 跌停板价格 */
  downlimitedPrice: number;
  /** 币种代码 */
  tradeCurrencyCode: number;
}

export type QuerySecurityParamType = {
  filterCondition?: QueryCondDTO;
} & RequestParameterPagination;
/**
 * 证券资讯 - 查询证券
 */
export async function querySecurity(params: QuerySecurityParamType) {
  return parseRequestByPage<SecurityResponseDTO>(
    request(`/aegis/api/securityInfo/querySecurity`, {
      method: 'POST',
      data: params,
    })
  );
}

type QueryFuturesParam = {
  filterCondition?: { marketId?: number[]; futuresKindCode?: string[] };
} & RequestParameterPagination;

interface FuturesResponseDTO {
  kindCode: string;
  kindName: string;
  marketId: number;
}

/**
 * 期货列表
 */
export async function queryFutures(params: QueryFuturesParam) {
  return parseRequestByPage<FutureKindItem, FuturesResponseDTO>(
    request('/aegis/api/info/queryFutureKind', {
      method: 'POST',
      data: params,
    }),
    (idata: FutureKindItem): FuturesResponseDTO => ({
      kindCode: idata.futuresKindCode,
      kindName: idata.futuresKindName!,
      marketId: idata.marketId,
    })
  );
}

type QueryOptionsParam = {
  filterCondition?: { marketId?: number[]; optionKindCode?: string[] };
} & RequestParameterPagination;

interface OptionsResponseDTO {
  kindCode: string;
  kindName: string;
  marketId: number;
}

/**
 * 期权列表
 */
export async function queryOptions(params: QueryOptionsParam) {
  return parseRequestByPage<OptionKindItem, OptionsResponseDTO>(
    request('/aegis/api/info/queryOptionKind', {
      method: 'POST',
      data: params,
    }),
    (idata: OptionKindItem): OptionsResponseDTO => ({
      kindCode: idata.optionKindCode,
      kindName: idata.optionKindName!,
      marketId: idata.marketId,
    })
  );
}

/* ----------------------------- 股票 ------------------------------ */

export interface SecurityRelaItem {
  relatedMarketId: number;
  relatedSecurityCode: string;
  secuCodeRelaType: number;
  effectiveDate: string;
  expireDate: string;
}

export interface StockItem {
  informationSystemId: number;
  marketId: number;
  securityCode: string;
  securityName: string;
  securityType: number;
  tradeCurrencyCode: string;
  totalShare: number;
  outstandingShare: number;
  tradeUnitType: number;
  tradeUnitAmount: string;
  boardType: number;
  tradeStatus: number;
  listDate: string;
  delistDate: string;
  issuerOrganizationCode: string;
  previousClosePrice: number;
  uplimitedPrice: number;
  downlimitedPrice: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
  securityRelativeList: SecurityRelaItem[];
}

// 查询股票信息
export const queryStockInfo = (
  params: RequestParameterPagination & {
    filterCondition: {
      marketId?: number[];
      securityCode?: string;
      informationSystemId?: number;
      fuzzyQueryFlag: number; // 1:模糊查询;0:精确查询
    };
  }
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: StockItem[] }
    >
  >('/aegis/api/info/queryStockInfo', {
    method: 'POST',
    data: params,
  });

// 导出股票信息
export const exportStockInfo = (data: {
  securityCode?: string;
  marketId?: number[];
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/exportStockInfo`,
    {
      method: 'POST',
      data,
    }
  );

export type ReqAlterStockInfo = StockItem & {
  modifyType: number;
  operatorCode: string;
};

// 设置股票信息
export const alterStockInfo = (data: DeepPartial<ReqAlterStockInfo>) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/modifyStockInfo`,
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 债券 ------------------------------ */
export interface BondItem {
  informationSystemId: number;
  marketId: number;
  securityCode: string;
  securityName: string;
  securityType: number;
  tradeCurrencyCode: string;
  issueTotalAmount: number;
  issueRemainingAmount: number;
  currentFacePrice: number;
  tradeUnitType: number;
  tradeUnitAmount: string;
  changePrice: number;
  listDate: string;
  delistDate: string;
  maturityDate: string;
  issuerOrganizationCode: string;
  previousClosePrice: number;
  uplimitedPrice: number;
  downlimitedPrice: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
  securityRelativeList: SecurityRelaItem[];
  ratingInfo: RatingInfo;
}

// 查询债券信息
export const queryBondInfo = (
  params: RequestParameterPagination & {
    filterCondition: {
      marketId?: number[];
      securityCode?: string;
      querySecurityRatingFlag: string;
      informationSystemId?: number;
      fuzzyQueryFlag: number; // 1:模糊查询;0:精确查询
    };
  }
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: BondItem[] }
    >
  >('/aegis/api/info/queryBondInfo', {
    method: 'POST',
    data: params,
  });

// 导出债券信息
export const exportBondInfo = (data: {
  securityCode?: string;
  marketId?: number[];
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/exportBondInfo`,
    {
      method: 'POST',
      data,
    }
  );

export type ReqAlterBondInfo = BondItem & {
  modifyType: number;
  operatorCode: string;
};

// 设置债券信息
export const alterBondInfo = (data: DeepPartial<ReqAlterBondInfo>) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/modifyBondInfo`,
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 贵金属 品类 ------------------------------ */
export interface PreciousMetalKindItem {
  informationSystemId: number;
  marketId: number;
  prcsMetalKindCode: string;
  prcsMetalKindName: string;
  quoteUnit: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
}

// 贵金属品种信息查询
export const queryPreciousMetalKind = (
  params: RequestParameterPagination & {
    filterCondition?: {
      marketId?: number[];
      prcsMetalKindCode?: string[];
    };
  }
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: PreciousMetalKindItem[] }
    >
  >('/aegis/api/info/queryPreciousMetalKind', {
    method: 'POST',
    data: params,
  });

// 导出贵金属信息
export const exportPreciousMetalKind = (data: {
  marketId?: number[];
  prcsMetalKindCode?: string[];
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/exportPreciousMetalKind`,
    {
      method: 'POST',
      data,
    }
  );

export type ReqAlterPreciousMetalKind = PreciousMetalKindItem & {
  modifyType: number;
  operatorCode: string;
};

export const alterPreciousMetalKind = (
  data: DeepPartial<ReqAlterPreciousMetalKind>
) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/modifyPreciousMetalKind`,
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 贵金属 信息 ------------------------------ */
export interface PreciousMetalItem {
  informationSystemId: number;
  marketId: number;
  securityCode: string;
  securityName: string;
  securityType: number;
  tradeCurrencyCode: string;
  prcsMetalKindCode: string;
  tradeUnitType: number;
  tradeUnitAmount: string;
  minimumReportAmount: number;
  maximumReportAmount: number;
  deliveryMethod: number;
  settleMethod: number;
  listDate: string;
  delistDate: string;
  tradeStatus: number;
  previousClosePrice: number;
  uplimitedPrice: number;
  previousSettlePrice: number;
  downlimitedPrice: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
}

// 贵金属品种信息查询
export const queryPreciousMetal = (
  params: RequestParameterPagination & {
    filterCondition: {
      marketId?: number[];
      prcsMetalKindCode?: string[];
      securityCode?: string;
      fuzzyQueryFlag: number; // 1:模糊查询;0:精确查询
      informationSystemId?: number;
    };
  }
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: PreciousMetalItem[] }
    >
  >('/aegis/api/info/queryPreciousMetal', {
    method: 'POST',
    data: params,
  });

// 导出贵金属信息
export const exportPreciousMetal = (data: {
  marketId?: number[];
  prcsMetalKindCode?: string[];
  securityCode?: string;
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/exportPreciousMetal`,
    {
      method: 'POST',
      data,
    }
  );

export type ReqAlterPreciousMetal = PreciousMetalItem & {
  modifyType: number;
  operatorCode: string;
};

// 设置债券信息
export const alterPreciousMetal = (data: DeepPartial<ReqAlterPreciousMetal>) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/modifyPreciousMetal`,
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 回购 ------------------------------ */
export interface RepoItem {
  informationSystemId: number;
  marketId: number;
  securityCode: string;
  securityName: string;
  securityType: number;
  tradeCurrencyCode: string;
  tradeUnitType: number;
  tradeUnitAmount: string;
  previousClosePrice: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
}

export const queryRepoInfo = (
  params: RequestParameterPagination & {
    filterCondition: {
      marketId?: number[];
      securityCode?: string;
      fuzzyQueryFlag: number; // 1:模糊查询;0:精确查询
      informationSystemId?: number;
    };
  }
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: RepoItem[] }
    >
  >('/aegis/api/info/queryRepoInfo', {
    method: 'POST',
    data: params,
  });

export const exportRepoInfo = (data: {
  securityCode?: string;
  marketId?: number[];
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/exportRepoInfo`,
    {
      method: 'POST',
      data,
    }
  );

export type ReqAlterRepoInfo = RepoItem & {
  modifyType: number;
  operatorCode: string;
};

export const alterRepoInfo = (data: DeepPartial<ReqAlterRepoInfo>) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/modifyRepoInfo`,
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 基金 ------------------------------ */
export interface FundItem {
  informationSystemId: number;
  marketId: number;
  securityCode: string;
  securityName: string;
  securityType: number;
  tradeCurrencyCode: string;
  tradeUnitType: number;
  tradeUnitAmount: string;
  fundShare: number;
  totalAmount: number;
  issueTotalAmount: number;
  fundInvestClass: string;
  fundIssueType: string;
  fundInvestNature: string;
  fundRiskProfitType: number;
  previousNav: number;
  etfReportUnit: number;
  estimateCashBalance: number;
  etfPreBasisNav: number;
  listDate: string;
  delistDate: string;
  issuerOrganizationCode: string;
  previousClosePrice: number;
  uplimitedPrice: number;
  downlimitedPrice: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
  securityRelativeList: SecurityRelaItem[];
  ratingInfo: RatingInfo;
}

export const queryInvestFundInfo = (
  params: RequestParameterPagination & {
    filterCondition: {
      marketId?: number[];
      securityCode?: string;
      securityType?: number;
      querySecurityRatingFlag: string;
      fuzzyQueryFlag: number; // 1:模糊查询;0:精确查询
      informationSystemId?: number;
    };
  }
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: FundItem[] }
    >
  >('/aegis/api/info/queryInvestFundInfo', {
    method: 'POST',
    data: params,
  });

export const exportInvestFundInfo = (data: {
  securityCode?: string;
  marketId?: number[];
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/exportInvestFundInfo`,
    {
      method: 'POST',
      data,
    }
  );

export type ReqAlterInvestFundInfo = FundItem & {
  modifyType: number;
  operatorCode: string;
};

export const alterInvestFundInfo = (
  data: DeepPartial<ReqAlterInvestFundInfo>
) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/modifyInvestFundInfo`,
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- ETF ------------------------------ */
export interface ETFItem {
  informationSystemId: number;
  componentMarketId: number;
  componentSecurityName: string;
  componentSecurityCode: string;
  purchaseReplaceBalance: number;
  redeemReplaceBalance: number;
  cashReplaceFlag: string;
  securityAmount: number;
  etfMarketId: number;
  etfSecurityCode: string;
  etfSecurityName: string;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
}

export const queryEtfComponentStocksDetail = (
  params: RequestParameterPagination & {
    filterCondition: {
      etfMarketId?: number[];
      etfSecurityCode?: string;
      componentMarketId?: number[];
      componentSecurityCode?: string;
      informationSystemId?: number;
    };
  }
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: ETFItem[] }
    >
  >('/aegis/api/info/queryEtfComponentStocksDetail', {
    method: 'POST',
    data: params,
  });

export const exportEtfComponentStocksDetail = (data: {
  etfMarketId?: number[];
  etfSecurityCode?: string;
  componentMarketId?: number[];
  componentSecurityCode?: string;
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/exportEtfComponentStocksDetail`,
    {
      method: 'POST',
      data,
    }
  );

export type ReqAlterEtfComponentStocks = ETFItem & {
  modifyType: number;
  operatorCode: string;
};

export const alterEtfComponentStocksDetail = (
  data: DeepPartial<ReqAlterEtfComponentStocks>
) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/modifyEtfComponentStocksDetail`,
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 指数 ------------------------------ */
export interface IndexItem {
  informationSystemId: number;
  marketId: number;
  securityCode: string;
  securityName: string;
  securityType: number;
  tradeCurrencyCode: string;
  previousClosePrice: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
}

export const queryIndexInfo = (
  params: RequestParameterPagination & {
    filterCondition: {
      marketId?: number[];
      securityCode?: string;
      fuzzyQueryFlag: number; // 1:模糊查询;0:精确查询
      informationSystemId?: number;
    };
  }
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: IndexItem[] }
    >
  >('/aegis/api/info/queryIndexInfo', {
    method: 'POST',
    data: params,
  });

export const exportIndexInfo = (data: {
  marketId?: number[];
  securityCode?: string;
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/exportIndexInfo`,
    {
      method: 'POST',
      data,
    }
  );

export type ReqAlterIndexInfo = IndexItem & {
  modifyType: number;
  operatorCode: string;
};

export const alterIndexInfo = (data: DeepPartial<ReqAlterEtfComponentStocks>) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/modifyIndexInfo`,
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 指数成分股 ------------------------------ */
export interface IngredientItem {
  informationSystemId: number;
  componentMarketId: number;
  securityName: string;
  componentSecurityCode: string;
  indexMarketId: number;
  indexCode: string;
  indexWeight: number;
  tradeCurrencyCode: string;
  previousClosePrice: number;
  createUserCode: string;
  updateUserCode: string;
  createDateTime: string;
  lastUpdateTime: string;
}

export const queryIndexComponentStocksDetail = (
  params: RequestParameterPagination & {
    filterCondition: {
      indexMarketId?: number[];
      indexCode?: string;
      componentMarketId?: number[];
      componentSecurityCode?: string;
      informationSystemId?: number;
    };
  }
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: IndexItem[] }
    >
  >('/aegis/api/info/queryIndexComponentStocksDetail', {
    method: 'POST',
    data: params,
  });

export const exportIndexComponentStocksDetail = (data: {
  indexMarketId?: number[];
  indexCode?: string;
  componentMarketId?: number[];
  componentSecurityCode?: string;
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/exportIndexComponentStocksDetail`,
    {
      method: 'POST',
      data,
    }
  );

export type ReqAlterIndexComponentStocks = IngredientItem & {
  modifyType: number;
  operatorCode: string;
};

export const alterIndexComponentStocksDetail = (
  data: DeepPartial<ReqAlterIndexComponentStocks>
) =>
  request<CommonResponseIWrapper<Recordable>>(
    `/aegis/api/info/modifyIndexComponentStocksDetail`,
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 期货期权 ------------------------------ */

/* ----------------------------- 期货 ------------------------------ */
export interface FutureItem {
  informationSystemId?: number;
  marketId: number;
  securityCode: string;
  securityName?: string;
  securityType: number;
  tradeCurrencyCode: string;
  futuresKindCode?: string;
  contractMonth: number;
  lastDeliveryDate: number;
  contractMutiplier: number;
  preMarketPosiAmount?: number;
  limitOrderAmountMax: number;
  limitOrderAmountMin: number;
  marketOrderAmountMax?: number;
  marketOrderAmountMin?: number;
  listDate?: number;
  lastTradeDate?: number;
  previousClosePrice?: number;
  previousSettlePrice?: number;
  uplimitedPrice?: number;
  downlimitedPrice?: number;
  createUserCode?: string;
  updateUserCode?: string;
  createDateTime?: string;
  lastUpdateTime?: string;
}

export type ReqAlterFutureInfo = FutureItem & {
  modifyType: number;
  operatorCode: string;
};

export const alterFutureInfo = (data: DeepPartial<ReqAlterFutureInfo>) =>
  request<CommonResponseIWrapper<Recordable>>(
    '/aegis/api/info/modifyFutureInfo',
    {
      method: 'POST',
      data,
    }
  );

export type QueryFutureInfoParam = {
  filterCondition?: {
    marketId?: number[];
    futuresKindCode?: string[];
    securityCode?: string;
    fuzzyQueryFlag: number; // 1:模糊查询;0:精确查询
  };
} & RequestParameterPagination;

// 查询期货信息
export const queryFutureInfo = (params: QueryFutureInfoParam) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: FutureItem[] }
    >
  >('/aegis/api/info/queryFutureInfo', {
    method: 'POST',
    data: params,
  });

// 导出期货信息
export const exportFutureInfo = (data: {
  securityCode?: string;
  marketId?: number[];
  futuresKindCode?: string[];
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    '/aegis/api/info/exportFutureInfo',
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 期权 ------------------------------ */

export interface OptionItem {
  informationSystemId?: number;
  marketId: number;
  securityCode: string;
  securityName?: string;
  securityType: number | string;
  tradeCurrencyCode: number | string;
  optionType: number;
  optionKindCode?: string;
  underlyingSecurityCode?: string;
  underlyingMarketId?: number;
  limitOrderAmountMax: number;
  limitOrderAmountMin: number;
  marketOrderAmountMax?: number;
  marketOrderAmountMin?: number;
  exercisePrice?: number;
  exerciseBeginDate?: number;
  exerciseEndDate?: number;
  contractMutiplier: number;
  listDate?: number;
  lastTradeDate?: number;
  previousClosePrice?: number;
  previousSettlePrice?: number;
  uplimitedPrice?: number;
  downlimitedPrice?: number;
  createUserCode?: string;
  updateUserCode?: string;
  createDateTime?: string;
  lastUpdateTime?: string;
}

export type ReqAlterOptionInfo = OptionItem & {
  modifyType: number;
  operatorCode: string;
};

export type QueryOptionInfoParam = {
  filterCondition?: {
    marketId?: number[];
    optionKindCode?: string[];
    securityCode?: string;
    fuzzyQueryFlag: number; // 1:模糊查询;0:精确查询
  };
} & RequestParameterPagination;

/** 查询期权信息 */
export const queryOptionInfo = (params: QueryOptionInfoParam) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: OptionItem[] }
    >
  >('/aegis/api/info/queryOptionInfo', {
    method: 'POST',
    data: params,
  });

/** 设置期权信息 */
export const alterOptionInfo = (data: DeepPartial<ReqAlterOptionInfo>) =>
  request<CommonResponseIWrapper<Recordable>>(
    '/aegis/api/info/modifyOptionInfo',
    {
      method: 'POST',
      data,
    }
  );

export const exportOptionInfo = (data: {
  securityCode?: string;
  marketId?: number[];
  optionKindCode?: string[];
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    '/aegis/api/info/exportOptionInfo',
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 组合单/套利合约 ------------------------------ */

export interface ContractItem {
  informationSystemId?: number;
  marketId: number;
  securityCode: string;
  firstSecurityCode: string;
  secondSecurityCode: string;
  listDate?: number;
  arbitrageType?: number;
  lastTradeDate?: number;
  createUserCode?: string;
  updateUserCode?: string;
  createDateTime?: string;
  lastUpdateTime?: string;
}

export type ReqAlterContract = ContractItem & {
  modifyType: number;
  operatorCode: string;
};

export type QueryContractParam = {
  filterCondition?: {
    marketId?: number[];
    securityCode?: string;
    arbitrageType?: number[];
    firstSecurityCode?: string;
    secondSecurityCode?: string;
    fuzzyQueryFlag: number; // 1:模糊查询;0:精确查询
  };
} & RequestParameterPagination;

/** 查询组合单/套利合约 */
export const queryContract = (params: QueryContractParam) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: ContractItem[] }
    >
  >('/aegis/api/info/queryContract', {
    method: 'POST',
    data: params,
  });

/** 设置组合单/套利合约 */
export const alterContract = (data: DeepPartial<ReqAlterContract>) =>
  request<CommonResponseIWrapper<Recordable>>(
    '/aegis/api/info/modifyContract',
    {
      method: 'POST',
      data,
    }
  );

export const exportContract = (data: {
  securityCode?: string;
  marketId?: number[];
  arbitrageType?: number[];
  firstSecurityCode?: string;
  secondSecurityCode?: string;
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    '/aegis/api/info/exportContract',
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 期货品种 ------------------------------ */

export interface FutureKindItem {
  informationSystemId?: number;
  marketId: number;
  futuresKindCode: string;
  futuresKindName?: string;
  deliveryMethod?: number;
  createUserCode?: string;
  updateUserCode?: string;
  createDateTime?: string;
  lastUpdateTime?: string;
}

export type ReqAlterFutureKind = FutureKindItem & {
  modifyType: number;
  operatorCode: string;
};

export type QueryFutureKindParam = {
  filterCondition?: {
    marketId?: number[];
    futuresKindCode?: string[];
  };
} & RequestParameterPagination;

/** 查询期货品种 */
export const queryFutureKindInfo = (params: QueryFutureKindParam) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: FutureKindItem[] }
    >
  >('/aegis/api/info/queryFutureKind', {
    method: 'POST',
    data: params,
  });

/** 设置期货品种 */
export const alterFutureKind = (data: DeepPartial<ReqAlterFutureKind>) =>
  request<CommonResponseIWrapper<Recordable>>(
    '/aegis/api/info/modifyFutureKind',
    {
      method: 'POST',
      data,
    }
  );

export const exportFutureKind = (data: {
  marketId?: number[];
  futuresKindCode?: string[];
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    '/aegis/api/info/exportFutureKind',
    {
      method: 'POST',
      data,
    }
  );

/* ----------------------------- 期权品种 ------------------------------ */

export interface OptionKindItem {
  informationSystemId?: number;
  marketId: number;
  optionKindCode: string;
  optionKindName?: string;
  underlyingKindCode?: string;
  deliveryMethod?: number;
  createUserCode?: string;
  updateUserCode?: string;
  createDateTime?: string;
  lastUpdateTime?: string;
}

export type ReqAlterOptionKind = OptionKindItem & { modifyType: number };

export type QueryOptionKindParam = {
  filterCondition?: {
    marketId?: number[];
    optionKindCode?: string[];
  };
} & RequestParameterPagination;

/** 查询期权品种 */
export const queryOptionKind = (params: QueryOptionKindParam) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: OptionKindItem[] }
    >
  >('/aegis/api/info/queryOptionKind', {
    method: 'POST',
    data: params,
  });

/** 设置期权品种 */
export const alterOptionKind = (data: DeepPartial<ReqAlterOptionKind>) =>
  request<CommonResponseIWrapper<Recordable>>(
    '/aegis/api/info/modifyOptionKind',
    {
      method: 'POST',
      data,
    }
  );

export const exportOptionKind = (data: {
  marketId?: number[];
  optionKindCode?: string[];
}) =>
  request<CommonResponseIWrapper<Recordable>>(
    '/aegis/api/info/exportOptionKind',
    {
      method: 'POST',
      data,
    }
  );

/* ---------------------------- 外部评级机构 ------------------------------*/
export interface OrganInfoItem {
  informationSystemId: number;
  organizationCode: string;
  organizationName: string;
  organizationTypeList: string;
  socialCreditCode: string;
}

/* 机构信息查询 */
export const queryOrganInfo = (
  params: RequestParameterPagination & {
    filterCondition?: {
      organizationCode?: string;
      organizationName?: string;
      informationSystemId?: number;
    };
  }
) =>
  request<
    CommonResponseIWrapper<
      ResponseParameterPagination & { resultList: OrganInfoItem[] }
    >
  >('/aegis/api/info/queryOrganInfo', {
    method: 'POST',
    data: params,
  });

export interface RatingItem {
  ratingCode: string;
  ratingName: string;
}

/* 等级查询 */
export const queryIssuerRating = () =>
  request<CommonResponseIWrapper<{ resultList: RatingItem[] }>>(
    '/aegis/api/info/queryIssuerRating',
    {
      method: 'POST',
    }
  );

export interface RatingInfo {
  ratingOrganizationCode: string;
  externalRating: string;
  ratingDate: string;
}
