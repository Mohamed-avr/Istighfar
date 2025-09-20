import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, getDay, addDays } from 'date-fns';
import { useSettings } from '@/contexts/SettingsContext';

interface MonthlyHeatmapProps {
  data: { [key: string]: number };
  colors: any;
}

export function MonthlyHeatmap({ data, colors }: MonthlyHeatmapProps) {
  const { colors: themeColors } = useSettings();
  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  
  // Get all days in the current month
  const allDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Group days by weeks
  const weeks: Date[][] = [];
  let currentWeek: Date[] = [];
  
  // Add empty cells for the beginning of the first week
  const firstDayOfWeek = getDay(monthStart);
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push(addDays(monthStart, -(firstDayOfWeek - i)));
  }
  
  allDays.forEach(day => {
    currentWeek.push(day);
    
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  });
  
  // Add remaining days to the last week
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push(addDays(currentWeek[currentWeek.length - 1], 1));
    }
    weeks.push(currentWeek);
  }

  const getIntensity = (count: number): string => {
    if (count === 0) return themeColors.border;
    if (count < 100) return themeColors.textSecondary + '20';
    if (count < 300) return themeColors.textSecondary + '40';
    if (count < 500) return themeColors.textSecondary + '60';
    if (count < 750) return themeColors.textSecondary + '80';
    if (count < 1000) return themeColors.textSecondary;
    return themeColors.primary; // Only green when 1000+
  };

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const monthName = format(today, 'MMMM yyyy');

  const styles = createStyles(themeColors);

  return (
    <View style={styles.container}>
      <Text style={styles.monthTitle}>{monthName}</Text>
      
      <View style={styles.calendar}>
        {/* Day labels */}
        <View style={styles.dayLabels}>
          {dayNames.map((day, index) => (
            <Text key={index} style={styles.dayLabel}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.grid}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((day, dayIndex) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const count = data[dateStr] || 0;
                const isCurrentMonth = day >= monthStart && day <= monthEnd;
                const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                
                return (
                  <View
                    key={`${weekIndex}-${dayIndex}`}
                    style={[
                      styles.day,
                      {
                        backgroundColor: isCurrentMonth ? getIntensity(count) : themeColors.border,
                        opacity: isCurrentMonth ? 1 : 0.3,
                        borderWidth: isToday ? 1: 0,
                        borderColor: isToday ? themeColors.primary : 'transparent',
                       
                      },
                    ]}
                  >
                    {isCurrentMonth && (
                      <Text style={[
                        styles.dayNumber,
                        { color: count >= 1000 ? '#FFFFFF' : themeColors.text }
                      ]}>
                        {format(day, 'd')}
                      </Text>
                    )}
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendLabel}>Less</Text>
        <View style={styles.legendColors}>
          {[
            themeColors.border,
            themeColors.textSecondary + '20',
            themeColors.textSecondary + '40',
            themeColors.textSecondary + '60',
            themeColors.textSecondary + '80',
            themeColors.textSecondary,
            themeColors.primary
          ].map((color, index) => (
            <View key={index} style={[styles.legendSquare, { backgroundColor: color }]} />
          ))}
        </View>
        <Text style={styles.legendLabel}>1000+</Text>
      </View>
    </View>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    monthTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 16,
    },
    calendar: {
      alignItems: 'center',
    },
    dayLabels: {
      flexDirection: 'row',
      marginBottom: 8,
      gap: 4,
    },
    dayLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600',
      width: 36,
      textAlign: 'center',
    },
    grid: {
      gap: 4,
    },
    week: {
      flexDirection: 'row',
      gap: 4,
    },
    day: {
      width: 36,
      height: 36,
      borderRadius: 6,
      backgroundColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    dayNumber: {
      fontSize: 12,
      fontWeight: '600',
    },
    legend: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 16,
      gap: 4,
    },
    legendLabel: {
      fontSize: 10,
      color: colors.textSecondary,
    },
    legendColors: {
      flexDirection: 'row',
      gap: 2,
      marginHorizontal: 8,
    },
    legendSquare: {
      width: 12,
      height: 12,
      borderRadius: 2,
    },
  });
}