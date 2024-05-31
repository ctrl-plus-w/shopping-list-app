
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO ''
    AS $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."cart" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid"
);

ALTER TABLE "public"."cart" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."cart__ingredients" (
    "ingredient_id" "uuid" NOT NULL,
    "cart_id" "uuid" NOT NULL
);

ALTER TABLE "public"."cart__ingredients" OWNER TO "postgres";

COMMENT ON TABLE "public"."cart__ingredients" IS 'This is a duplicate of recipes__ingredients';

CREATE TABLE IF NOT EXISTS "public"."cart__recipes" (
    "recipe_id" "uuid" NOT NULL,
    "cart_id" "uuid" NOT NULL,
    "servings" bigint
);

ALTER TABLE "public"."cart__recipes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."ingredients" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "shelf_life" integer,
    "opened_shelf_life" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "ts" "tsvector" GENERATED ALWAYS AS ("to_tsvector"('"french"'::"regconfig", "name")) STORED,
    "image_url" "text",
    "user_id" "uuid"
);

ALTER TABLE "public"."ingredients" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "ingredient_id" "uuid" NOT NULL,
    "unit_id" "uuid" NOT NULL,
    "quantity" double precision NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recipes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "url" "text" NOT NULL,
    "servings" smallint NOT NULL,
    "steps" "text"[] NOT NULL,
    "image" "text",
    "preparation_ime" integer,
    "waiting_time" integer,
    "cooking_time" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."recipes" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."recipes__ingredients" (
    "ingredient_id" "uuid" NOT NULL,
    "recipe_id" "uuid" NOT NULL,
    "quantity" integer,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "unit_id" "uuid"
);

ALTER TABLE "public"."recipes__ingredients" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."units" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "singular" "text" NOT NULL,
    "plural" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "aliases" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "parent_category_id" "uuid"
);

ALTER TABLE "public"."units" OWNER TO "postgres";

ALTER TABLE ONLY "public"."cart__ingredients"
    ADD CONSTRAINT "cart__ingredients_pkey" PRIMARY KEY ("ingredient_id", "cart_id");

ALTER TABLE ONLY "public"."cart__recipes"
    ADD CONSTRAINT "cart__recipes_pkey" PRIMARY KEY ("recipe_id", "cart_id");

ALTER TABLE ONLY "public"."cart"
    ADD CONSTRAINT "cart_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredient_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."recipes__ingredients"
    ADD CONSTRAINT "recipes__ingredients_pkey" PRIMARY KEY ("ingredient_id", "recipe_id");

ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."units"
    ADD CONSTRAINT "units_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."cart__ingredients"
    ADD CONSTRAINT "cart__ingredients_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."cart__ingredients"
    ADD CONSTRAINT "cart__ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."cart__recipes"
    ADD CONSTRAINT "cart__recipes_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "public"."cart"("id") ON UPDATE RESTRICT ON DELETE CASCADE;

ALTER TABLE ONLY "public"."cart__recipes"
    ADD CONSTRAINT "cart__recipes_ingredient_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."ingredients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."cart__recipes"
    ADD CONSTRAINT "cart__recipes_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."cart"
    ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."ingredients"
    ADD CONSTRAINT "ingredients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recipes__ingredients"
    ADD CONSTRAINT "recipes__ingredients_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."ingredients"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recipes__ingredients"
    ADD CONSTRAINT "recipes__ingredients_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."recipes"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."recipes__ingredients"
    ADD CONSTRAINT "recipes__ingredients_unit_id_fkey" FOREIGN KEY ("unit_id") REFERENCES "public"."units"("id") ON DELETE RESTRICT;

ALTER TABLE ONLY "public"."recipes"
    ADD CONSTRAINT "recipes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."units"
    ADD CONSTRAINT "units_parent_category_id_fkey" FOREIGN KEY ("parent_category_id") REFERENCES "public"."units"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON TABLE "public"."cart" TO "anon";
GRANT ALL ON TABLE "public"."cart" TO "authenticated";
GRANT ALL ON TABLE "public"."cart" TO "service_role";

GRANT ALL ON TABLE "public"."cart__ingredients" TO "anon";
GRANT ALL ON TABLE "public"."cart__ingredients" TO "authenticated";
GRANT ALL ON TABLE "public"."cart__ingredients" TO "service_role";

GRANT ALL ON TABLE "public"."cart__recipes" TO "anon";
GRANT ALL ON TABLE "public"."cart__recipes" TO "authenticated";
GRANT ALL ON TABLE "public"."cart__recipes" TO "service_role";

GRANT ALL ON TABLE "public"."ingredients" TO "anon";
GRANT ALL ON TABLE "public"."ingredients" TO "authenticated";
GRANT ALL ON TABLE "public"."ingredients" TO "service_role";

GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."recipes" TO "anon";
GRANT ALL ON TABLE "public"."recipes" TO "authenticated";
GRANT ALL ON TABLE "public"."recipes" TO "service_role";

GRANT ALL ON TABLE "public"."recipes__ingredients" TO "anon";
GRANT ALL ON TABLE "public"."recipes__ingredients" TO "authenticated";
GRANT ALL ON TABLE "public"."recipes__ingredients" TO "service_role";

GRANT ALL ON TABLE "public"."units" TO "anon";
GRANT ALL ON TABLE "public"."units" TO "authenticated";
GRANT ALL ON TABLE "public"."units" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
