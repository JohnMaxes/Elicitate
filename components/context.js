import React, { createContext, useState, useEffect } from 'react';

// KHÔNG ĐƯỢC SET useEffect Ở ĐÂY
// MUỐN KHỞI TẠO FIRST TIME THÌ XÀI SETTER SET NÓ TRONG useEffect CỦA SCREEN CẦN XÀI CONTEXT
export const GlobalContext = createContext();
export const Context = ({ children }) => {
    const [streakCount, setStreakCount] = useState(0);
    const [wordCount, setWordCount] = useState(0);

    return (
        <GlobalContext.Provider value={{ streakCount, wordCount, setStreakCount, setWordCount }}>
            {children}
        </GlobalContext.Provider>
    );
};