import { useEffect, useState } from 'react';

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import CreateUpdateRecipeForm from '@/module/create-update-recipe-form';

import { useRecipes } from '@/context/recipes-context';

import supabase from '@/instance/supabase';

import { TRecipe } from '@/type/database';

const CreateUpdateRecipeScreen = () => {
  const router = useRouter();

  const { id, name } = useLocalSearchParams<{ id?: string; name?: string }>();

  const { refreshRecipes } = useRecipes();

  const [recipe, setRecipe] = useState<TRecipe | undefined>(undefined);

  const fetchRecipe = async (recipeId: string) => {
    try {
      const { data, error } = await supabase
        .from('recipes')
        .select('*, ingredients!recipes__ingredients (*)')
        .eq('id', recipeId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Recipe not found.');

      setRecipe(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!id || id === '') return;
    fetchRecipe(id).then();
  }, [id]);

  useEffect(() => {
    if (!recipe) return;
  }, [recipe]);

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

      <View style={styles.container}>
        <CreateUpdateRecipeForm recipe={recipe} callback={createUpdateRecipeCallback} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    margin: 16,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 8,
  },
});

export default CreateUpdateRecipeScreen;
