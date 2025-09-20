import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Calendar, TrendingUp, Award, Target } from 'lucide-react-native';
import { useFocusEffect } from 'expo-router';
import { format, startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } from 'date-fns';
import { IstighfarStorage } from '@/services/IstighfarStorage';
import { useSettings } from '@/contexts/SettingsContext';
import { MonthlyHeatmap } from '@/components/MonthlyHeatmap';
import { StatsCard } from '@/components/StatsCard';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
  const { colors, t, direction, setDirection } = useSettings();

  const [lastMonthTotal, setLastMonthTotal] = useState(0);
  const [averageDaily, setAverageDaily] = useState(0);
  const [heatmapData, setHeatmapData] = useState<{ [key: string]: number }>({});
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [yearlyTotal, setYearlyTotal] = useState(0);


  const loadData = async () => {
    const today = new Date();
    const monthStart = startOfMonth(today);
    const monthEnd = endOfMonth(today);
    const yearStart = startOfYear(today);
    const yearEnd = endOfYear(today);

    // Get current month data
    const monthData = await IstighfarStorage.getDataForPeriod(monthStart, monthEnd);
    const monthTotal = monthData.reduce((sum, entry) => sum + entry.count, 0);
    setMonthlyTotal(monthTotal);

    // Get yearly data
    const yearData = await IstighfarStorage.getDataForPeriod(yearStart, yearEnd);
    const yearTotal = yearData.reduce((sum, entry) => sum + entry.count, 0);
    setYearlyTotal(yearTotal);

    // Get last month data
    const lastMonth = subMonths(today, 1);
    const lastMonthStart = startOfMonth(lastMonth);
    const lastMonthEnd = endOfMonth(lastMonth);
    const lastMonthData = await IstighfarStorage.getDataForPeriod(lastMonthStart, lastMonthEnd);
    const lastMonthTotalValue = lastMonthData.reduce((sum, entry) => sum + entry.count, 0);
    setLastMonthTotal(lastMonthTotalValue);

    // Calculate average daily
    const daysInMonth = monthData.length || 1;
    const avgDaily = Math.round(monthTotal / daysInMonth);
    setAverageDaily(avgDaily);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const styles = createStyles(colors);

  return (
    <ScrollView style={[styles.container,{ direction:direction}]} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('statistics')}</Text>
        <Text style={styles.subtitle}>{t('yourJourney')}</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatsCard
          icon={<Calendar size={24} color={colors.primary} />}
          title={t('thisMonth')}
          value={monthlyTotal.toString()}
          subtitle={t('totalThisMonth')}
          color={colors.primary}
        />
        
        <StatsCard
          icon={<Award size={24} color={colors.warning} />}
          title={t('thisYear')}
          value={yearlyTotal.toString()}
          subtitle={t('totalThisYear')}
          color={colors.warning}
        />

        <StatsCard
          icon={<TrendingUp size={24} color={colors.secondary} />}
          title="Last Month"
          value={lastMonthTotal.toString()}
          subtitle="previous month"
          color={colors.secondary}
        />
        
        <StatsCard
          icon={<Target size={24} color={colors.error} />}
          title="Daily Average"
          value={averageDaily.toString()}
          subtitle="this month"
          color={colors.error}
              />
      </View>

  {/* Monthly Progress */}
  <View style={styles.progressSection}>
        <Text style={styles.sectionTitle}>{t('monthsProgress')}</Text>
        <MonthlyHeatmap data={heatmapData} colors={colors} />
      </View>

      <View style={styles.islamicQuote}>
        <Text style={styles.quoteText}>
          {t('quoteText')}
        </Text>
        <Text style={styles.quoteReference}>{t('quoteReference')}</Text>
      </View>

      <View style={styles.motivationSection}>
        {/* <View style={styles.motivationCard}>
          <Text style={styles.motivationTitle}>{t('keepGoing')}</Text>
          <Text style={styles.motivationText}>
            {t('motivationText')}
          </Text>
        </View> */}

        <View style={styles.reminderCard}>
          <Text style={styles.reminderTitle}>{t('dailyGoal')}</Text>
          <Text style={styles.reminderText}>
            {t('dailyGoalText')}
          </Text>
        </View>
      </View>


   
    

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
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 30,
      backgroundColor: colors.surface,
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    statsGrid: {
      flexDirection: 'column',
      flexWrap: 'wrap',
      paddingHorizontal: 20,
      paddingVertical: 20,
      gap: 12,
    },
    motivationSection: {
      paddingHorizontal: 20,
      paddingBottom: 30,
    },
    motivationCard: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    motivationTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    motivationText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      lineHeight: 20,
    },
    istighfarText: {
      backgroundColor: colors.surface,
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
      marginBottom: 20,
    },
    arabicText: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
    },
    translationText: {
      fontSize: 14,
      color: colors.textSecondary,
      fontStyle: 'italic',
    },
    reminderCard: {
      backgroundColor: colors.warning + '20',
      padding: 20,
      borderRadius: 16,
      borderLeftWidth: 4,
      borderLeftColor: colors.warning,
    },
    reminderTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.warning,
      marginBottom: 8,
    },
    reminderText: {
      fontSize: 14,
      color: colors.warning,
      lineHeight: 20,
    },
    statsContainer: {
      flexDirection: 'row',
      paddingHorizontal: 20,
      paddingBottom: 20,
      gap: 12,
    },
    progressSection: {
      paddingHorizontal: 20,
      paddingVertical: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    islamicQuote: {
      marginHorizontal: 20,
      marginBottom: 30,
      padding: 20,
      backgroundColor: colors.surface,
      borderRadius: 16,
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