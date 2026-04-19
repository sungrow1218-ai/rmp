export interface AlterRoleAccountAuthorityDTO {
  alterRoleId: number;
  addAuthList: AcctAuthItem[];
  deleteAuthList: AcctAuthItem[];
}
export interface AcctAuthItem {
  extSysId: number;
  bookLevel: number;
  bookType: number;
  acctCode: string;
  marketId: number;
}
