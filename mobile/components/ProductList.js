import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ProductList({ product }) {
  return (
    <View style={styles.item}>
      <Text style={styles.name}>{product.name} ({product.id})</Text>
      <Text>Qty: {product.quantity}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { padding: 12, borderBottomWidth: 1, borderColor: '#eee' },
  name: { fontWeight: '600' }
});
