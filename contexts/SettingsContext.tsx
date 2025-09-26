import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';


SplashScreen.preventAutoHideAsync();

// ------------------ Types ------------------
export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark' | 'islamic';
export type Direction = 'ltr' | 'rtl';

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

// ------------------ Themes ------------------
const themes: Record<Theme, ThemeColors> = {
  light: {
    background: '#F2F2F2',
    surface: '#FFFFFF',
    primary: '#22C55E',
    secondary: '#16A34A',
    text: '#132932',
    textSecondary: '#A5A6A7',
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
    background: '#FDF6EC',
    surface: '#FFFFFF',
    primary: '#7B341E',
    secondary: '#B45309',
    text: '#3F1D0B',
    textSecondary: '#5C2E0E',
    border: '#E6D3B3',
    success: '#15803D',
    warning: '#C2410C',
    error: '#991B1B',
  }
};

// ------------------ Translations ------------------
const translations = {
  en: {
    welcometoIstighfarApp: 'Welcome to Istighfar App',
    starter:'Start now',
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
    quoteText: '{أَفَلاَ يَتُوبُونَ إِلَى اللّهِ وَيَسْتَغْفِرُونَهُ وَاللّهُ غَفُورٌ رَّحِيمٌ}',
    quoteReference: 'المائدة 74',
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
    dailyAverage:'Daily average',
    lastMonth:'last month',
    dailyGoalText: 'Try to reach 1000 istighfar daily to unlock the green progress indicator!',
  },
  ar: {
    welcometoIstighfarApp: 'مرحبًا بك في تطبيق الاستغفار',
    starter:'إبدأ الان',
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
    quoteText: '{أَفَلاَ يَتُوبُونَ إِلَى اللّهِ وَيَسْتَغْفِرُونَهُ وَاللّهُ غَفُورٌ رَّحِيمٌ}',
    quoteReference: 'المائدة 74',
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
    dailyAverage:'التقريب اليومي',
    lastMonth:'أخر شهر',
    dailyGoalText: 'حاول الوصول إلى 1000 استغفار يومياً لفتح مؤشر التقدم الأخضر!',
  },
};

// ------------------ Context ------------------
interface SettingsContextType {
  language: Language;
  theme: Theme;
  colors: ThemeColors;
  direction: Direction;
  t: (key: keyof typeof translations.en) => string;
  setLanguage: (language: Language) => void;
  setTheme: (theme: Theme) => void;
  setDirection: (direction: Direction) => void;
  // ✅ New
  fontsLoaded: boolean;
  fontArPrimary: string;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// ------------------ Provider ------------------
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('dark');
  const [direction, setDirectionState] = useState<Direction>('ltr');

  useEffect(() => {
    loadSettings();
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    'ReadexPro': require('../assets/fonts/ReadexPro.ttf'),
  });
  useEffect(() => {
    if (fontsLoaded || fontError  ) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);


  const loadSettings = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('app_language');
      const savedTheme = await AsyncStorage.getItem('app_theme');
      const savedDirection = await AsyncStorage.getItem('app_direction');

      if (savedLanguage) {
        setLanguageState(savedLanguage as Language);
        setDirectionState(savedLanguage === 'ar' ? 'rtl' : 'ltr');
      }
      if (savedTheme) {
        setThemeState(savedTheme as Theme);
      }
      if (savedDirection) {
        setDirectionState(savedDirection as Direction);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    await AsyncStorage.setItem('app_language', newLanguage);

    // auto set direction based on language
    if (newLanguage === 'ar') {
      setDirectionState('rtl');
      await AsyncStorage.setItem('app_direction', 'rtl');
    } else {
      setDirectionState('ltr');
      await AsyncStorage.setItem('app_direction', 'ltr');
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await AsyncStorage.setItem('app_theme', newTheme);
  };

  const setDirection = async (newDirection: Direction) => {
    setDirectionState(newDirection);
    await AsyncStorage.setItem('app_direction', newDirection);
  };

  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key];
  };

  const colors = themes[theme];

  if (!fontsLoaded) {
    return null; // or a loading spinner
  } 

  return (
    <SettingsContext.Provider
      value={{
        language,
        theme,
        colors,
        direction,
        t,
        setLanguage,
        setTheme,
        setDirection,
        fontsLoaded: true, 
        fontArPrimary: 'ReadexPro', 
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

// ------------------ Hook ------------------
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
