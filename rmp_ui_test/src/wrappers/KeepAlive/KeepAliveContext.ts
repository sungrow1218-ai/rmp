import { createContext, type MutableRefObject } from 'react';
import { type CachingNode } from 'react-activation';

interface KeepAliveContextType {
  cachedNodes: MutableRefObject<CachingNode[]>;
}

// @ts-expect-error
const KeepAliveContext = createContext<KeepAliveContextType>({});

export default KeepAliveContext;
