import { Text } from '@rneui/themed';
import { TouchableOpacity, View } from 'react-native';

import { Tables } from '@/type/database-generated';

interface IProps {
  recipe: Tables<'recipes'>;
  onPress: () => void;
}

const RecipeCard = ({ recipe, onPress }: IProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Text>{recipe.title}</Text>
        <Text style={{ color: '#666' }}>{recipe.servings} personnes</Text>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;
