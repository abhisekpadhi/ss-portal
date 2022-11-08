import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

function Index() {
    const { data: session } = useSession();
    const router = useRouter();
    useEffect(() => {
        console.log('session - index', session);
        if (session === null || session === undefined) {
            router.push('/login').then((_) => {});
        } else {
            router.push('/app').then((_) => {});
        }
    }, []);
}

export default Index;
