import { useEffect, useMemo, useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { useAuth } from '@/context/auth-context';
import { useCart } from '@/context/cart-context';
import { useUnits } from '@/context/units-context';

import supabase from '@/instance/supabase';

interface IProps {
  callback?: () => void | Promise<void>;
}

const CreateUpdateIngredientForm = ({ callback }: IProps) => {
  const { session } = useAuth();
  const { cart } = useCart();

  const { units } = useUnits();

  const [categories, setCategories] = useState<string[]>([]);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const [category, setCategory] = useState('');
  const [isCategorySuggested, setIsCategorySuggested] = useState(false);

  const [selectedUnitId, setSelectedUnitId] = useState('');
  const [selectedSubUnitId, setSelectedSubUnitId] = useState('');

  const parentUnits = useMemo(() => units.filter((unit) => !unit.parent_category_id), [units]);

  useEffect(() => {
    if (!session) return;

    const fetchCategories = async () => {
      const { data } = await supabase.rpc('get_user_categories', { uid: session.user.id });
      if (data) setCategories(data);
    };

    fetchCategories().then();
  }, [session]);

  const suggestedCategories = useMemo(() => {
    return category === '' || isCategorySuggested
      ? []
      : categories.filter((category) => category.toLowerCase().includes(category.toLowerCase()));
  }, [category, categories, isCategorySuggested]);

  const onSubmit = async () => {
    if (!cart) return;

    try {
      const { data: createdIngredient, error: createIngredientError } = await supabase
        .from('ingredients')
        .insert({ name, category })
        .select('id')
        .single();

      if (createIngredientError) throw createIngredientError;
      if (!createdIngredient) throw new Error('Ingredient failed to be created.');

      const { error } = await supabase
        .from('cart__ingredients')
        .insert({
          unit_id: selectedUnitId,
          quantity: quantity,
          ingredient_id: createdIngredient.id,
          cart_id: cart.id,
        })
        .select('*');

      if (error) throw error;
      callback && callback();
    } catch (err) {
      console.error(err);
    }
  };

  const onQuantityChange = (text: string) => {
    const parsedText = parseInt(text);
    if (!isNaN(parsedText) || text === '') setQuantity(parsedText);
  };

  const onSearchCategory = (text: string) => {
    setCategory(text);
    setIsCategorySuggested(false);
  };

  const onSuggestedCategoryClick = (category: string) => {
    setCategory(category);
    setIsCategorySuggested(true);
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

        {suggestedCategories.map((category) => (
          <TouchableOpacity key={category} onPress={() => onSuggestedCategoryClick(category)}>
            <Text>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
