import React, { createContext, useState, useEffect } from 'react';
import { getLearnedWordNumber } from './Database';

export const GlobalContext = createContext();
export const Context = ({ children }) => {
    const [streakCount, setStreakCount] = useState(0);
    const [wordCount, setWordCount] = useState(0)

  return (
      <GlobalContext.Provider value={{ streakCount, wordCount, setStreakCount, setWordCount }}>
          {children}
      </GlobalContext.Provider>
  );
};