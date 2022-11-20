import React from 'react';
import {Box, Tab, Tabs, Typography} from '@mui/material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const {children, value, index, ...other} = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}>
            {value === index && (
                <Box sx={{p: 3}}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function VaultTabs(props: {tabs: {label: string; content: React.ReactNode}[]}) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="vault tabs">
                    {props.tabs.map((tab, index) => (
                        <Tab
                            key={'tabLabel-' + index}
                            label={tab.label}
                            {...a11yProps(index)}
                        />
                    ))}
                </Tabs>
            </Box>
            {props.tabs.map((tab, index) => (
                <TabPanel key={'tab-' + index} value={value} index={index}>
                    {tab.content}
                </TabPanel>
            ))}
        </Box>
    );
}

export default VaultTabs;
