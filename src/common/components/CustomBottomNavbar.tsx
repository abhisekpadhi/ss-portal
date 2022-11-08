import {styled} from '@mui/material/styles';
import {BottomNavigationProps} from '@mui/material';
import BottomNavigation from '@mui/material/BottomNavigation';

export const CustomBottomNavbar = styled(BottomNavigation)`
    -webkit-box-shadow: 0px -6px 14px -1px rgba(0,0,0,0.22);
    -moz-box-shadow: 0px -6px 14px -1px rgba(0,0,0,0.22);
    box-shadow: 0px -6px 14px -1px rgba(0,0,0,0.22);
` as typeof BottomNavigation;
