import {ThemeOptions} from '@mui/material/styles';
import {red} from '@mui/material/colors';

const lightThemeOptions: ThemeOptions = {
    palette: {
        mode: 'light',

        secondary: {
            main: red[500],
        },
    },
};

export default lightThemeOptions;
