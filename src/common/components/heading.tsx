import React from 'react';
import {styled} from '@mui/material/styles';
import {ThemedDivider} from './ThemedDivider';
import Typography from '@mui/material/Typography';

export const HeadingText = styled(Typography)`
    font-size: 24px;
    font-weight: bold;
` as typeof Typography;

export const Heading = (props: {text: string}) => (
    <>
        <HeadingText variant={'h2'}>{props.text}</HeadingText>
        <ThemedDivider sx={{mb: 1}}/>
    </>
)
