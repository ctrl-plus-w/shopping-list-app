import { useCallback, useMemo, useRef } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CreateUpdateIngredientModal from '@/components/modals/create-update-ingredient-modal';
import CreateUpdateIngredientForm from '@/components/modules/create-update-ingredient-form';
import supabase from '@/lib/supabase';
import Ionicons from '@expo/vector-icons/Ionicons';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { Text, Button, Input } from '@rneui/themed';
import { Image, StyleSheet, Platform, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const createUpdateBottomSheetModalRef = useRef<BottomSheetModal>(null);

  return (
    <CreateUpdateIngredientModal ref={createUpdateBottomSheetModalRef}>
      <SafeAreaView style={styles.safeArea}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text h2>Ingrédients</Text>

          <TouchableOpacity onPress={() => createUpdateBottomSheetModalRef?.current?.present()}>
            <Ionicons name="add" size={32} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </CreateUpdateIngredientModal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    margin: 32,
    display: 'flex',
    flexDirection: 'row',
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 8,
  },
});
