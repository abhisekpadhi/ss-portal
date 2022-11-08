import type {NextPage} from 'next';
import Box from '@mui/material/Box';
import {useSession} from 'next-auth/react';

const Home: NextPage = () => {
    const {data: session} = useSession();
    return (
        <Box sx={{fontSize: 20}}>👋 Welcome {session?.user?.email ?? ''}</Box>
    );
};

export default Home;
