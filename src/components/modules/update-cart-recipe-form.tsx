import { ReactNode, useEffect, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Button, Text } from '@rneui/themed';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import IngredientsList from '@/module/ingredients-list';

import { updateCartRecipe } from '@/util/recipes';

import { TCartRecipe } from '@/type/database';

interface IProps {
  recipe: TCartRecipe;

  callback?: ((recipe: TCartRecipe) => void) | ((recipe: TCartRecipe) => Promise<void>);

  children?: ReactNode;
}

const UpdateCartRecipeForm = ({ children, recipe, callback }: IProps) => {
  const [servings, setServings] = useState(1);

  useEffect(() => {
    if (!recipe) return;
    setServings(recipe.cart_servings ?? recipe.servings);
  }, [recipe]);

  const onSubmit = async () => {
    try {
      const _recipe = await updateCartRecipe(recipe.id, { title: recipe.title, servings });

      callback && callback(_recipe);
    } catch (err) {
      console.error(err);
    }
  };

  const onServingsChange = (text: string) => {
    const parsedText = parseInt(text);
    if (!isNaN(parsedText) || text === '') setServings(parsedText);
  };

  const incrementServings = (value: number) => () => {
    setServings((servings) => Math.max(isNaN(servings) ? value : servings + value, 0));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.centerVertical, { justifyContent: 'space-between' }]}>
        <Text h4>{recipe.title}</Text>
        {/*<TouchableOpacity style={styles.submitButton} onPress={onSubmit}>*/}
        {/*  <Ionicons name="checkmark" size={24} color="black" />*/}
        {/*</TouchableOpacity>*/}
      </View>

      <View style={[styles.col, { gap: 12 }]}>
        <Text style={styles.label}>Quantité</Text>

        <View style={[styles.row, styles.centerHorizontal, { gap: 8 }]}>
          <TouchableOpacity style={[styles.actionButton]} onPress={incrementServings(-10)}>
            <Ionicons name="remove-sharp" size={24} color="black" />
            <Text>10</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton]} onPress={incrementServings(-1)}>
            <Ionicons name="remove-sharp" size={24} color="black" />
          </TouchableOpacity>

          <TextInput
            keyboardType="numeric"
            style={styles.quantityInput}
            value={isNaN(servings) ? '' : servings.toString()}
            onChangeText={onServingsChange}
            placeholder="000"
          />

          <TouchableOpacity style={[styles.actionButton]} onPress={incrementServings(1)}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton]} onPress={incrementServings(10)}>
            <Ionicons name="add" size={24} color="black" />
            <Text>10</Text>
          </TouchableOpacity>
        </View>

        <Text h2>Ingrédients</Text>
        <IngredientsList ingredients={recipe?.ingredients ?? []} factor={servings / recipe.servings} />
      </View>

      {children}

      <Button onPress={onSubmit}>{recipe ? 'Modifier la recette' : 'Créer la recette'}</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderColor: 'red',
    display: 'flex',
    gap: 16,
    margin: 16,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
  },
  centerHorizontal: {
    justifyContent: 'center',
  },
  centerVertical: {
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
  },
  nameInput: {
    flex: 1,
    borderStyle: 'solid',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    padding: 8,
    fontSize: 16,
  },
  quantityInput: {
    flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  searchInput: {
    // flex: 1,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
  },
  actionButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'black',
  },
  activeActionButton: {
    backgroundColor: 'black',
  },
  activeActionButtonText: {
    color: 'white',
  },
  submitButton: {
    padding: 6,
    marginLeft: 4,
  },
});

export default UpdateCartRecipeForm;
