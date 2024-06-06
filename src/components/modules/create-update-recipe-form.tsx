import { Dispatch, ReactNode, SetStateAction, useEffect, useRef, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Button, Text } from '@rneui/themed';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import CreateUpdateIngredientModal from '@/modal/create-update-ingredient-modal';

import IngredientsList from '@/module/ingredients-list';

import { useAuth } from '@/context/auth-context';

import { createRecipeIngredient, updateRecipeIngredient } from '@/util/ingredients';
import { CreateRecipeHandler, UpdateRecipeHandler } from '@/util/recipes';

import { TRecipe, TRecipeIngredient } from '@/type/database';

interface IProps {
  recipe?: TRecipe;
  setRecipe: Dispatch<SetStateAction<TRecipe | undefined>>;

  callback?: () => void | Promise<void>;

  onPressIngredient: (ingredient: TRecipeIngredient) => void;
  onPressCreateIngredient?: () => void;

  createHandler: CreateRecipeHandler<TRecipe>;
  updateHandler: UpdateRecipeHandler<TRecipe>;

  children?: ReactNode;
}

const CreateUpdateRecipeFormCore = ({
  children,
  recipe,
  callback,
  onPressIngredient,
  onPressCreateIngredient,
  createHandler,
  updateHandler,
}: IProps) => {
  const { session } = useAuth();

  const [name, setName] = useState('');
  const [servings, setServings] = useState(1);

  useEffect(() => {
    if (!recipe) return;

    setName(recipe.title);
    setServings(recipe.servings);
  }, [recipe]);

  const onSubmit = async () => {
    if (!session) return;

    try {
      const data = { title: name, servings };

      if (!recipe) await createHandler(session, data);
      else await updateHandler(recipe.id, data);

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

        {onPressCreateIngredient ? (
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text h2>Ingrédients</Text>

            <TouchableOpacity onPress={onPressCreateIngredient}>
              <Ionicons name="add" size={32} />
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}

        <IngredientsList ingredients={recipe?.ingredients ?? []} onPress={onPressIngredient} />
      </View>

      {children}

      <Button onPress={onSubmit}>{recipe ? 'Modifier la recette' : 'Créer la recette'}</Button>
    </View>
  );
};

const CreateUpdateRecipeForm = ({
  recipe,
  callback,
  setRecipe,
  createHandler,
  updateHandler,
}: Omit<IProps, 'onPressIngredient'>) => {
  const createUpdateBottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [updatingIngredient, setUpdatingIngredient] = useState<TRecipeIngredient | undefined>(undefined);

  const onPressIngredient = (ingredient: TRecipeIngredient) => {
    createUpdateBottomSheetModalRef.current?.present();
    setUpdatingIngredient(ingredient);
  };

  const onPressCreateIngredient = () => {
    createUpdateBottomSheetModalRef.current?.present();
    setUpdatingIngredient(undefined);
  };

  const onCreateUpdateIngredient = (ingredient: TRecipeIngredient) => {
    setRecipe((recipe) => {
      if (!recipe) return recipe;

      const isIngredientInRecipe =
        recipe.ingredients.findIndex((_ingredient) => _ingredient.id === ingredient.id) !== -1;

      const ingredients = isIngredientInRecipe
        ? recipe.ingredients.map((_ingredient) => (ingredient.id !== _ingredient.id ? _ingredient : ingredient))
        : [...recipe.ingredients, ingredient];

      return { ...recipe, ingredients };
    });
  };

  return recipe ? (
    <CreateUpdateIngredientModal<TRecipeIngredient>
      ref={createUpdateBottomSheetModalRef}
      ingredient={updatingIngredient}
      updateHandler={updateRecipeIngredient(recipe.id)}
      createHandler={createRecipeIngredient(recipe.id)}
      callback={onCreateUpdateIngredient}
    >
      <CreateUpdateRecipeFormCore
        {...{ recipe, createHandler, updateHandler, callback, setRecipe, onPressIngredient, onPressCreateIngredient }}
      />
    </CreateUpdateIngredientModal>
  ) : (
    <CreateUpdateRecipeFormCore {...{ recipe, createHandler, updateHandler, callback, setRecipe, onPressIngredient }} />
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

export default CreateUpdateRecipeForm;
