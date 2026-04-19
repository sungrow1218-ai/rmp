import type { ImmerReducer, Effect } from '@oula/oula';
import {
  QuerySecuPoolRspDto,
  SecurityPoolResponseDTO,
} from '@/pages/securityPool/contants/tyeping';

export type SecuPoolModelState = {
  secuPoolLayerList: SecurityPoolResponseDTO[];
  secuPoolList: QuerySecuPoolRspDto[];
};

export type SecuPoolModelModelType = {
  namespace: 'securityPool';
  state: SecuPoolModelState;
  effects: Record<string, Effect>;
  reducers: {
    geSecuPoolList: ImmerReducer<SecuPoolModelState>;
    geSecuPoolLayerList: ImmerReducer<SecuPoolModelState>;
  };
};

const SecuPoolModel: SecuPoolModelModelType = {
  namespace: 'securityPool',
  state: {
    secuPoolLayerList: [],
    secuPoolList: [],
  },

  effects: {},

  reducers: {
    geSecuPoolLayerList(state, { payload }) {
      return {
        ...state,
        secuPoolLayerList: payload,
      };
    },
    geSecuPoolList(state, { payload }) {
      return {
        ...state,
        secuPoolList: payload,
      };
    },
  },
};

export default SecuPoolModel;
