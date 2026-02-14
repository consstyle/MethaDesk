'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Projekt, User } from '@/types';
import { mockStore } from '@/lib/mock/store';
import { useRouter, usePathname } from 'next/navigation';

interface ProjektContextType {
    activeProjekt: Projekt | null;
    setActiveProjekt: (projekt: Projekt | null) => void;
    currentUser: User | null;
    setCurrentUser: (user: User | null) => void;
    loading: boolean;
}

const ProjektContext = createContext<ProjektContextType | undefined>(undefined);

export function ProjektProvider({ children }: { children: React.ReactNode }) {
    const [activeProjekt, _setActiveProjekt] = useState<Projekt | null>(null);
    const [currentUser, _setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedUser = mockStore.getCurrentUser();
        const storedProjekt = mockStore.getActiveProjekt();

        if (storedUser) _setCurrentUser(storedUser);
        if (storedProjekt) _setActiveProjekt(storedProjekt);

        setLoading(false);
    }, []);

    const setActiveProjekt = useCallback((projekt: Projekt | null) => {
        _setActiveProjekt(projekt);
        mockStore.setActiveProjekt(projekt);
    }, []);

    const setCurrentUser = useCallback((user: User | null) => {
        _setCurrentUser(user);
    }, []);

    // Auth Guard (simulated)
    useEffect(() => {
        if (!loading && !currentUser && pathname !== '/' && pathname !== '/login' && pathname !== '/register') {
            router.push('/login');
        }
    }, [currentUser, loading, pathname, router]);

    return (
        <ProjektContext.Provider value={{
            activeProjekt,
            setActiveProjekt,
            currentUser,
            setCurrentUser,
            loading
        }}>
            {children}
        </ProjektContext.Provider>
    );
}

export function useProjekt() {
    const context = useContext(ProjektContext);
    if (context === undefined) {
        throw new Error('useProjekt must be used within a ProjektProvider');
    }
    return context;
}
