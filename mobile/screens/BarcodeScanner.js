import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';
import { useScanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { AuthContext } from '../AuthContext';
import { createInventoryItem } from '../api';

export default function BarcodeScanner({ navigation }) {
  const { token } = useContext(AuthContext);
  const devices = useCameraDevices();
  const device = devices.back;
  const [hasPermission, setHasPermission] = useState(false);
  const [lastCode, setLastCode] = useState(null);
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.ALL_FORMATS]);

  useEffect(() => {
    Camera.requestCameraPermission().then((status) => setHasPermission(status === 'authorized'));
  }, []);

  useEffect(() => {
    if (barcodes.length > 0) {
      const barcode = barcodes[0];
      if (barcode.displayValue) {
        setLastCode(barcode.displayValue);
        createInventoryItem(token, { id: barcode.displayValue, name: 'Scanned Item', quantity: 1 }).catch((err) => {
          console.warn('Failed to save scanned item', err);
        });
      }
    }
  }, [barcodes, token]);

  if (!device) {
    return (
      <View style={styles.center}>
        <Text>Loading camera...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>Camera permission is required.</Text>
        <Button title="Grant Permission" onPress={() => Camera.requestCameraPermission().then((status) => setHasPermission(status === 'authorized'))} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        frameProcessorFps={5}
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>Barcode Scanner</Text>
        <Text style={styles.subtitle}>Last scanned: {lastCode || 'none'}</Text>
        <Button title="Go to Dashboard" onPress={() => navigation.navigate('Dashboard')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  overlay: { position: 'absolute', bottom: 40, left: 20, right: 20, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 12, padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#fff', marginBottom: 12 }
});
