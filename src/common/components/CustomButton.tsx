import {BeatLoader} from 'react-spinners';
import {COLORS} from '../../constants';
import Button from '@mui/material/Button';

function CustomButton(props: {
    disabled?: boolean;
    label: string;
    progress: boolean;
    onClick: () => void;
    color?: 'primary' | 'secondary';
    variant?: 'contained' | 'outlined';
    style?: object;
}) {
    return (
        <Button
            color={props.color ?? 'primary'}
            disabled={props.disabled || props.progress}
            onClick={props.onClick}
            variant={props.variant ?? 'contained'}
            sx={{
                textTransform: 'none',
                width: 240,
                height: 46,
                ...props.style,
            }}>
            {props.progress ? (
                <BeatLoader size={12} color={COLORS.theme} />
            ) : (
                props.label
            )}
        </Button>
    );
}

export default CustomButton;
