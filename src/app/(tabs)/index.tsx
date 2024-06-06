import { useRef, useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Text } from '@rneui/themed';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import CreateUpdateIngredientModal from '@/modal/create-update-ingredient-modal';
import UpdateCartRecipeModal from '@/modal/update-cart-recipe-modal';

import IngredientsList from '@/module/ingredients-list';

import RecipeCard from '@/element/recipe-card';

import { useCart } from '@/context/cart-context';

import { createCartIngredient, updateCartIngredient } from '@/util/ingredients';
import { updateCartRecipe } from '@/util/recipes';

import { TCartIngredient, TCartRecipe } from '@/type/database';

const HomeScreen = () => {
  const { ingredients, recipes } = useCart();

  const [updatingIngredient, setUpdatingIngredient] = useState<TCartIngredient | undefined>(undefined);
  const [updatingRecipe, setUpdatingRecipe] = useState<TCartRecipe | undefined>(undefined);

  const createUpdateIngredientBottomSheetModalRef = useRef<BottomSheetModal>(null);
  const updateCartRecipeBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const openCreateUpdateIngredientModal = (ingredient: TCartIngredient) => {
    setUpdatingIngredient(ingredient);
    createUpdateIngredientBottomSheetModalRef.current?.present();
  };

  const openUpdateCartRecipeModal = (recipe: TCartRecipe) => {
    setUpdatingRecipe(recipe);
    updateCartRecipeBottomSheetModalRef.current?.present();
  };

  return (
    <CreateUpdateIngredientModal
      ingredient={updatingIngredient}
      createHandler={createCartIngredient}
      updateHandler={updateCartIngredient}
      ref={createUpdateIngredientBottomSheetModalRef}
    >
      <UpdateCartRecipeModal
        recipe={updatingRecipe}
        updateHandler={updateCartRecipe}
        ref={updateCartRecipeBottomSheetModalRef}
      >
        <SafeAreaView style={styles.safeArea}>
          <Text h2>Recettes</Text>

          <View style={{ display: 'flex', flexDirection: 'column' }}>
            {recipes.map((recipe) => (
              <RecipeCard recipe={recipe} onPress={() => openUpdateCartRecipeModal(recipe)} key={recipe.id} />
            ))}
          </View>

          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text h2>Ingrédients</Text>

            <TouchableOpacity onPress={() => createUpdateIngredientBottomSheetModalRef?.current?.present()}>
              <Ionicons name="add" size={32} />
            </TouchableOpacity>
          </View>

          <IngredientsList ingredients={ingredients} onPress={openCreateUpdateIngredientModal} />
        </SafeAreaView>
      </UpdateCartRecipeModal>
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
