import { useContext, useEffect, useRef } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Text } from '@rneui/themed';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import CreateUpdateIngredientModal from '@/modal/create-update-ingredient-modal';

import { useCart } from '@/context/cart-context';

const HomeScreen = () => {
  const { cart, ingredients } = useCart();

  const createUpdateBottomSheetModalRef = useRef<BottomSheetModal>(null);

  return (
    <CreateUpdateIngredientModal ref={createUpdateBottomSheetModalRef}>
      <SafeAreaView style={styles.safeArea}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text h2>Ingrédients</Text>

          <TouchableOpacity onPress={() => createUpdateBottomSheetModalRef?.current?.present()}>
            <Ionicons name="add" size={32} />
          </TouchableOpacity>
        </View>

        <View>
          {ingredients.map(({ id, name }) => (
            <Text key={id}>{name}</Text>
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
