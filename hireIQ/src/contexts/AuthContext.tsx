import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { UserService, UserProfile } from '@/lib/userService';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  googleSignIn: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user profile when user changes
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    let isMounted = true;
    const loadProfile = async () => {
      try {
        const profile = await UserService.getUserProfile(user.uid);
        if (isMounted) {
          if (profile) {
            setUserProfile(profile);
          } else {
            // Create profile if it doesn't exist
            const emailToUse = user.email || '';
            const displayNameToUse = user.displayName || '';
            
            await UserService.createUserProfile(user.uid, emailToUse, {
              ...(displayNameToUse ? { displayName: displayNameToUse } : {}),
              ...(user.photoURL ? { photoURL: user.photoURL } : {}),
            });
            
            const newProfile = await UserService.getUserProfile(user.uid);
            if (isMounted) {
              setUserProfile(newProfile);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
        // Set a default profile if loading fails
        if (isMounted) {
          setUserProfile({
            uid: user.uid,
            email: user.email || '',
            displayName: user.displayName,
            photoURL: user.photoURL || undefined,
            createdAt: new Date(),
            lastLoginAt: new Date(),
            interviewStats: {
              totalInterviews: 0,
              averageScore: 0,
              completedInterviews: 0,
            },
            pastInterviews: [],
          });
        }
      }
    };

    loadProfile();
    
    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [user]);

  const signup = async (email: string, password: string, displayName?: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Create user profile in Firestore
    await UserService.createUserProfile(userCredential.user.uid, email, {
      ...(displayName || userCredential.user.displayName ? { displayName: displayName || userCredential.user.displayName } : {}),
      ...(userCredential.user.photoURL ? { photoURL: userCredential.user.photoURL } : {}),
    });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);

    // Create or update user profile in Firestore
    await UserService.createUserProfile(userCredential.user.uid, userCredential.user.email || '', {
      ...(userCredential.user.displayName ? { displayName: userCredential.user.displayName } : {}),
      ...(userCredential.user.photoURL ? { photoURL: userCredential.user.photoURL } : {}),
    });
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (user) {
      try {
        await UserService.updateUserProfile(user.uid, updates);
        // Add delay to ensure Firestore sync completes
        await new Promise(resolve => setTimeout(resolve, 500));
        // Reload profile by fetching fresh data
        const updatedProfile = await UserService.getUserProfile(user.uid);
        if (updatedProfile) {
          setUserProfile(updatedProfile);
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    }
  };

  const refreshProfile = async () => {
    if (user) {
      try {
        // Add delay to ensure Firestore sync completes
        await new Promise(resolve => setTimeout(resolve, 500));
        const updatedProfile = await UserService.getUserProfile(user.uid);
        if (updatedProfile) {
          setUserProfile(updatedProfile);
          console.log('Profile refreshed successfully:', updatedProfile);
        } else {
          console.warn('No profile found after refresh');
        }
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);

      if (user) {
        try {
          // Update last login time
          await UserService.updateLastLogin(user.uid);
        } catch (error) {
          console.error('Failed to update last login during auth initialization:', error);
        }
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    logout,
    signup,
    login,
    googleSignIn,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};