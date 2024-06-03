import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@rneui/themed';
import { Link, useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, View } from 'react-native';

import RecipeCard from '@/element/recipe-card';

import { useRecipes } from '@/context/recipes-context';

import { Tables } from '@/type/database-generated';

const RecipesScreen = () => {
  const router = useRouter();

  const { recipes } = useRecipes();

  const onPressRecipeCard = (recipe: Tables<'recipes'>) => () => {
    router.push({ pathname: '/create-update-recipe', params: { id: recipe.id, name: recipe.title } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text h2>Recettes</Text>

        <Link href={{ pathname: '/create-update-recipe' }}>
          <Ionicons name="add" size={32} />
        </Link>
      </View>

      {recipes.map((recipe) => (
        <RecipeCard recipe={recipe} onPress={onPressRecipeCard(recipe)} key={recipe.id} />
      ))}

      {/*<View style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>*/}
      {/*  {noCategoryIngredients.length ? (*/}
      {/*    <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>*/}
      {/*      {noCategoryIngredients.sort(compareIngredientName).map((ingredient) => (*/}
      {/*        <IngredientCard*/}
      {/*          ingredient={ingredient}*/}
      {/*          onPress={openUpdateIngredientModal(ingredient)}*/}
      {/*          key={ingredient.id}*/}
      {/*        />*/}
      {/*      ))}*/}
      {/*    </View>*/}
      {/*  ) : (*/}
      {/*    <></>*/}
      {/*  )}*/}
      {/*</View>*/}
    </SafeAreaView>
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

export default RecipesScreen;
