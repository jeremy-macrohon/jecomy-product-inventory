import React, { useContext, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../AuthContext';
import { createInventoryItem } from '../api';

// This screen currently provides a scaffold for barcode scanning.
// Install `react-native-vision-camera` and `vision-camera-code-scanner` to
// replace the simulated scan with a live camera view.

export default function Scanner({ navigation }) {
  const [lastCode, setLastCode] = useState(null);
  const { token } = useContext(AuthContext);

  async function onBarCodeRead(code) {
    setLastCode(code);
    try {
      await createInventoryItem(token, { id: code, name: 'Scanned Item', quantity: 1 });
    } catch (e) {
      console.warn('Failed to post product', e);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scanner (scaffold)</Text>
      <Text>Last scanned: {lastCode || 'none'}</Text>
      <Text style={styles.note}>
        To use a real barcode scanner, install the native camera package and
        call `onBarCodeRead(code)` when a barcode is detected.
      </Text>
      <Button title="Open Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      <Button title="View Insights" onPress={() => navigation.navigate('Insights')} />
      <Button title="Simulate Scan" onPress={() => onBarCodeRead('SKU-12345')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  note: { marginTop: 12, color: '#444', textAlign: 'center' }
});
