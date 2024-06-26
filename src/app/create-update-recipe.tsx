import { useEffect, useState } from 'react';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet } from 'react-native';

import CreateUpdateRecipeForm from '@/module/create-update-recipe-form';

import { useRecipes } from '@/context/recipes-context';

import supabase from '@/instance/supabase';

import { isDefined } from '@/util/array';
import { createRecipe, updateRecipe } from '@/util/recipes';

import { TRecipe, TRecipeIngredient } from '@/type/database';

const CreateUpdateRecipeScreen = () => {
  const router = useRouter();

  const { id, name } = useLocalSearchParams<{ id?: string; name?: string }>();

  const { refreshRecipes } = useRecipes();

  const [recipe, setRecipe] = useState<TRecipe | undefined>(undefined);

  const fetchRecipe = async (recipeId: string) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*, recipes__ingredients (*, ingredients(*), units(*))')
        .eq('id', recipeId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Recipe not found.');

      const { recipes__ingredients, ...recipe } = data;

      const ingredients = recipes__ingredients
        .map(({ ingredients, quantity, units }) => {
          if (!ingredients || !units) return undefined;

          return {
            ...ingredients,
            category: ingredients.category,
            unit: units ?? undefined,
            quantity: quantity ?? undefined,
          } satisfies TRecipeIngredient;
        })
        .filter(isDefined);

      setRecipe({ ...recipe, ingredients });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id || id === '') return;
    fetchRecipe(id).then();
  }, [id]);

  const createUpdateRecipeCallback = () => {
    refreshRecipes().then();
    router.push('/(tabs)/recipes');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: name && id ? name : 'Créer une recette',
          headerBackTitle: 'Recettes',
        }}
      />

      <CreateUpdateRecipeForm
        setRecipe={setRecipe}
        recipe={recipe}
        callback={createUpdateRecipeCallback}
        createHandler={createRecipe}
        updateHandler={updateRecipe}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    // margin: 16,
  },
  contentContainer: {
    flex: 1,
    padding: 8,
  },
});

export default CreateUpdateRecipeScreen;
