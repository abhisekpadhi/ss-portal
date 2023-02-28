import React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {Button} from '@mui/material';
import AlertDialog, {AlertDialogProps} from './alert-dialog';
import {signOut, useSession} from 'next-auth/react';
import {useRouter} from 'next/router';
import SchoolIcon from '@mui/icons-material/School';
import ShieldIcon from '@mui/icons-material/Shield';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import PreviewIcon from '@mui/icons-material/Preview';
import {COLORS} from '../../constants';

const drawerWidth = 240;
const pathsToHideNav = ['/login', '/'];

const paths = [
    {
        path: '/app/agents',
        name: 'Agents',
        icon: <SupportAgentIcon />,
    },
    {
        path: '/app/trustee',
        name: 'Trustee',
        icon: <PreviewIcon />,
    },
    {
        path: '/app/vault',
        name: 'Vault',
        icon: <ShieldIcon />,
    },
    {
        path: '/app/learn',
        name: 'learn',
        icon: <SchoolIcon />,
    },
];

function Layout(props: {children: JSX.Element}) {
    const {status} = useSession();
    const router = useRouter();
    const isLoginScreen = pathsToHideNav.includes(router.pathname);
    const [dialog, setDialog] =
        React.useState<Partial<AlertDialogProps> | null>(null);
    const handleLogout = () => {
        setDialog({
            title: 'Do you want to logout?',
            status: 'warning',
            buttons: {
                agreeLabel: 'Logout',
                onAgree: () => {
                    (async () => {
                        await signOut({callbackUrl: '/login'});
                    })();
                },
                disagreeLabel: 'Stay logged-in',
                onDisagree: () => {
                    setDialog(null);
                },
                agreeIsDanger: true,
            },
        });
    };
    if (isLoginScreen || status !== 'authenticated') {
        return (
            <Box component="main" sx={{flexGrow: 1}}>
                {props.children}
            </Box>
        );
    }
    return (
        <Box sx={{display: 'flex'}}>
            <AppBar
                position="fixed"
                sx={{zIndex: theme => theme.zIndex.drawer + 1}}>
                <Toolbar sx={{backgroundColor: '#567474'}}>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        SureSampatti Admin
                    </Typography>
                    <Button onClick={handleLogout} color="inherit">
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}>
                <Toolbar />
                <Box sx={{overflow: 'auto'}}>
                    <List>
                        {paths.map((item, index) => (
                            <ListItem
                                style={{
                                    backgroundColor:
                                        window.location.pathname === item.path
                                            ? COLORS.offWhite
                                            : 'inherit',
                                }}
                                key={item.name}
                                disablePadding>
                                <ListItemButton
                                    onClick={() => {
                                        router.push(item.path).then(_ => {});
                                    }}>
                                    <ListItemIcon>{item.icon}</ListItemIcon>
                                    <ListItemText primary={item.name} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
            <Box component="main" sx={{flexGrow: 1, p: 3}}>
                <Toolbar />
                {props.children}
            </Box>
            {dialog && (
                <AlertDialog
                    open={dialog.title ? dialog.title.length > 0 : false}
                    onClose={() => setDialog(null)}
                    title={dialog?.title || ''}
                    body={dialog.body || ''}
                    status={dialog.status || 'info'}
                    {...dialog}
                />
            )}
        </Box>
    );
}

export default Layout;
