import { Tabs } from 'expo-router';
import { ChartBar as BarChart3, TrendingUp, Settings, Home } from 'lucide-react-native';
import { useSettings } from '@/contexts/SettingsContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleDashed, House,Settings2 ,Activity} from 'lucide-react-native';

export default function TabLayout() {
  const { colors, t } = useSettings();

  return (
    <SafeAreaView style={{ flex: 1,  backgroundColor:colors.background, height:"100%" }} edges={['right', 'bottom', 'left']}> 
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.background,
          borderTopWidth: 0,
         
         
          width:"90%",
          paddingTop:5,
          bottom: 20,
          height: 70,
          borderRadius: 60,
          alignSelf: 'center',
          alignItems:"center",
          justifyContent:"center"
        },      
      }}>
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: t('home'),   // fixes the tab label
          headerTitle: t('home'),
          tabBarIcon: ({ size, color }) => (
            <House size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stats"
        options={{
          title: t('stats'),
          tabBarIcon: ({ size, color }) => (
            <Activity size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ size, color }) => (
            <Settings2 size={size} color={color} />
          ),
        }}
      />

    </Tabs>
    </SafeAreaView>
  );
}