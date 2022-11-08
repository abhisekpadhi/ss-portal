import React from 'react';
import {styled} from '@mui/material/styles';
import {Fab, FabProps} from '@mui/material';

export const ThemedFab = styled(Fab)<FabProps>({
    backgroundImage: 'linear-gradient(to right, #6a11cb 0%, #2575fc 100%)',
});
