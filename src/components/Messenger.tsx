import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { User } from '../services/models';
import { getAllUsers, isLoggedIn, logout } from '../services/service';
import { loaderStyle } from '../services/utilities';
import Header from './Header';
import Layout from './Layout';
import UserItem from './UserItem';

function Messenger() {
    const navigate = useNavigate();

    const [user, setUser] = useState<User>();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const email = isLoggedIn();
        if (!email) navigate('/login');
        else (async () => {
            setLoading(true);
            const data = await getAllUsers();
            if (data) {
                setUser(data.find(u => u.email === email));
                setUsers(data.filter(u => u.email !== email));
            }
            setLoading(false);
        })();
    }, [navigate]);

    return (
        <Layout>
            <Header title={user?.name} button={{ label: 'Logout', action: () => { logout(); navigate('/login'); } }} />

            {
                loading
                    ? <ProgressSpinner style={loaderStyle} strokeWidth="0.15rem" animationDuration="0.5s" />
                    : <ul>{users.map(other => <li key={other.email}><UserItem other={other} user={user!} /></li>)}</ul>
            }

            <div></div>
        </Layout>
    );
}

export default Messenger;