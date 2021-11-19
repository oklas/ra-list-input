import * as React from 'react';

export const App: React.FC<any> = (props: any) => {
  return <>{props.constructor.name}</>;
};
