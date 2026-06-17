import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { Button, Text, useTheme } from 'react-native-paper';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { InventoryStackParamList } from '../../types/navigation';

type Props = NativeStackScreenProps<InventoryStackParamList, 'BarcodeScanner'>;

export function BarcodeScannerScreen({ navigation }: Props) {
  const theme = useTheme();
  const [hasPermission, setHasPermission] = useState(false);
  const [locked, setLocked] = useState(false);
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13', 'ean-8', 'code-128', 'upc-a', 'upc-e'],
    onCodeScanned: (codes) => {
      if (locked) return;
      const value = codes[0]?.value;
      if (value) {
        setLocked(true);
        navigation.replace('ProductForm', { barcode: value });
      }
    }
  });

  useEffect(() => {
    Camera.requestCameraPermission().then((permission) => setHasPermission(permission === 'granted'));
  }, []);

  if (!hasPermission || !device) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: theme.colors.background }}>
        <Text variant="titleLarge" style={{ textAlign: 'center', fontWeight: '700' }}>
          Camera permission is required
        </Text>
        <Button mode="contained" style={{ marginTop: 16 }} onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Camera style={{ flex: 1 }} device={device} isActive codeScanner={codeScanner} />
      <View style={{ position: 'absolute', left: 24, right: 24, bottom: 48 }}>
        <Text variant="titleMedium" style={{ color: '#FFFFFF', textAlign: 'center' }}>
          Align a barcode or QR code inside the frame
        </Text>
      </View>
    </View>
  );
}
