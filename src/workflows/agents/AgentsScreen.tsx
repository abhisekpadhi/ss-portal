import Container from '@mui/material/Container';
import {Tabs} from '@mui/material';
import {useState} from 'react';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchAgent from './components/SearchAgent';
import AddAgent from './components/AddAgent';
import RemoveAgent from './components/RemoveAgent';
import GetAllAgentsTable from './components/GetAllAgentsTable';

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

function AgentsScreen() {
    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    return (
        <Container>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="basic tabs example">
                    <Tab label="All agents" {...a11yProps(0)} />
                    <Tab label="Search agent" {...a11yProps(1)} />
                    <Tab label="Add agent" {...a11yProps(2)} />
                    <Tab label="Remove agent" {...a11yProps(3)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <GetAllAgentsTable />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <SearchAgent />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <AddAgent />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <RemoveAgent />
            </TabPanel>
        </Container>
    );
}

export default AgentsScreen;
