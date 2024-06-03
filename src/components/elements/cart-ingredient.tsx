import { Text } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';

import { TCartIngredient as CartIngredientType } from '@/type/database';

interface IProps {
  ingredient: CartIngredientType;
  onPress: () => void;
}

const CartIngredient = ({ ingredient, onPress }: IProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Text>{ingredient.name}</Text>
        <Text style={{ color: '#666' }}>
          {ingredient.quantity} {ingredient.unit?.singular}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default CartIngredient;
