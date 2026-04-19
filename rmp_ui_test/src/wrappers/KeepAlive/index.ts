import {
  useActivate,
  useUnactivate,
  useAliveController,
} from 'react-activation';

import withKeepAlive from './withKeepAlive';

import KeepAliveContext from './KeepAliveContext';

export { KeepAliveContext, useActivate, useUnactivate, useAliveController };

export default withKeepAlive;
