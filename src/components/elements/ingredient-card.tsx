import { Text } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';

import { toFixedIfNecessary } from '@/util/numbers';

import { TIngredientKind } from '@/type/database';

interface IProps<T extends TIngredientKind> {
  ingredient: T;
  onPress?: (ingredient: T) => void;

  factor?: number;
}

const IngredientCardCore = <T extends TIngredientKind>({ ingredient, factor = 1 }: Omit<IProps<T>, 'onPress'>) => {
  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Text>{ingredient.name}</Text>
      <Text style={{ color: '#666' }}>
        {ingredient.quantity ? toFixedIfNecessary(ingredient.quantity * factor, 2) : ''} {ingredient.unit?.singular}
      </Text>
    </View>
  );
};

const IngredientCard = <T extends TIngredientKind>({ onPress, ...props }: IProps<T>) => {
  const _onPress = () => {
    if (onPress) onPress(props.ingredient);
  };

  return onPress ? (
    <TouchableOpacity onPress={_onPress}>
      <IngredientCardCore {...props} />
    </TouchableOpacity>
  ) : (
    <IngredientCardCore {...props} />
  );
};

export default IngredientCard;
