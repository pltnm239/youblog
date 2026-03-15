import React, {memo, useEffect, useState} from 'react';

import AppRoot from '../../app';
import {HostProvider} from '../../api/host-context';
import type {HostAPI} from '../../api/host';

const AppComponent: React.FunctionComponent = () => {
  const [host, setHost] = useState<HostAPI | null>(null);

  useEffect(() => {
    YTApp.register().then((registeredHost) => {
      setHost(registeredHost as HostAPI);
    });
  }, []);

  if (!host) {
    return null;
  }

  return (
    <HostProvider value={host}>
      <AppRoot />
    </HostProvider>
  );
};

export const App = memo(AppComponent);
