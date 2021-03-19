import React, { useContext } from 'react';

export const MixinBotContext = React.createContext(null);
export function useMixinBot() {
  return useContext(MixinBotContext);
}
