import { Cart, Info } from '@/types';
import { User } from 'firebase/auth';
import React, { useState, createContext, useContext } from 'react';

interface AuthenticatedContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  info: Info | null;
  setInfo: React.Dispatch<React.SetStateAction<Info | null>>;
  cart: Cart | null;
  setCart: React.Dispatch<React.SetStateAction<Cart | null>>;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthenticatedContext = createContext<AuthenticatedContextProps | undefined>(undefined);

interface AuthenticatedProviderProps {
  children: React.ReactNode;
}

export const AuthenticatedProvider: React.FC<AuthenticatedProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [info, setInfo] = useState<Info | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <AuthenticatedContext.Provider value={{ user, setUser, cart, setCart, info, setInfo, isChecked, setIsChecked }}>
      {children}
    </AuthenticatedContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthenticatedContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthenticatedProvider");
  }
  return context;
};