'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange, signOut as firebaseSignOut } from '@/lib/firebase';
import { loginOrRegister, getUserProfile } from '@/lib/api';

interface UserProfile {
    id: number;
    firebase_uid: string;
    email: string;
    in_game_name: string | null;
    tagline: string | null;
    avatar_url: string | null;
    created_at: string;
    ranks?: any[];
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                try {
                    // Login or register with backend
                    const response = await loginOrRegister();

                    if (response.user) {
                        // Fetch full user profile with ranks
                        const profile = await getUserProfile(response.user.id);
                        setUserProfile(profile.user);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const refreshProfile = async () => {
        if (userProfile) {
            try {
                const profile = await getUserProfile(userProfile.id);
                setUserProfile(profile.user);
            } catch (error) {
                console.error('Error refreshing profile:', error);
            }
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut();
            setUser(null);
            setUserProfile(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
