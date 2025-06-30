"use client"
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@base/contexts/AuthContext';

export default function PrivateRoute({ children }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.push('/auth/login');
    }, [user]);

    return user ? children : null;
}