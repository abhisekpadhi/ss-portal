import {ThemeOptions} from '@mui/material/styles';
import {red} from '@mui/material/colors';

const lightThemeOptions: ThemeOptions = {
    palette: {
        mode: 'light',
        secondary: {
            main: red[500],
            light: red[200],
        },
    },
};

export default lightThemeOptions;
