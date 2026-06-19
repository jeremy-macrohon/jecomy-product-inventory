import React, { useContext, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../AuthContext';
import { login } from '../api';

export default function Login() {
  const [email, setEmail] = useState('admin@jecomy.com');
  const [password, setPassword] = useState('SecurePass123');
  const [error, setError] = useState(null);
  const { signIn } = useContext(AuthContext);

  async function handleLogin() {
    try {
      const result = await login(email, password);
      await signIn(result);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jecomy Inventory Login</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Email" autoCapitalize="none" />
      <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  input: { width: '100%', marginBottom: 12, padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  error: { color: 'red', marginBottom: 12 }
});
