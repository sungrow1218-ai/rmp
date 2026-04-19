interface listParams {
  extSysId: number;
  bookLevel: number;
  marketId: number;
  acctCode: number;
}
export interface RuleProps {
  id: number;
  status: number;
  orderSide: number;
  excemptAcct: listParams[];
  opponentAcct: listParams[];
  [key: string]: any;
}
