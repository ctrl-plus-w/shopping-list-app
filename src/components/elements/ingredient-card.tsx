import { Text } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';

import { TIngredientKind } from '@/type/database';

interface IProps<T extends TIngredientKind> {
  ingredient: T;
  onPress: () => void;
}

const IngredientCard = <T extends TIngredientKind>({ ingredient, onPress }: IProps<T>) => {
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

export default IngredientCard;
