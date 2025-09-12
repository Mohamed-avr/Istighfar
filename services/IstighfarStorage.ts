import AsyncStorage from '@react-native-async-storage/async-storage';
import { format, startOfYear, endOfYear } from 'date-fns';

export interface IstighfarEntry {
  date: string; // YYYY-MM-DD format
  count: number;
}

const STORAGE_KEY = 'istighfar_data';

export class IstighfarStorage {
  static async getTodayCount(): Promise<number> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const data = await this.getAllData();
      const todayEntry = data.find(entry => entry.date === today);
      return todayEntry?.count || 0;
    } catch (error) {
      console.error('Error getting today count:', error);
      return 0;
    }
  }

  static async saveTodayCount(count: number): Promise<void> {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const data = await this.getAllData();
      
      // Find existing entry or create new one
      const existingIndex = data.findIndex(entry => entry.date === today);
      
      if (existingIndex >= 0) {
        data[existingIndex].count = count;
      } else {
        data.push({ date: today, count });
      }

      // Sort by date (newest first)
      data.sort((a, b) => b.date.localeCompare(a.date));
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving today count:', error);
    }
  }

  static async getAllData(): Promise<IstighfarEntry[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting all data:', error);
      return [];
    }
  }

  static async getDataForPeriod(startDate: Date, endDate: Date): Promise<IstighfarEntry[]> {
    try {
      const data = await this.getAllData();
      const startStr = format(startDate, 'yyyy-MM-dd');
      const endStr = format(endDate, 'yyyy-MM-dd');
      
      return data.filter(entry => 
        entry.date >= startStr && entry.date <= endStr
      );
    } catch (error) {
      console.error('Error getting period data:', error);
      return [];
    }
  }

  static async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  }
}