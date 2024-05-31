import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

import AuthContextProvider from '@/context/auth-context';
import CartContextProvider from '@/context/cart-context';

const RootLayout = () => {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <ThemeProvider value={DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ThemeProvider>
      </CartContextProvider>
    </AuthContextProvider>
  );
};

export default RootLayout;
