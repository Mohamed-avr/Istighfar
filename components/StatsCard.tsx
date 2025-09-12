import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSettings } from '@/contexts/SettingsContext';

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}

export function StatsCard({ icon, title, value, subtitle, color }: StatsCardProps) {
  const { colors } = useSettings();
  const styles = createStyles(colors);

  return (
    <View style={[styles.card, { flex: 1 }]}>
      <View style={styles.iconContainer}>
        {icon}
      </View>
     <View style={styles.cardStatsContainer}>
     <Text style={styles.title}>{title}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
     </View>
    </View>
  );
}

function createStyles(colors: any) {
  return StyleSheet.create({
    
    card: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
   width: '100%', 
   flexDirection: 'row',
     
    
    },
    iconContainer: {
      marginBottom: 8,
      padding: 10,
      backgroundColor: colors.background,
      borderRadius: 100,
    }, 

    cardStatsContainer :{
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginLeft: 10,
    marginRight: 10,
    }, 
    title: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    value: {
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 2,
    },
    subtitle: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });
}