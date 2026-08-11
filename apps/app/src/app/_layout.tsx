import '@/global.css';

import { useEffect } from 'react';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Petrona_500Medium, Petrona_500Medium_Italic } from '@expo-google-fonts/petrona';
import {
  AlbertSans_400Regular,
  AlbertSans_600SemiBold,
  AlbertSans_700Bold,
} from '@expo-google-fonts/albert-sans';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // RN gotcha: italic is a SEPARATE family (Petrona_500Medium_Italic) — loaded
  // alongside the upright 500 so the hero <em> can map to it. Same story for
  // the sans weights (semibold / bold are their own families).
  const [loaded] = useFonts({
    Petrona_500Medium,
    Petrona_500Medium_Italic,
    AlbertSans_400Regular,
    AlbertSans_600SemiBold,
    AlbertSans_700Bold,
  });

  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#faf6f0' } }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
