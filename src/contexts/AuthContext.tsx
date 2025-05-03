
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'clinician';
  age?: number;
  consentGiven?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock data for demo purposes
const MOCK_USERS = [
  {
    id: '1',
    email: 'patient@example.com',
    password: 'password123',
    name: 'John Doe',
    role: 'patient' as const,
    age: 35,
    consentGiven: true
  },
  {
    id: '2',
    email: 'doctor@example.com',
    password: 'password123',
    name: 'Dr. Jane Smith',
    role: 'clinician' as const,
    age: 42,
    consentGiven: true
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  // Check for stored user on load
  useEffect(() => {
    const storedUser = localStorage.getItem('mindwave_user');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('mindwave_user');
      }
    }
    
    setLoading(false);
  }, []);

  // Update local storage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('mindwave_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('mindwave_user');
    }
  }, [user]);

  const signUp = async (email: string, password: string): Promise<void> => {
    // Simulate API call delay
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if email already exists
      if (MOCK_USERS.some(user => user.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Create new user with minimal data - more will be added during onboarding
      const newUser = {
        id: String(Date.now()),
        email,
        name: '',
        role: 'patient' as const
      };
      
      MOCK_USERS.push({ ...newUser, password });
      setUser(newUser);
      
      toast({
        title: "Account created successfully",
        description: "Welcome to MindWave Wellness Hub!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign up failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const foundUser = MOCK_USERS.find(user => user.email === email && user.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      // Extract everything but the password
      const { password: _, ...userWithoutPassword } = foundUser;
      
      setUser(userWithoutPassword);
      
      toast({
        title: "Signed in successfully",
        description: `Welcome back, ${userWithoutPassword.name || 'User'}!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async (): Promise<void> => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: "There was an error signing you out.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!user) {
        throw new Error('No user is signed in');
      }
      
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // Update in MOCK_USERS array too
      const userIndex = MOCK_USERS.findIndex(u => u.id === user.id);
      if (userIndex !== -1) {
        MOCK_USERS[userIndex] = { ...MOCK_USERS[userIndex], ...userData };
      }
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error instanceof Error ? error.message : "Something went wrong",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
