import {InputBaseProps, TextField, TextFieldProps} from '@mui/material';
import {useState} from 'react';

type Props = {
    id: string;
    value: string;
    label?: string;
    variant?: 'standard' | 'filled' | 'outlined';
    onChange?: (text: string) => void;
    error?: boolean;
    helperText?: string;
    style?: React.CSSProperties;
    inputProps?: InputBaseProps['inputProps'];
    placeholder?: string;
    multiline?: boolean;
    rows?: number;
    disabled?: boolean;
};

function CustomTextField(props: Props) {
    const handleOnChange = (newValue: string) => {
        props.onChange && props.onChange(newValue);
    };
    return (
        <TextField
            id={props.id}
            label={props.label}
            variant={props.variant}
            value={props.value}
            onChange={e => handleOnChange(e.target.value)}
            style={props.style}
            error={props.error}
            helperText={props.helperText}
            inputProps={props.inputProps}
            placeholder={props.placeholder}
            multiline={props.multiline ?? false}
            rows={props.rows ?? 6}
            disabled={props.disabled ?? false}
            onWheel={event => {
                event.currentTarget.blur();
            }}
        />
    );
}

export default CustomTextField;
