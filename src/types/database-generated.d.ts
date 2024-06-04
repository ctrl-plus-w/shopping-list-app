export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      cart: {
        Row: {
          created_at: string;
          id: string;
          user_id: string | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          user_id?: string | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'cart_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      cart__ingredients: {
        Row: {
          cart_id: string;
          ingredient_id: string;
          quantity: number | null;
          unit_id: string;
        };
        Insert: {
          cart_id: string;
          ingredient_id: string;
          quantity?: number | null;
          unit_id: string;
        };
        Update: {
          cart_id?: string;
          ingredient_id?: string;
          quantity?: number | null;
          unit_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'cart__ingredients_cart_id_fkey';
            columns: ['cart_id'];
            isOneToOne: false;
            referencedRelation: 'cart';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cart__ingredients_ingredient_id_fkey';
            columns: ['ingredient_id'];
            isOneToOne: false;
            referencedRelation: 'ingredients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cart__ingredients_unit_id_fkey';
            columns: ['unit_id'];
            isOneToOne: false;
            referencedRelation: 'units';
            referencedColumns: ['id'];
          },
        ];
      };
      cart__recipes: {
        Row: {
          cart_id: string;
          recipe_id: string;
          servings: number | null;
        };
        Insert: {
          cart_id: string;
          recipe_id: string;
          servings?: number | null;
        };
        Update: {
          cart_id?: string;
          recipe_id?: string;
          servings?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'cart__recipes_cart_id_fkey';
            columns: ['cart_id'];
            isOneToOne: false;
            referencedRelation: 'cart';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'cart__recipes_recipe_id_fkey';
            columns: ['recipe_id'];
            isOneToOne: false;
            referencedRelation: 'recipes';
            referencedColumns: ['id'];
          },
        ];
      };
      ingredients: {
        Row: {
          category: string | null;
          created_at: string;
          id: string;
          image_url: string | null;
          name: string;
          opened_shelf_life: number | null;
          shelf_life: number | null;
          ts: unknown | null;
          user_id: string | null;
        };
        Insert: {
          category?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name: string;
          opened_shelf_life?: number | null;
          shelf_life?: number | null;
          ts?: unknown | null;
          user_id?: string | null;
        };
        Update: {
          category?: string | null;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          name?: string;
          opened_shelf_life?: number | null;
          shelf_life?: number | null;
          ts?: unknown | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'ingredients_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      products: {
        Row: {
          created_at: string | null;
          id: string;
          ingredient_id: string;
          quantity: number;
          unit_id: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          ingredient_id: string;
          quantity: number;
          unit_id: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          ingredient_id?: string;
          quantity?: number;
          unit_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'products_ingredient_id_fkey';
            columns: ['ingredient_id'];
            isOneToOne: false;
            referencedRelation: 'ingredients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'products_unit_id_fkey';
            columns: ['unit_id'];
            isOneToOne: false;
            referencedRelation: 'units';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          id: string;
        };
        Insert: {
          created_at?: string;
          id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      recipes: {
        Row: {
          cooking_time: number | null;
          created_at: string;
          id: string;
          image: string | null;
          preparation_ime: number | null;
          servings: number;
          steps: string[] | null;
          title: string;
          url: string | null;
          user_id: string;
          waiting_time: number | null;
        };
        Insert: {
          cooking_time?: number | null;
          created_at?: string;
          id?: string;
          image?: string | null;
          preparation_ime?: number | null;
          servings: number;
          steps?: string[] | null;
          title: string;
          url?: string | null;
          user_id: string;
          waiting_time?: number | null;
        };
        Update: {
          cooking_time?: number | null;
          created_at?: string;
          id?: string;
          image?: string | null;
          preparation_ime?: number | null;
          servings?: number;
          steps?: string[] | null;
          title?: string;
          url?: string | null;
          user_id?: string;
          waiting_time?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: 'recipes_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      recipes__ingredients: {
        Row: {
          created_at: string;
          ingredient_id: string;
          quantity: number | null;
          recipe_id: string;
          unit_id: string | null;
        };
        Insert: {
          created_at?: string;
          ingredient_id: string;
          quantity?: number | null;
          recipe_id: string;
          unit_id?: string | null;
        };
        Update: {
          created_at?: string;
          ingredient_id?: string;
          quantity?: number | null;
          recipe_id?: string;
          unit_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'recipes__ingredients_ingredient_id_fkey';
            columns: ['ingredient_id'];
            isOneToOne: false;
            referencedRelation: 'ingredients';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'recipes__ingredients_recipe_id_fkey';
            columns: ['recipe_id'];
            isOneToOne: false;
            referencedRelation: 'recipes';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'recipes__ingredients_unit_id_fkey';
            columns: ['unit_id'];
            isOneToOne: false;
            referencedRelation: 'units';
            referencedColumns: ['id'];
          },
        ];
      };
      units: {
        Row: {
          aliases: string[];
          created_at: string | null;
          id: string;
          parent_category_id: string | null;
          plural: string;
          singular: string;
        };
        Insert: {
          aliases?: string[];
          created_at?: string | null;
          id?: string;
          parent_category_id?: string | null;
          plural: string;
          singular: string;
        };
        Update: {
          aliases?: string[];
          created_at?: string | null;
          id?: string;
          parent_category_id?: string | null;
          plural?: string;
          singular?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'units_parent_category_id_fkey';
            columns: ['parent_category_id'];
            isOneToOne: false;
            referencedRelation: 'units';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_user_categories: {
        Args: {
          uid: string;
        };
        Returns: string[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, 'public'>];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views']) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    ? (PublicSchema['Tables'] & PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema['Tables'] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema['Enums'] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never;
