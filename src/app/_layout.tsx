import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

import AuthContextProvider from '@/context/auth-context';
import CartContextProvider from '@/context/cart-context';
import CategoriesContextProvider from '@/context/categories-context';
import RecipesContextProvider from '@/context/recipes-context';
import UnitsContextProvider from '@/context/units-context';

const RootLayout = () => {
  return (
    <AuthContextProvider>
      <UnitsContextProvider>
        <CategoriesContextProvider>
          <RecipesContextProvider>
            <CartContextProvider>
              <ThemeProvider value={DefaultTheme}>
                <Stack>
                  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                  <Stack.Screen name="+not-found" />
                </Stack>
              </ThemeProvider>
            </CartContextProvider>
          </RecipesContextProvider>
        </CategoriesContextProvider>
      </UnitsContextProvider>
    </AuthContextProvider>
  );
};

export default RootLayout;
