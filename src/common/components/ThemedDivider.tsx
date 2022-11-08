import React from 'react';
import Box, {BoxProps} from '@mui/material/Box';
import {styled} from '@mui/material/styles';
import {Divider, DividerProps} from '@mui/material';
import WaterIcon from '@mui/icons-material/Water';
import {commonGradient} from '../../../styles/common-styles';

export const ThemedDivider = styled(Box)<BoxProps>({
    backgroundImage: commonGradient,
    height: 6,
    width: 120,
    borderRadius: 100,
});

export const DesignerDivider = (props: DividerProps) => (
    <Divider
        {...props}
    >
        <WaterIcon fontSize={'small'} sx={{ pt: 0.6}}/>
    </Divider>
)
