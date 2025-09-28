import { View, Text, Image  } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import React from 'react'
import { useSettings } from '@/contexts/SettingsContext';
import { Link, router, Stack } from 'expo-router';


export default function index() {
  const { language, theme, colors, t, setLanguage, setTheme, direction, setDirection, fontArPrimary, fontsLoaded } = useSettings();
  
  return (
    <SafeAreaView style={{ flex: 1, padding: 20,  justifyContent: 'center', alignItems: 'center', backgroundColor:colors.background}}>
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:colors.background}}>
    { theme === "light" ?  
     <Image source={require('../assets/logoLight.png')} style={{width:500, height:150, marginBottom:0}} />  :
     <Image source={require('../assets/logoDark.png')} style={{width:500, height:150, marginBottom:0}} />
  }
        <Text style={{
          color:colors.text,
          fontSize:14,
          fontWeight:'400',
          marginTop:-30,
          fontFamily: direction === 'rtl' ?  fontArPrimary : 'inter',
        }}>{t('welcometoIstighfarApp')}</Text>
   </View>

        <Link href="/(tabs)/"  style={{ margin: 35, borderWidth:1,  borderColor:colors.border, paddingVertical: 15, backgroundColor:colors.surface, borderRadius:100, paddingHorizontal:55}} >
        <Text style={{
            color:colors.text,
            fontSize:18,
            fontWeight:'500', 
            fontFamily: direction === 'rtl' ?  fontArPrimary : 'inter',
          }} >{t('starter')} </Text>
        </Link>
   
    </SafeAreaView>
  )
}