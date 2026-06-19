import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Scanner from '../screens/Scanner';
import Dashboard from '../screens/Dashboard';
import BarcodeScanner from '../screens/BarcodeScanner';
import Login from '../screens/Login';
import Insights from '../screens/Insights';
import { AuthContext } from '../AuthContext';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { token } = useContext(AuthContext);

  return (
    <Stack.Navigator initialRouteName={token ? 'Scanner' : 'Login'}>
      {token ? (
        <>
          <Stack.Screen name="Scanner" component={Scanner} />
          <Stack.Screen name="BarcodeScanner" component={BarcodeScanner} />
          <Stack.Screen name="Dashboard" component={Dashboard} />
          <Stack.Screen name="Insights" component={Insights} />
        </>
      ) : (
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
}
