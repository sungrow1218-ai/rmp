import { DictFeKeyEnumType } from '@/utils/dict';

export interface SeatGroupParams {
  seatGroupId?: number;
  seatGroupName?: string;
  marketId?: number;
}

export interface SeatGroupState extends SeatGroupParams {
  remark: string;
  workGroupId: number;
  createUserNo: string;
  updateUserNo: string;
  createDateTime: string;
  lastUpdateTime: string;
  createRoleId: number;
}
export interface SeatGroupFormState {
  workGroupId?: number;
  seatGroupId?: number;
  seatGroupName?: string;
  marketId?: number;
  remark?: string;
}
export interface AlterSeatGroupParams extends SeatGroupFormState {
  alterType?: number;
}
export interface AddProps {
  mode: DictFeKeyEnumType['OPERATION_TYPES'];
  formType: string;
  defaultValues?: SeatGroupFormState;
  isDetail?: boolean;
  onClose: () => void;
}

export interface SeatGroupDetailParams {
  seatCode?: string;
  seatName?: string;
  marketId?: number;
  extSysId?: number;
  key?: string;
}
export interface AlterSeatDetailParams {
  seatCode?: string;
  seatName?: string;
  marketId?: number[];
  extSysId?: number;
  key?: string;
}
export interface SeatGroupSateProps {
  seatCode: string;
  seatName: string;
  marketId: number;
  extSysId: number;
}
export interface SeatGroupDetailState extends SeatGroupDetailParams {
  createUserNo: string;
  updateUserNo: string;
  createDatTime: string;
  lastUpdateTime: string;
  extSysName?: string;
}
export interface AlterSeatGroupDetailParams {
  alterType: number;
  seatGroupId: number;
  poolSecurityList: SeatGroupDetailParams[];
}

export interface SeatDetailFormProps {
  mode: 'ADD' | 'EDIT';
  formType: string;
  isDetail?: boolean;
  onClose: () => void;
}
