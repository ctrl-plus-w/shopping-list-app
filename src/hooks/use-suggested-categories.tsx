import { useMemo, useState } from 'react';

import { useCategories } from '@/context/categories-context';

interface IParams {
  limit?: number;
}

const useSuggestedCategories = (params?: IParams) => {
  const { categories } = useCategories();

  const [search, setSearch] = useState('');

  const suggestedCategories = useMemo(() => {
    if (search === '') return [];

    let _suggestedCategories = categories.filter((category) => category.toLowerCase().startsWith(search.toLowerCase()));

    if (params && params.limit) _suggestedCategories = _suggestedCategories.slice(0, params.limit);

    return _suggestedCategories;
  }, [search, categories]);

  return [suggestedCategories, search, setSearch] as const;
};

export default useSuggestedCategories;
