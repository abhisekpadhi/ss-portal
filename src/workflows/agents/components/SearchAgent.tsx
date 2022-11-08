import Box from '@mui/material/Box';
import {useState} from 'react';
import {notify} from '../../../common/lib/utils';
import {getAgent} from '../api';
import {IAgent} from 'models/agent';
import CustomButton from '../../../common/components/CustomButton';
import CustomTextField from '../../../common/components/CustomTextField';

function SearchAgent() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<IAgent | null>(null);
    const searchAgent = async () => {
        setLoading(true);
        try {
            const resp = await getAgent({phone: text});
            console.log('resp', resp);
            if (resp.data.agent === null) {
                notify({
                    message: 'Agent not found!',
                    severity: 'error',
                });
                setLoading(false);
                return;
            }
            setResult(resp.data.agent);
            setLoading(false);
            setText('');
        } catch (e) {
            notify({
                message: 'Failed to search, server error',
                severity: 'error',
            });
            setLoading(false);
        }
    };
    const canSubmit = () => {
        return text.length === 10;
    };
    return (
        <Box>
            <Box>
                <Box>
                    <CustomTextField
                        id={'agentPhoneInput'}
                        label={'Agent phone'}
                        value={text}
                        onChange={text => setText(text.replace(/[^0-9.]/g, ''))}
                        helperText={'Agent phone must be 10 digits'}
                        placeholder={'Enter 10-digit phone number'}
                        inputProps={{
                            type: 'number',
                            max: 9999999999,
                        }}
                        style={{
                            width: 360,
                        }}
                    />
                </Box>
                <Box mt={2}>
                    <CustomButton
                        disabled={!canSubmit()}
                        label={'Search agent'}
                        progress={loading}
                        onClick={searchAgent}
                    />
                </Box>
            </Box>
            <Box display={'flex'} flexDirection={'column'} mt={2}>
                {result !== null &&
                    Object.keys(result).map(key => (
                        <Box key={key}>
                            {key}: {(result as {[k: string]: any})[key] ?? ''}
                        </Box>
                    ))}
            </Box>
        </Box>
    );
}

export default SearchAgent;
