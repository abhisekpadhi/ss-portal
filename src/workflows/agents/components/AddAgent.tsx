import Box from '@mui/material/Box';
import {useState} from 'react';
import {notify} from '../../../common/lib/utils';
import {addAgent, getAgent} from '../api';
import CustomButton from '../../../common/components/CustomButton';
import CustomTextField from '../../../common/components/CustomTextField';
import {IAddAgentRequest} from 'models/agent';

function AddAgent() {
    const [agentName, setAgentName] = useState('');
    const [agentPhone, setAgentPhone] = useState('');
    const [progress, setProgress] = useState(false);
    const reset = () => {
        setAgentPhone('');
        setAgentName('');
    };
    const handleAddAgent = async () => {
        setProgress(true);
        try {
            const payload: IAddAgentRequest = {
                fullName: agentName,
                phone: agentPhone,
            };
            const resp = await addAgent(payload);
            console.log('resp', resp);
            if ('agent' in resp.data && resp.data.agent !== null) {
                notify({
                    message: 'Agent added',
                    severity: 'success',
                });
                reset();
            } else {
                notify({
                    message: 'Failed to add Agent',
                    severity: 'error',
                });
                console.debug('resp', resp);
            }
            setProgress(false);
        } catch (e) {
            notify({
                message: 'Failed to add agent, server error',
                severity: 'error',
            });
            setProgress(false);
            console.debug('err', e);
        }
    };
    const canSubmit = () => {
        return agentName.length > 3 && agentPhone.length == 10;
    };
    return (
        <Box>
            <Box
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                marginBottom={3}>
                <CustomTextField
                    id={'agentNameInput'}
                    label={'Agent name'}
                    value={agentName}
                    onChange={text => setAgentName(text)}
                    helperText={'Agent name must be longer than 3 letters'}
                />
            </Box>
            <Box
                display={'flex'}
                flexDirection={'row'}
                alignItems={'center'}
                marginBottom={3}>
                <CustomTextField
                    id={'agentPhoneInput'}
                    label={'Agent phone'}
                    value={agentPhone}
                    onChange={text =>
                        setAgentPhone(text.replace(/[^0-9.]/g, ''))
                    }
                    helperText={'Agent phone must be 10 digits'}
                    inputProps={{
                        type: 'number',
                        max: 9999999999,
                    }}
                />
            </Box>
            <Box display={'flex'} flexDirection={'column'}>
                <CustomButton
                    disabled={!canSubmit()}
                    label={'Add agent'}
                    progress={progress}
                    onClick={handleAddAgent}
                />
                <Box sx={{fontSize: 12, marginTop: 2}}>
                    *Adding multiple agents with same number is a no-op.
                </Box>
            </Box>
        </Box>
    );
}

export default AddAgent;
