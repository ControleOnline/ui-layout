import React, {createContext, useContext, useEffect, useState} from 'react';
import {getStore} from '@store';
const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const {getters, actions} = getStore('theme');
  const {colors} = getters;

  useEffect(() => {
    const fetchColors = async () => {
      const response = await api.fetch('themes-colors.css', {
        responseType: 'text',
      });
      const cssText = await response.text();

      const parsedColors = {};
      const matches = cssText.match(/--[\w-]+:\s*#[0-9a-fA-F]+/g);
      if (matches) {
        matches.forEach(match => {
          const [key, value] = match.split(':');
          const cleanKey = key.replace('--', '').trim();
          parsedColors[cleanKey] = value.trim();
        });
      }
      actions.setColors(parsedColors);
    };

    fetchColors();
  }, []);

  return (
    <ThemeContext.Provider value={{colors}}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
