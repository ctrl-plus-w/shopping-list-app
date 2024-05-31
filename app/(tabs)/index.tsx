import { useCallback, useMemo, useRef } from 'react';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CreateUpdateIngredientForm from '@/components/modules/create-update-ingredient-form';
import supabase from '@/lib/supabase';
import BottomSheet, { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { Text, Button, Input } from '@rneui/themed';
import { Image, StyleSheet, Platform, View, SafeAreaView } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function HomeScreen() {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const snapPoints = useMemo(() => ['90%', '90%'], []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <View style={styles.container}>
          <Button onPress={handlePresentModalPress} title="Present Modal" color="black" />
          <BottomSheetModal ref={bottomSheetModalRef} index={1} snapPoints={snapPoints} onChange={handleSheetChanges}>
            <BottomSheetView style={styles.contentContainer}>
              <CreateUpdateIngredientForm callback={() => bottomSheetModalRef.current?.close()} />
            </BottomSheetView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>

    // <SafeAreaView style={styles.safeArea}>
    //   <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}>
    //     <Text h2>Ingrédients</Text>
    //     <Button>+</Button>
    //   </View>
    // </SafeAreaView>
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
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 8,
  },
});
