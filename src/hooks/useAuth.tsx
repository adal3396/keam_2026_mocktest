import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

type UserRole = 'admin' | 'student';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = async (uid: string): Promise<UserRole | null> => {
    try {
      const response = await fetch(`/api/auth?userId=${uid}`);
      if (!response.ok) return null;
      const data = await response.json();
      return data.role;
    } catch (err) {
      console.error('Fetch role error:', err);
      return null;
    }
  };

  const syncProfile = async (uid: string, fullName: string, email: string) => {
    try {
      await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid, fullName, email }),
      });
    } catch (err) {
      console.error('Sync profile error:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const nextRole = await fetchRole(firebaseUser.uid);
        setRole(nextRole);
      } else {
        setRole(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: fullName });
    
    // Sync with our database
    await syncProfile(userCredential.user.uid, fullName, email);
    
    // Refresh role
    const nextRole = await fetchRole(userCredential.user.uid);
    setRole(nextRole);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
