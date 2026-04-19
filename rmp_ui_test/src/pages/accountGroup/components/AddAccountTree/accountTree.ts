export type TraderAccountTreeQuery = {
  pageId: number;
  pageSize: number;
  filterCondition: {
    // sobId: string | number | undefined;
    // bookLevel: any;
    acctName: string;
    acctCode: string;
    extSysId?: (number | string)[];
    marketId?: (number | string)[];
  };
};

export type ManageAccountTreeQuery = {
  pageId: number;
  pageSize: number;
  filterCondition: {
    // sobId: string | number | undefined;
    bookLevel: any;
    acctName?: string;
    acctCode?: string;
    extSysId?: (number | string)[];
    // marketId?: (number | string)[];
  };
};

export type AccountTreeItem = {
  acctCode: string;
  acctName: string;
  marketId: number | string;
  extSysId: number | string;
  bookLevel: number;
  parentAcctCode: string;
};

/** 模拟查询账户树数据 */
export async function queryManageAccounts(
  _params: ManageAccountTreeQuery
): Promise<{ code: number; data: { resultList: AccountTreeItem[] } }> {
  const resultList: AccountTreeItem[] = [
    // ---------------- G001 ----------------
    {
      acctCode: 'G001',
      acctName: '产品-G001',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 3,
      parentAcctCode: '',
    },
    {
      acctCode: 'A001',
      acctName: '单元-A001',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 2,
      parentAcctCode: 'G001',
    },
    {
      acctCode: 'A002',
      acctName: '单元-A002',
      marketId: 1,
      extSysId: 20000021,
      bookLevel: 2,
      parentAcctCode: 'G001',
    },
    {
      acctCode: 'A003',
      acctName: '单元-A003',
      marketId: 1,
      extSysId: 20000023,
      bookLevel: 2,
      parentAcctCode: 'G001',
    },
    {
      acctCode: 'A001-01',
      acctName: '组合-A001-01',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'A001',
    },
    {
      acctCode: 'A001-02',
      acctName: '组合-A001-02',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'A001',
    },
    {
      acctCode: 'A001-03',
      acctName: '组合-A001-03',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'A001',
    },
    {
      acctCode: 'A002-01',
      acctName: '组合-A002-01',
      marketId: 1,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: 'A002',
    },
    {
      acctCode: 'A002-02',
      acctName: '组合-A002-02',
      marketId: 1,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: 'A002',
    },
    {
      acctCode: 'A002-03',
      acctName: '组合-A002-03',
      marketId: 1,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: 'A002',
    },
    {
      acctCode: 'A003-01',
      acctName: '组合-A003-01',
      marketId: 1,
      extSysId: 20000023,
      bookLevel: 1,
      parentAcctCode: 'A003',
    },
    {
      acctCode: 'A003-02',
      acctName: '组合-A003-02',
      marketId: 1,
      extSysId: 20000023,
      bookLevel: 1,
      parentAcctCode: 'A003',
    },
    {
      acctCode: 'A003-03',
      acctName: '组合-A003-03',
      marketId: 1,
      extSysId: 20000023,
      bookLevel: 1,
      parentAcctCode: 'A003',
    },

    // ---------------- G002 ----------------
    {
      acctCode: 'G002',
      acctName: '产品-G002',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 3,
      parentAcctCode: '',
    },
    {
      acctCode: 'B001',
      acctName: '单元-B001',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 2,
      parentAcctCode: 'G002',
    },
    {
      acctCode: 'B002',
      acctName: '单元-B002',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 2,
      parentAcctCode: 'G002',
    },
    {
      acctCode: 'B003',
      acctName: '单元-B003',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 2,
      parentAcctCode: 'G002',
    },
    {
      acctCode: 'B001-01',
      acctName: '组合-B001-01',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'B001',
    },
    {
      acctCode: 'B001-02',
      acctName: '组合-B001-02',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'B001',
    },
    {
      acctCode: 'B001-03',
      acctName: '组合-B001-03',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'B001',
    },
    {
      acctCode: 'B002-01',
      acctName: '组合-B002-01',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: 'B002',
    },
    {
      acctCode: 'B002-02',
      acctName: '组合-B002-02',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: 'B002',
    },
    {
      acctCode: 'B002-03',
      acctName: '组合-B002-03',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: 'B002',
    },
    {
      acctCode: 'B003-01',
      acctName: '组合-B003-01',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'B003',
    },
    {
      acctCode: 'B003-02',
      acctName: '组合-B003-02',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'B003',
    },
    {
      acctCode: 'B003-03',
      acctName: '组合-B003-03',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'B003',
    },

    // ---------------- G003 ----------------
    {
      acctCode: 'G003',
      acctName: '产品-G003',
      marketId: 1,
      extSysId: 20000023,
      bookLevel: 3,
      parentAcctCode: '',
    },
    {
      acctCode: 'C001',
      acctName: '单元-C001',
      marketId: 1,
      extSysId: 20000023,
      bookLevel: 2,
      parentAcctCode: 'G003',
    },
    {
      acctCode: 'C002',
      acctName: '单元-C002',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 2,
      parentAcctCode: 'G003',
    },
    {
      acctCode: 'C003',
      acctName: '单元-C003',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 2,
      parentAcctCode: 'G003',
    },
    {
      acctCode: 'C001-01',
      acctName: '组合-C001-01',
      marketId: 1,
      extSysId: 20000023,
      bookLevel: 1,
      parentAcctCode: 'C001',
    },
    {
      acctCode: 'C001-02',
      acctName: '组合-C001-02',
      marketId: 1,
      extSysId: 20000023,
      bookLevel: 1,
      parentAcctCode: 'C001',
    },
    {
      acctCode: 'C001-03',
      acctName: '组合-C001-03',
      marketId: 1,
      extSysId: 20000023,
      bookLevel: 1,
      parentAcctCode: 'C001',
    },
    {
      acctCode: 'C002-01',
      acctName: '组合-C002-01',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'C002',
    },
    {
      acctCode: 'C002-02',
      acctName: '组合-C002-02',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'C002',
    },
    {
      acctCode: 'C002-03',
      acctName: '组合-C002-03',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'C002',
    },
    {
      acctCode: 'C003-01',
      acctName: '组合-C003-01',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'C003',
    },
    {
      acctCode: 'C003-02',
      acctName: '组合-C003-02',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'C003',
    },
    {
      acctCode: 'C003-03',
      acctName: '组合-C003-03',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'C003',
    },

    // ---------------- G004 ----------------
    {
      acctCode: 'G004',
      acctName: '产品-G004',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 3,
      parentAcctCode: '',
    },
    {
      acctCode: 'D001',
      acctName: '单元-D001',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 2,
      parentAcctCode: 'G004',
    },
    {
      acctCode: 'D002',
      acctName: '单元-D002',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 2,
      parentAcctCode: 'G004',
    },
    {
      acctCode: 'D003',
      acctName: '单元-D003',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 2,
      parentAcctCode: 'G004',
    },
    {
      acctCode: 'D001-01',
      acctName: '组合-D001-01',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'D001',
    },
    {
      acctCode: 'D001-02',
      acctName: '组合-D001-02',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'D001',
    },
    {
      acctCode: 'D001-03',
      acctName: '组合-D001-03',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'D001',
    },
    {
      acctCode: 'D002-01',
      acctName: '组合-D002-01',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: 'D002',
    },
    {
      acctCode: 'D002-02',
      acctName: '组合-D002-02',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: 'D002',
    },
    {
      acctCode: 'D002-03',
      acctName: '组合-D002-03',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: 'D002',
    },
    {
      acctCode: 'D003-01',
      acctName: '组合-D003-01',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'D003',
    },
    {
      acctCode: 'D003-02',
      acctName: '组合-D003-02',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'D003',
    },
    {
      acctCode: 'D003-03',
      acctName: '组合-D003-03',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: 'D003',
    },
  ];

  return Promise.resolve({
    code: 0,
    data: { resultList },
  });
}

export async function queryTradeAccounts(
  _params: TraderAccountTreeQuery
): Promise<{ code: number; data: { resultList: AccountTreeItem[] } }> {
  const resultList: AccountTreeItem[] = [
    {
      acctCode: 'T1001',
      acctName: '交易-账户-T1001',
      marketId: 1,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T1002',
      acctName: '交易-账户-T1002',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T1003',
      acctName: '交易-账户-T1003',
      marketId: 1,
      extSysId: 20000023,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T1004',
      acctName: '交易-账户-T1004',
      marketId: 1,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T1005',
      acctName: '交易-账户-T1005',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T1006',
      acctName: '交易-账户-T1006',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: '',
    },

    {
      acctCode: 'T2001',
      acctName: '交易-账户-T2001',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T2002',
      acctName: '交易-账户-T2002',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T2003',
      acctName: '交易-账户-T2003',
      marketId: 2,
      extSysId: 20000023,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T2004',
      acctName: '交易-账户-T2004',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T2005',
      acctName: '交易-账户-T2005',
      marketId: 2,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T2006',
      acctName: '交易-账户-T2006',
      marketId: 2,
      extSysId: 20000023,
      bookLevel: 1,
      parentAcctCode: '',
    },

    {
      acctCode: 'T1101',
      acctName: '交易-账户-T1101',
      marketId: 1,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T1102',
      acctName: '交易-账户-T1102',
      marketId: 1,
      extSysId: 20000022,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T2101',
      acctName: '交易-账户-T2101',
      marketId: 2,
      extSysId: 20000023,
      bookLevel: 1,
      parentAcctCode: '',
    },
    {
      acctCode: 'T2102',
      acctName: '交易-账户-T2102',
      marketId: 2,
      extSysId: 20000021,
      bookLevel: 1,
      parentAcctCode: '',
    },
  ];

  return Promise.resolve({
    code: 0,
    data: { resultList },
  });
}
