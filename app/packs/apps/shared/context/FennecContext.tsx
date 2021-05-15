import React, { useContext } from 'react';

export const FennecContext = React.createContext(null);
export function useFennec() {
  return useContext(FennecContext);
}
