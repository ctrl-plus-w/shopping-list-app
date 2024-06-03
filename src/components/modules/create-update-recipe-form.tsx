import { useEffect, useRef, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Button } from '@rneui/themed';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import CreateUpdateIngredientModal from '@/modal/create-update-ingredient-modal';

import IngredientsList from '@/module/ingredients-list';

import { useAuth } from '@/context/auth-context';

import supabase from '@/instance/supabase';

import { createRecipeIngredient, updateRecipeIngredient } from '@/util/ingredients';

import { TRecipe, TRecipeIngredient } from '@/type/database';

interface IProps {
  recipe?: TRecipe;
  callback?: () => void | Promise<void>;

  onPressIngredient: (ingredient: TRecipeIngredient) => void;
}

const CreateUpdateRecipeFormCore = ({ recipe, callback, onPressIngredient }: IProps) => {
  const { session } = useAuth();

  const [name, setName] = useState('');
  const [servings, setServings] = useState(1);

  useEffect(() => {
    if (!recipe) return;

    setName(recipe.title);
    setServings(recipe.servings);
  }, [recipe]);

  const createRecipe = async () => {
    if (!supabase || !session) return;

    const { data: createdRecipe, error: createRecipeError } = await supabase
      .from('recipes')
      .insert({ title: name, servings: servings, user_id: session.user.id })
      .select('id')
      .single();

    if (createRecipeError) throw createRecipeError;
    if (!createdRecipe) throw new Error('Failed to create the recipe.');
  };

  const updateRecipe = async (recipeId: string) => {
    if (!supabase || !session) return;

    const { error: updateRecipeError } = await supabase
      .from('recipes')
      .update({ title: name, servings: servings })
      .eq('id', recipeId);

    if (updateRecipeError) throw updateRecipeError;
  };

  const onSubmit = async () => {
    try {
      if (!recipe) await createRecipe();
      else await updateRecipe(recipe.id);

      callback && callback();
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
      <View style={[styles.row, styles.centerVertical]}>
        <TextInput style={styles.nameInput} value={name} onChangeText={setName} placeholder="Nom de la recette" />
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Ionicons name="checkmark" size={24} color="black" />
        </TouchableOpacity>
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

        <IngredientsList ingredients={recipe?.ingredients ?? []} onPress={onPressIngredient} />
      </View>

      <Button onPress={onSubmit}>{recipe ? 'Modifier la recette' : 'Créer la recette'}</Button>
    </View>
  );
};

const CreateUpdateRecipeForm = ({ recipe, callback }: Omit<IProps, 'onPressIngredient'>) => {
  const createUpdateBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [updatingIngredient, setUpdatingIngredient] = useState<TRecipeIngredient | undefined>(undefined);

  const onPressIngredient = (ingredient: TRecipeIngredient) => {
    createUpdateBottomSheetModalRef.current?.present();
    setUpdatingIngredient(ingredient);
  };

  return recipe ? (
    <CreateUpdateIngredientModal
      ref={createUpdateBottomSheetModalRef}
      ingredient={updatingIngredient}
      updateHandler={updateRecipeIngredient(recipe.id)}
      createHandler={createRecipeIngredient(recipe.id)}
    >
      <CreateUpdateRecipeFormCore {...{ recipe, callback, onPressIngredient }} />
    </CreateUpdateIngredientModal>
  ) : (
    <CreateUpdateRecipeFormCore {...{ recipe, callback, onPressIngredient }} />
  );
};

const styles = StyleSheet.create({
  container: {
    borderStyle: 'solid',
    borderColor: 'red',
    display: 'flex',
    gap: 16,
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

export default CreateUpdateRecipeForm;
