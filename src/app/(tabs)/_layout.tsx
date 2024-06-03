import React from 'react';

import { Tabs } from 'expo-router';

import TabBarIcon from '@/element/tab-bar-icon';

import UnitsContextProvider from '@/context/units-context';

import { Colors } from '@/constant/Colors';

const TabLayout = () => {
  return (
    <UnitsContextProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors['light'].tint,
          headerShown: false,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Accueil',
            tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />,
          }}
        />

        <Tabs.Screen
          name="recipes"
          options={{
            title: 'Recettes',
            tabBarIcon: ({ color, focused }) => <TabBarIcon name={focused ? 'book' : 'book-outline'} color={color} />,
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Paramètres',
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon name={focused ? 'settings' : 'settings-outline'} color={color} />
            ),
          }}
        />
      </Tabs>
    </UnitsContextProvider>
  );
};

export default TabLayout;
