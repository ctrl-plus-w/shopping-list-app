import { useMemo } from 'react';

import { Text } from '@rneui/themed';
import { View } from 'react-native';

import IngredientCard from '@/element/ingredient-card';

import { compareIngredientName } from '@/util/array';

import { IngredientKind } from '@/type/database';

interface IProps<T extends IngredientKind = IngredientKind> {
  ingredients: T[];
  onPress: (ingredient: T) => void;
}

const IngredientsList = <T extends IngredientKind>({ ingredients, onPress }: IProps<T>) => {
  const noCategoryIngredients = useMemo(() => ingredients.filter(({ category }) => !category), [ingredients]);

  const groupedIngredients = useMemo(
    () =>
      ingredients.reduce(
        (acc, curr) => {
          const category = curr.category;

          if (!category) return acc;

          if (category in acc) acc[category] = [...acc[category], curr];
          else acc[category] = [curr];

          return acc;
        },
        {} as Record<string, T[]>,
      ),
    [ingredients],
  );

  return (
    <View style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {noCategoryIngredients.length ? (
        <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {noCategoryIngredients.sort(compareIngredientName).map((ingredient) => (
            <IngredientCard ingredient={ingredient} onPress={() => onPress(ingredient)} key={ingredient.id} />
          ))}
        </View>
      ) : (
        <></>
      )}

      {Object.keys(groupedIngredients)
        .sort()
        .map((category) => (
          <View style={{ display: 'flex', flexDirection: 'column', gap: 8 }} key={category}>
            <Text h4>{category}</Text>

            {groupedIngredients[category].sort(compareIngredientName).map((ingredient) => (
              <IngredientCard ingredient={ingredient} onPress={() => onPress(ingredient)} key={ingredient.id} />
            ))}
          </View>
        ))}
    </View>
  );
};

export default IngredientsList;