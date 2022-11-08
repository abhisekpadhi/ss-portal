import Box from '@mui/material/Box';
import {useState} from 'react';
import Button from '@mui/material/Button';
import {notify} from '../../../common/lib/utils';
import {addAgent, getAgent, removeAgent} from '../api';
import {IAddAgentRequest, IAgent, IAgentRemoveRequest} from 'models/agent';
import {BeatLoader} from 'react-spinners';
import {COLORS} from '../../../constants';
import CustomTextField from '../../../common/components/CustomTextField';
import CustomButton from '../../../common/components/CustomButton';

function RemoveAgent() {
    const [text, setText] = useState('');
    const [progress, setProgress] = useState(false);
    const reset = () => {
        setText('');
    };
    const handleRemoveAgent = async () => {
        setProgress(true);
        try {
            const payload: IAgentRemoveRequest = {
                agentId: text,
            };
            const resp = await removeAgent(payload);
            console.log('resp', resp);
            if ('message' in resp.data && resp.data.message === 'ok') {
                notify({
                    message: 'Agent removed',
                    severity: 'success',
                });
                reset();
            } else {
                notify({
                    message: 'Failed to remove Agent',
                    severity: 'error',
                });
                console.debug('resp', resp);
            }
            setProgress(false);
        } catch (e) {
            notify({
                message: 'Failed to remove agent, server error',
                severity: 'error',
            });
            setProgress(false);
            console.debug('err', e);
        }
    };
    const canSubmit = () => {
        return text.length > 0;
    };
    return (
        <Box>
            <Box>
                <CustomTextField
                    id={'agentNameInput'}
                    label={'Agent ID'}
                    placeholder={'Enter agent id to remove'}
                    value={text}
                    onChange={text => setText(text)}
                    style={{
                        width: 328,
                    }}
                />
            </Box>
            <Box mt={2}>
                <CustomButton
                    color={'secondary'}
                    disabled={!canSubmit()}
                    label={'Remove agent'}
                    progress={progress}
                    onClick={handleRemoveAgent}
                />
            </Box>
        </Box>
    );
}

export default RemoveAgent;
