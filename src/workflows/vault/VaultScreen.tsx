import React from 'react';
import {Container} from '@mui/material';
import VaultTabs from './components/VaultTabs';
import Taxonomy from './components/Taxonomy';
import Data from './components/Data';

function VaultScreen() {
    return (
        <Container>
            <VaultTabs
                tabs={[
                    {
                        label: 'Taxonomy',
                        content: <Taxonomy />,
                    },
                    {
                        label: 'Data',
                        content: <Data />,
                    },
                ]}
            />
        </Container>
    );
}

export default VaultScreen;
