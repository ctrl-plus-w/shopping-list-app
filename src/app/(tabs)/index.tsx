import { useMemo, useRef, useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Text } from '@rneui/themed';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import CreateUpdateIngredientModal from '@/modal/create-update-ingredient-modal';

import CartIngredient from '@/element/cart-ingredient';

import { useCart } from '@/context/cart-context';

import { compareIngredientName } from '@/util/array';

import { TCartIngredient } from '@/type/database';

const HomeScreen = () => {
  const { ingredients } = useCart();

  const [updatingIngredient, setUpdatingIngredient] = useState<TCartIngredient | undefined>(undefined);

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
        {} as Record<string, TCartIngredient[]>,
      ),
    [ingredients],
  );

  const openUpdateIngredientModal = (ingredient: TCartIngredient) => () => {
    setUpdatingIngredient(ingredient);
    createUpdateBottomSheetModalRef.current?.present();
  };

  return (
    <CreateUpdateIngredientModal ingredient={updatingIngredient} ref={createUpdateBottomSheetModalRef}>
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
              {noCategoryIngredients.sort(compareIngredientName).map((ingredient) => (
                <CartIngredient
                  ingredient={ingredient}
                  onPress={openUpdateIngredientModal(ingredient)}
                  key={ingredient.id}
                />
              ))}
            </View>
          ) : (
            <></>
          )}

          {Object.keys(groupedIngredients)
            .sort()
            .map((category) => (
              <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }} key={category}>
                <Text h4>{category}</Text>

                {groupedIngredients[category].sort(compareIngredientName).map((ingredient) => (
                  <CartIngredient
                    ingredient={ingredient}
                    onPress={openUpdateIngredientModal(ingredient)}
                    key={ingredient.id}
                  />
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
