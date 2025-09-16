import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark' | 'islamic';

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  text: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  error: string;
}

const themes: Record<Theme, ThemeColors> = {
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    primary: '#22C55E',
    secondary: '#16A34A',
    text: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  dark: {
    background: '#060606',
    surface: '#171717',
    primary: '#22C55E',
    secondary: '#16A34A',
    text: '#DCDCDC',
    textSecondary: '#A5A5A5',
    border: '#333',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
  },
  islamic: {
    background: '#FDF6EC',   // light cream (bright, high contrast base)
    surface: '#FFFFFF',      // pure white for cards / elevated areas
    primary: '#7B341E',      // rich dark brown (strong accent)
    secondary: '#B45309',    // warm amber-brown for secondary highlights
    text: '#3F1D0B',         // very dark brown (almost black) for readability
    textSecondary: '#5C2E0E',// medium-dark brown for secondary text
    border: '#E6D3B3',       // light sand beige for clear separation
    success: '#15803D',      // Islamic green (contrast with browns)
    warning: '#C2410C',      // strong burnt orange (alert, high visibility)
    error: '#991B1B',        // deep red (error, easy to notice)
  }
};

const translations = {
  en: {
    home: 'Home',
    counter: 'Counter',
    stats: 'Stats',
    settings: 'Settings',
    todayIstighfar: "Today's Istighfar",
    thisMonth: 'This Month',
    thisYear: 'This Year',
    totalThisMonth: 'total this month',
    totalThisYear: 'total this year',
    count: 'Count',
    resetToday: 'Reset Today',
    istighfarDashboard: 'Istighfar Dashboard',
    keepGoing: 'Keep Going!',
    motivationText: 'Every istighfar brings you closer to Allah\'s mercy and forgiveness. Consistency is key to spiritual growth.',
    quoteText: '"And seek forgiveness of Allah. Indeed, Allah is Forgiving and Merciful."',
    quoteReference: '- Quran 4:106',
    statistics: 'Statistics',
    yourJourney: 'Your Istighfar Journey',
    language: 'Language',
    theme: 'Theme',
    english: 'English',
    arabic: 'العربية',
    lightTheme: 'Light',
    darkTheme: 'Dark',
    islamicTheme: 'Islamic Green',
    monthsProgress: "This Month's Progress",
    dailyGoal: 'Daily Goal',
    dailyGoalText: 'Try to reach 1000 istighfar daily to unlock the green progress indicator!',
  },
  ar: {
    home: 'الرئيسية',
    counter: 'عداد',
    stats: 'الإحصائيات',
    settings: 'الإعدادات',
    todayIstighfar: 'استغفار اليوم',
    thisMonth: 'هذا الشهر',
    thisYear: 'هذا العام',
    totalThisMonth: 'المجموع هذا الشهر',
    totalThisYear: 'المجموع هذا العام',
    count: 'عد',
    resetToday: 'إعادة تعيين اليوم',
    istighfarDashboard: 'لوحة الاستغفار',
    keepGoing: 'استمر!',
    motivationText: 'كل استغفار يقربك من رحمة الله ومغفرته. الاستمرارية هي مفتاح النمو الروحي.',
    quoteText: '"واستغفروا الله إن الله غفور رحيم"',
    quoteReference: '- القرآن 4:106',
    statistics: 'الإحصائيات',
    yourJourney: 'رحلة الاستغفار',
    language: 'اللغة',
    theme: 'المظهر',
    english: 'English',
    arabic: 'العربية',
    lightTheme: 'فاتح',
    darkTheme: 'داكن',
    islamicTheme: 'أخضر إسلامي',
    monthsProgress: 'تقدم هذا الشهر',
    dailyGoal: 'الهدف اليومي',
    dailyGoalText: 'حاول الوصول إلى 1000 استغفار يومياً لفتح مؤشر التقدم الأخضر!',
  },
};

interface SettingsContextType {
  language: Language;
  theme: Theme;
  colors: ThemeColors;
  t: (key: keyof typeof translations.en) => string;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('dark');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      const savedTheme = await AsyncStorage.getItem('app_theme');
      
      if (savedLanguage) {
        setLanguageState(savedLanguage as Language);
      }
      if (savedTheme) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    await AsyncStorage.setItem('app_language', newLanguage);
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('app_theme', newTheme);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key];
  };

  const colors = themes[theme];

  return (
    <SettingsContext.Provider value={{
      language,
      theme,
      colors,
      t,
      setLanguage,
      setTheme,
    }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}