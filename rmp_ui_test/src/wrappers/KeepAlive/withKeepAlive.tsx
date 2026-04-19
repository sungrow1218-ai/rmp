import React, { type ComponentType } from 'react';
import { KeepAlive } from 'react-activation';

const withKeepAlive =
  (config: { cacheKey: string }) => (EntryComponent: ComponentType) => {
    const ComponentWithKeepAliveWrapper = (props: any) => {
      const { cacheKey } = config;
      return (
        <KeepAlive
          name={cacheKey}
          autoFreeze={false}
          wrapperProps={{ style: { width: '100%', height: '100%' } }}
          contentProps={{ style: { width: '100%', height: '100%' } }}
        >
          <EntryComponent {...props} />
        </KeepAlive>
      );
    };
    return ComponentWithKeepAliveWrapper;
  };

export default withKeepAlive;
