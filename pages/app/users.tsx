import type {NextPage} from 'next';
import AgentsScreen from '../../src/workflows/agents/AgentsScreen';
import UserAccountsScreen from '../../src/workflows/users/UserAccountsScreen';

const Users: NextPage = () => {
    return <UserAccountsScreen />;
};

export default Users;
