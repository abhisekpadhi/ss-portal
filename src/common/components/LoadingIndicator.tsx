import { useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";
import Box from '@mui/material/Box';

export default function LoadingIndicator() {
    return (
        <Box sx={{ position: 'absolute', bottom: 20, right: 10, width: 60, height: 40, display: 'flex', alignItems: 'center'}}>
            <PacmanLoader
                color={'#000'}
                loading={true}
                size={12}
            />
        </Box>

    );
}
