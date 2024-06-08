import { useEffect, useMemo, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import RecordAudio from '@/module/record-audio';

import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { useUnits } from '@/context/units-context';

import useSuggestedCategories from '@/hook/use-suggested-categories';

import { getBase64BlobFromUri } from '@/util/files';
import { CreateIngredientHandler, getGeneratedIngredientFromBase64, UpdateIngredientHandler } from '@/util/ingredients';
import { capitalize } from '@/util/strings';

import { TIngredientKind } from '@/type/database';
import { Tables } from '@/type/database-generated';

export interface IProps<T extends TIngredientKind> {
  ingredient?: T;
  callback?: ((ingredient: T) => void) | ((ingredient: T) => Promise<void>);

  createHandler: CreateIngredientHandler<T>;
  updateHandler: UpdateIngredientHandler<T>;
}

const CreateUpdateIngredientForm = <T extends TIngredientKind>({
  ingredient,
  createHandler,
  updateHandler,
  callback,
}: IProps<T>) => {
  const { units } = useUnits();
  const { cart } = useCart();
  const { session } = useAuth();

  const [suggestedCategories, category, setCategory] = useSuggestedCategories();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [showCategoriesSuggestions, setShowCategoriesSuggestions] = useState(false);

  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [selectedSubUnitId, setSelectedSubUnitId] = useState('');

  const parentUnits = useMemo(() => units.filter((unit) => !unit.parent_category_id), [units]);

  useEffect(() => {
    if (!ingredient) return;

    setName(ingredient.name);
    setQuantity(ingredient.quantity ?? 1);

    if (ingredient.category && ingredient.category !== '') {
      setCategory(ingredient.category);
      setShowCategoriesSuggestions(false);
    }

    if (ingredient.unit) setSelectedUnit(ingredient.unit);
  }, [ingredient]);

  const onSubmit = async () => {
    if (selectedUnitId === '' || name === '' || !cart || !session) return;

    try {
      const unitId = selectedSubUnitId === '' ? selectedUnitId : selectedSubUnitId;
      const data = { name, quantity, category, unitId };

      const _ingredient = await (!ingredient
        ? createHandler(cart, session, data)
        : updateHandler(cart, ingredient.id, data));

      callback && callback(_ingredient);
    } catch (err) {
      console.error(err);
    }
  };

  const generateIngredient = async (uri: string) => {
    try {
      const audioBase64 = await getBase64BlobFromUri(uri);
      if (!audioBase64) return;

      const genIngredient = await getGeneratedIngredientFromBase64(audioBase64);

      setName(capitalize(genIngredient.name));
      setQuantity(genIngredient.quantity);
      setCategory(capitalize(genIngredient.categorie));

      const unit = units.find((unit) => unit.singular === genIngredient.unit || unit.plural === genIngredient.unit);
      if (!unit) return;

      setSelectedUnit(unit);
    } catch (err) {
      console.error(err);
    }
  };

  const setSelectedUnit = (unit: Tables<'units'>) => {
    if (unit.parent_category_id) {
      setSelectedUnitId(unit.parent_category_id);
      setSelectedSubUnitId(unit.id);
    } else {
      setSelectedUnitId(unit.id);
    }
  };

  const onQuantityChange = (text: string) => {
    const parsedText = parseInt(text);
    if (!isNaN(parsedText) || text === '') setQuantity(parsedText);
  };

  const onSearchCategory = (text: string) => {
    setCategory(text);
    setShowCategoriesSuggestions(true);
  };

  const onSuggestedCategoryClick = (category: string) => {
    setCategory(category);
    setShowCategoriesSuggestions(false);
  };

  const incrementQuantity = (value: number) => () => {
    setQuantity((quantity) => Math.max(isNaN(quantity) ? value : quantity + value, 0));
  };

  return (
    <View style={styles.container}>
      <View style={[styles.row, styles.centerVertical]}>
        <TextInput style={styles.nameInput} value={name} onChangeText={setName} placeholder="Nom de l'ingrédient" />
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Ionicons name="checkmark" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <View style={[styles.col, { gap: 12 }]}>
        <Text style={styles.label}>Quantité</Text>

        <View style={[styles.row, styles.centerHorizontal, { gap: 8 }]}>
          <TouchableOpacity style={[styles.actionButton]} onPress={incrementQuantity(-10)}>
            <Ionicons name="remove-sharp" size={24} color="black" />
            <Text>10</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton]} onPress={incrementQuantity(-1)}>
            <Ionicons name="remove-sharp" size={24} color="black" />
          </TouchableOpacity>

          <TextInput
            keyboardType="numeric"
            style={styles.quantityInput}
            value={isNaN(quantity) ? '' : quantity.toString()}
            onChangeText={onQuantityChange}
            placeholder="000"
          />

          <TouchableOpacity style={[styles.actionButton]} onPress={incrementQuantity(1)}>
            <Ionicons name="add" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton]} onPress={incrementQuantity(10)}>
            <Ionicons name="add" size={24} color="black" />
            <Text>10</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.col, { gap: 12 }]}>
        <Text style={styles.label}>Unité</Text>

        <View style={[styles.row, { gap: 8 }]}>
          {parentUnits.slice(0, 3).map((unit) => (
            <TouchableOpacity
              key={unit.id}
              style={[styles.actionButton, unit.id === selectedUnitId && styles.activeActionButton]}
              onPress={() => {
                setSelectedUnitId(unit.id);
                setSelectedSubUnitId('');
              }}
            >
              <Text style={[unit.id === selectedUnitId && styles.activeActionButtonText]}>{unit.singular}</Text>
            </TouchableOpacity>
          ))}

          <RNPickerSelect
            style={{
              viewContainer: [
                styles.actionButton,
                styles.activeActionButton,
                { flex: 1, justifyContent: 'flex-start' },
              ],
              inputIOS: {
                color: 'white',
              },
              placeholder: {
                color: 'white',
              },
            }}
            placeholder={{ label: 'Autre', value: null }}
            onValueChange={(value) => value && setSelectedUnitId(value)}
            value={selectedUnitId}
            items={parentUnits.slice(3).map((unit) => ({ label: unit.singular, value: unit.id }))}
          />
        </View>

        <View style={[styles.row, { gap: 8 }]}>
          {units
            .filter(
              (unit) =>
                (unit.parent_category_id && unit.parent_category_id === selectedUnitId) || unit.id === selectedUnitId,
            )
            .map((unit) => (
              <TouchableOpacity
                key={unit.id}
                style={[styles.actionButton, unit.id === selectedSubUnitId && styles.activeActionButton]}
                onPress={() => setSelectedSubUnitId(unit.id)}
              >
                <Text style={[unit.id === selectedSubUnitId && styles.activeActionButtonText]}>{unit.singular}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>

      <View style={[styles.col, { gap: 12 }]}>
        <Text style={styles.label}>Catégorie</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={'Rechercher une catégorie'}
          value={category}
          onChangeText={onSearchCategory}
        />

        {showCategoriesSuggestions ? (
          suggestedCategories.map((category) => (
            <TouchableOpacity key={category} onPress={() => onSuggestedCategoryClick(category)}>
              <Text>{category}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <></>
        )}
      </View>

      <RecordAudio onStopRecording={generateIngredient} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

export default CreateUpdateIngredientForm;
