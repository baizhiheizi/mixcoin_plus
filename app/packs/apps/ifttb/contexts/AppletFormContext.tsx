import React, { useContext } from 'react';

export const AppletFormContext = React.createContext(null);
export function useAppletForm() {
  return useContext(AppletFormContext);
}
