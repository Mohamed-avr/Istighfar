import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Globe, Palette, Check } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings, Language, Theme } from '@/contexts/SettingsContext';

export default function SettingsScreen() {
  const { language, theme, colors, t, setLanguage, setTheme, direction, fontArPrimary, setDirection } = useSettings();


  const languageOptions: { value: Language; label: string }[] = [
    { value: 'en', label: t('english') },
    { value: 'ar', label: t('arabic') },
  ];

  const themeOptions: { value: Theme; label: string }[] = [
    { value: 'light', label: t('lightTheme') },
    { value: 'dark', label: t('darkTheme') },
    // { value: 'islamic', label: t('islamicTheme') }, Islamic theme option
  ];

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={[styles.container, {
      direction: direction,
    }]} >
      <View style={styles.header}>
        <Text style={[styles.title,
{  fontFamily: direction === 'rtl' ?  fontArPrimary : 'inter'}
         ]}>{t('settings')}</Text>
      </View>

      {/* Language Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, {  fontFamily: direction === 'rtl' ?  fontArPrimary : 'inter'}]}>{t('language')}</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {languageOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                language === option.value && styles.selectedOption
              
              ]}
              onPress={() =>   {
                setDirection(language == 'ar'?'rtl' :'ltr')
                setLanguage(option.value)} }
              activeOpacity={0.7}
            >
              <Text style={[
                styles.optionText,
                language === option.value && styles.selectedOptionText
                , {  fontFamily: direction === 'rtl' ?  fontArPrimary : 'inter'}
              ]}>
                {option.label}
              </Text>
              {language === option.value && (
                <Check size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Theme Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
       
          <Text style={[styles.sectionTitle, {  fontFamily: direction === 'rtl' ?  fontArPrimary : 'inter'}]}>{t('theme')}</Text>
        </View>
        
        <View style={styles.optionsContainer}>
          {themeOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionItem,
                theme === option.value && styles.selectedOption
              ]}
              onPress={() => setTheme(option.value)}
              activeOpacity={0.7}
            >
              <View style={styles.themeOption}>
                {/* <View style={[
                  styles.themePreview,
                  { backgroundColor: getThemePreviewColor(option.value) }
                ]} /> */}
                <Text style={[
                  styles.optionText,
                  theme === option.value && styles.selectedOptionText ,
                  , {  fontFamily: direction === 'rtl' ?  fontArPrimary : 'inter'}
                ]}>
                  {option.label}
                </Text>
              </View>
              {theme === option.value && (
                <Check size={20} color={colors.text} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

   
    </SafeAreaView>
  );
}

function getThemePreviewColor(theme: Theme): string {
  switch (theme) {
    case 'light':
      return '#22C55E';
    case 'dark':
      return '#111';
    case 'islamic':
      return '#059669';
    default:
      return '#22C55E';
  }
}

function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
     direction: colors.dir
     
    },
    header: {
      paddingTop: 40,
      paddingHorizontal: 20,
      paddingBottom: 30,
      backgroundColor: colors.surface,
      alignItems: 'center',
      
     
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
    },
    section: {
      marginHorizontal: 20,
      marginBottom: 24,
      paddingTop:30,
    },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.textSecondary,
      
    },
    optionsContainer: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      overflow: 'hidden',
    },
    optionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 16,
  
    },
    selectedOption: {
      backgroundColor:colors.background + 90,
    },
    optionText: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    selectedOptionText: {
      color: colors.text,
      fontWeight: '600',
    },
    themeOption: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    themePreview: {
      width: 20,
      height: 20,
      borderRadius: 10,
    },
    islamicQuote: {
      marginHorizontal: 20,
      marginBottom: 30,
      padding: 20,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    quoteText: {
      fontSize: 16,
      fontStyle: 'italic',
      color: colors.text,
      lineHeight: 24,
      marginBottom: 8,
    },
    quoteReference: {
      fontSize: 14,
      color: colors.textSecondary,
      fontWeight: '600',
    },
  });
}