import React, { createContext, useMemo, useState } from 'react';

export const AuthContext = createContext({ token: null, user: null, signIn: async () => {}, signOut: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const auth = useMemo(() => ({
    token,
    user,
    signIn: async ({ token: newToken, user: newUser }) => {
      setToken(newToken);
      setUser(newUser);
    },
    signOut: () => {
      setToken(null);
      setUser(null);
    }
  }), [token, user]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}
