import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

import AuthContextProvider from '@/context/auth-context';
import CartContextProvider from '@/context/cart-context';
import CategoriesContextProvider from '@/context/categories-context';

const RootLayout = () => {
  return (
    <AuthContextProvider>
      <CategoriesContextProvider>
        <CartContextProvider>
          <ThemeProvider value={DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </ThemeProvider>
        </CartContextProvider>
      </CategoriesContextProvider>
    </AuthContextProvider>
  );
};

export default RootLayout;
