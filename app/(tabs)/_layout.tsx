import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import UnitsContextProvider from '@/contexts/units-context';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <UnitsContextProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: 'Explore',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'code-slash' : 'code-slash-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </UnitsContextProvider>
  );
}
