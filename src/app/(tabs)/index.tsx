import { useMemo, useRef } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Text } from '@rneui/themed';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import CreateUpdateIngredientModal from '@/modal/create-update-ingredient-modal';

import { useCart } from '@/context/cart-context';

import { CartIngredient } from '@/type/database';

const HomeScreen = () => {
  const { ingredients } = useCart();

  const createUpdateBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const noCategoryIngredients = useMemo(() => ingredients.filter(({ category }) => !category), [ingredients]);

  const groupedIngredients = useMemo(
    () =>
      ingredients.reduce(
        (acc, curr) => {
          const category = curr.category;

          if (!category) return acc;

          if (category in acc) acc[category] = [...acc[category], curr];
          else acc[category] = [curr];

          return acc;
        },
        {} as Record<string, CartIngredient[]>,
      ),
    [ingredients],
  );

  return (
    <CreateUpdateIngredientModal ref={createUpdateBottomSheetModalRef}>
      <SafeAreaView style={styles.safeArea}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text h2>Ingrédients</Text>

          <TouchableOpacity onPress={() => createUpdateBottomSheetModalRef?.current?.present()}>
            <Ionicons name="add" size={32} />
          </TouchableOpacity>
        </View>

        <View style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {noCategoryIngredients.length ? (
            <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {noCategoryIngredients.map(({ id, name, unit, quantity }) => (
                <View key={id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Text>{name}</Text>
                  <Text style={{ color: '#666' }}>
                    {quantity} {unit?.singular}
                  </Text>
                </View>
              ))}
            </View>
          ) : (
            <></>
          )}

          {Object.keys(groupedIngredients).map((category) => (
            <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }} key={category}>
              <Text h4>{category}</Text>

              {groupedIngredients[category].map(({ id, name, quantity, unit }) => (
                <View key={id} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <Text>{name}</Text>
                  <Text style={{ color: '#666' }}>
                    {quantity} {unit?.singular}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      </SafeAreaView>
    </CreateUpdateIngredientModal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    margin: 32,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 8,
  },
});

export default HomeScreen;
