import React, { useContext, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, Button } from 'react-native';
import ProductList from '../components/ProductList';
import { AuthContext } from '../AuthContext';
import { fetchInventory } from '../api';

export default function Dashboard({ navigation }) {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function load() {
    setRefreshing(true);
    try {
      const data = await fetchInventory(token);
      setProducts(data);
    } catch (e) {
      console.warn('Failed to load products', e);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Dashboard</Text>
      <Button title="Refresh" onPress={load} />
      <Button title="View Insights" onPress={() => navigation.navigate('Insights')} />
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ProductList product={item} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 }
});
