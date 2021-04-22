import React, { useContext } from 'react';

export const CurrentConversationContext = React.createContext(null);
export function useCurrentConversation() {
  return useContext(CurrentConversationContext);
}
