import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { AuthContext } from '../AuthContext';
import { fetchInsights } from '../api';

export default function Insights() {
  const { token } = useContext(AuthContext);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchInsights(token);
        setInsights(data);
      } catch (e) {
        console.warn('Failed to load insights', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [token]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!insights) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Insights unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inventory Insights</Text>
      <Text>Total products: {insights.totalProducts}</Text>
      <Text>Total quantity: {insights.totalQuantity}</Text>
      <Text>Events:</Text>
      {Object.entries(insights.eventsByType).map(([type, count]) => (
        <Text key={type}>{type}: {count}</Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 }
});
