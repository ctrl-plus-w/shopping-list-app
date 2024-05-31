import { Button } from '@rneui/themed';
import { SafeAreaView, StyleSheet } from 'react-native';

import supabase from '@/instance/supabase';

const Settings = () => {
  const signOut = () => {
    supabase.auth.signOut().then();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Button title="Déconnexion" onPress={signOut} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    margin: 32,
    display: 'flex',
    flexDirection: 'row',
  },
});

export default Settings;
