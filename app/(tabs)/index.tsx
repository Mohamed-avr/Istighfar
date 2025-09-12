import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Vibration, Pressable } from 'react-native';
import { Calendar, TrendingUp, Award, Plus, RotateCcw } from 'lucide-react-native';
import { Stack, useFocusEffect } from 'expo-router';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { IstighfarStorage } from '@/services/IstighfarStorage';

import { useSettings } from '@/contexts/SettingsContext';


export default function HomeScreen() {
  const { colors, t } = useSettings();
  const [lastMonthTotal, setLastMonthTotal] = useState(0);
  const [todayCount, setTodayCount] = useState(0);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearlyTotal, setYearlyTotal] = useState(0);
  const [heatmapData, setHeatmapData] = useState<{ [key: string]: number }>({});

  
  const loadData = async () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);

    // Get today's count
    const todayCountValue = await IstighfarStorage.getTodayCount();
    setTodayCount(todayCountValue);

    // Get monthly data
    const monthData = await IstighfarStorage.getDataForPeriod(monthStart, monthEnd);
    const monthTotal = monthData.reduce((sum, entry) => sum + entry.count, 0);
    setMonthlyTotal(monthTotal);

    // Get yearly data
    const yearStart = new Date(today.getFullYear(), 0, 1);
    const yearEnd = new Date(today.getFullYear(), 11, 31);
    const yearData = await IstighfarStorage.getDataForPeriod(yearStart, yearEnd);
    const yearTotal = yearData.reduce((sum, entry) => sum + entry.count, 0);
    setYearlyTotal(yearTotal);

    // Prepare monthly heatmap data
    const heatmap: { [key: string]: number } = {};
    monthData.forEach(entry => {
      heatmap[entry.date] = entry.count;
    });
    setHeatmapData(heatmap);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const incrementCount = async () => {
    const newCount = todayCount + 1;
    setTodayCount(newCount);
    
    // Haptic feedback
    Vibration.vibrate(50);
    
    // Save to storage
    await IstighfarStorage.saveTodayCount(newCount);
    
    // Reload data to update stats
    loadData();
  };

  const resetCount = async () => {
    setTodayCount(0);
    await IstighfarStorage.saveTodayCount(0);
    loadData();
  };

  const currentDate = format(new Date(), 'EEEE, MMMM d, yyyy');

  const styles = createStyles(colors);

  return (
     
    <ScrollView style={styles.container}  >
      <Stack.Screen options={{ headerShown: false,
         
       }} />
      <View style={styles.header}>
        {/* <Text style={styles.title}>{t('istighfarDashboard')}</Text> */}
        <Text style={styles.subtitle}>استغفر الله العظيم</Text>
        <Text style={styles.date}>{currentDate}</Text>
      </View>

      {/* Counter Section */}
      <Pressable style={styles.counterSection} onPress={incrementCount}>
        <View style={styles.countDisplay}>
          {todayCount >= 1000 ? ( <Text style={styles.countNumberOver1000}>{todayCount}</Text> ) : ( <Text style={styles.countNumber}>{todayCount}</Text> )}
         
          {/* <Text style={styles.countLabel}>{t('todayIstighfar')}</Text> */}
        </View>


        {/* {todayCount > 0 && (
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={resetCount}
            activeOpacity={0.8}
          >
            <RotateCcw size={16} color="#EF4444" />
            <Text style={styles.resetButtonText}>{t('resetToday')}</Text>
          </TouchableOpacity>
        )} */}


      </Pressable>

    </ScrollView>
 
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingTop: 80,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: colors.background,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 18,
      color: colors.textSecondary,
      fontWeight: '600',
      marginBottom: 8,
    },
    date: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    counterSection: {
      alignItems: 'center',
      paddingVertical: 30,
      backgroundColor: colors.background,
      marginBottom: 20, 
      justifyContent: 'center',
      alignContent: 'center',
     
      position: 'relative',
      height: "100%",
    },
    countDisplay: {
      alignItems: 'center',
      marginBottom: 30,
     
    },
    countNumber: {
      fontSize: 200,
      fontWeight: '500',
      color: colors.text,
    },
    countNumberOver1000: {
      fontSize: 150,
      fontWeight: '500',
      color: colors.text,
    },
    countLabel: {
      fontSize: 16,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    counterButton: {
      backgroundColor: colors.surface,
      width: 200,
      height: 200,
      borderRadius: 100,
      justifyContent: 'center',
      alignItems: 'center',
     borderWidth: 2,
     borderColor: colors.background,
    
      
      marginBottom: 20,
    },
    counterButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
      marginTop: 6,
    },
    resetButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.error + '30',
      gap: 6,
    },
    resetButtonText: {
      color: colors.error,
      fontSize: 14,
      fontWeight: '600',
    },
    
  });
}