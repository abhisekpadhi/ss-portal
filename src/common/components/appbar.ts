import {styled} from '@mui/material/styles';
import AppBar, {AppBarProps} from '@mui/material/AppBar';
import {commonGradient} from '../../../styles/common-styles';

export const AppBarThemed = styled(AppBar)<AppBarProps>`
    background-image: ${commonGradient};
` as typeof AppBar;
