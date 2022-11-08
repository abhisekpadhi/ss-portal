import {InputBaseProps, TextField, TextFieldProps} from '@mui/material';
import {useState} from 'react';

type Props = {
    id: string;
    label: string;
    value: string;
    variant?: 'standard' | 'filled' | 'outlined';
    onChange?: (text: string) => void;
    error?: boolean;
    helperText?: string;
    style?: React.CSSProperties;
    inputProps?: InputBaseProps['inputProps'];
    placeholder?: string;
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
        />
    );
}

export default CustomTextField;
