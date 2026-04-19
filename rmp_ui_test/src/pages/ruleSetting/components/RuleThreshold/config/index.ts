import Z01201, { thresholdConditions as tZ01201 } from './Z01201';
import Z01202, { thresholdConditions as tZ01202 } from './Z01202';
import Z01301, {
  thresholdConditions as tZ01301,
  preConditions as pZ01301,
} from './Z01301';
import Z01101, {
  thresholdConditions as tZ01101,
  preConditions as pZ01101,
} from './Z01101';
import Z01102, {
  thresholdConditions as tZ01102,
  preConditions as pZ01102,
} from './Z01102';
import Z01302, {
  thresholdConditions as tZ01302,
  preConditions as pZ01302,
} from './Z01302';
import Z05201, { thresholdConditions as tZ05201 } from './Z05201';
import Z05301, { thresholdConditions as tZ05301 } from './Z05301';
import Z06001, { thresholdConditions as tZ06001 } from './Z06001';
import Z06002, { thresholdConditions as tZ06002 } from './Z06002';
import Z06003, { thresholdConditions as tZ06003 } from './Z06003';
import J3, { thresholdConditions as tJ3 } from './J3';
import Z06004, {
  thresholdConditions as tZ06004,
  preConditions as pZ06004,
} from './Z06004';
import Z06005, { thresholdConditions as tZ06005 } from './Z06005';
import Z06006, { thresholdConditions as tZ06006 } from './Z06006';
import Z06202, { thresholdConditions as tZ06202 } from './Z06202';
import Z06101, { thresholdConditions as tZ06101 } from './Z06101';
import Z06102, { thresholdConditions as tZ06102 } from './Z06102';
import Z07201, { thresholdConditions as tZ07201 } from './Z07201';
import J4, { thresholdConditions as tJ4 } from './J4';
import Z07301, {
  thresholdConditions as tZ07301,
  preConditions as pZ07301,
} from './Z07301';
import Z03000, { thresholdConditions as tZ03000 } from './Z03000';
import Z03101, { thresholdConditions as tZ03101 } from './Z03101';
import Z03201, {
  thresholdConditions as tZ03201,
  preConditions as pZ03201,
} from './Z03201';
import Z03202, {
  thresholdConditions as tZ03202,
  preConditions as pZ03202,
} from './Z03202';
import Z03203, {
  thresholdConditions as tZ03203,
  preConditions as pZ03203,
} from './Z03203';
import O01, { thresholdConditions as tO01, preConditions as pO01 } from './O01';

export const allThresholdConditions = {
  Z01201: tZ01201,
  Z01202: tZ01202,
  Z01301: tZ01301,
  Z01101: tZ01101,
  Z01102: tZ01102,
  Z01302: tZ01302,
  Z03000: tZ03000,
  Z03101: tZ03101,
  Z03201: tZ03201,
  Z03202: tZ03202,
  Z03203: tZ03203,
  Z05201: tZ05201,
  Z05301: tZ05301,
  Z06001: tZ06001,
  Z06002: tZ06002,
  Z06003: tZ06003,
  Z06004: tZ06004,
  Z06005: tZ06005,
  Z06006: tZ06006,
  Z06101: tZ06101,
  Z06102: tZ06102,
  Z06202: tZ06202,
  Z07201: tZ07201,
  J4: tJ4,
  J3: tJ3,
  Z07301: tZ07301,
  O01: tO01,
};

export const allPreConditions = {
  Z01101: pZ01101,
  Z01102: pZ01102,
  Z01302: pZ01302,
  Z01301: pZ01301,
  Z03201: pZ03201,
  Z03202: pZ03202,
  Z03203: pZ03203,
  Z06004: pZ06004,
  Z07301: pZ07301,
  O01: pO01,
};

const fullConfig = {
  Z01201,
  Z01202,
  Z01101,
  Z01102,
  Z01301,
  Z01302,
  Z03000,
  Z03101,
  Z03201,
  Z03202,
  Z03203,
  Z05201,
  Z05301,
  Z06001,
  Z06002,
  Z06003,
  J3,
  Z06004,
  Z06005,
  Z06006,
  Z06202,
  Z06101,
  Z06102,
  Z07201,
  J4,
  Z07301,
  O01,
};

export default fullConfig;
