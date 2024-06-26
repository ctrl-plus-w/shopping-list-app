import { useMemo } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Text } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';

import { useCart } from '@/context/cart-context';

import supabase from '@/instance/supabase';

import { TCartRecipe, TRecipeKind } from '@/type/database';

interface IProps<T extends TCartRecipe | TRecipeKind> {
  recipe: T;
  onPress: () => void;

  showAddToCartButton?: boolean;
}

const RecipeCard = <T extends TCartRecipe | TRecipeKind>({
  recipe,
  onPress,
  showAddToCartButton = false,
}: IProps<T>) => {
  const { cart, recipes, refreshCart } = useCart();

  const isInCart = useMemo(() => !!recipes.find((_recipe) => _recipe.id === recipe.id), [recipes, recipe]);

  const addToCart = async () => {
    if (!cart) return;

    try {
      if (!isInCart) {
        const { error } = await supabase
          .from('cart__recipes')
          .insert({ cart_id: cart.id, recipe_id: recipe.id, servings: recipe.servings });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart__recipes')
          .delete()
          .eq('cart_id', cart.id)
          .eq('recipe_id', recipe.id);

        if (error) throw error;
      }

      await refreshCart();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress}>
        <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text>{recipe.title}</Text>
          <Text style={{ color: '#666' }}>
            {'cart_servings' in recipe ? recipe.cart_servings : recipe.servings} personnes
          </Text>
        </View>
      </TouchableOpacity>

      {showAddToCartButton ? (
        <TouchableOpacity
          onPress={addToCart}
          style={{
            display: 'flex',
            flexDirection: 'row',
            height: '100%',
            paddingHorizontal: 4,
          }}
        >
          <Ionicons style={{ alignSelf: 'center' }} name={isInCart ? 'checkmark' : 'add'} size={28} color="black" />
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );
};

export default RecipeCard;
