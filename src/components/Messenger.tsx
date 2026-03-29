import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { User } from '../services/models';
import { deleteChatThread, getAllUsers, isLoggedIn, logout } from '../services/service';
import { loaderStyle } from '../services/utilities';
import Header from './Header';
import Layout from './Layout';

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
                    ? <ProgressSpinner style={loaderStyle} strokeWidth='0.15rem' animationDuration='0.5s' />
                    : <ul>
                        {users.map(other =>
                            <li key={other.email} className='my-4'>
                                <div className="flex justify-between items-center px-4 py-3 bg-gray-100 text-black rounded-lg hover:cursor-pointer shadow-xl group">
                                    <i className='pi pi-user me-2' style={{ zoom: '2.0' }} />
                                    <div className='w-full flex flex-col justify-center' onClick={() => navigate('/chat', { state: { other, user } })}>
                                        <span className='text-lg font-bold group-hover:text-purple-800'>{other.name}</span>
                                        <span className='text-xs font-medium'>{other.email}</span>
                                    </div>
                                    <div className='flex gap-2'>
                                        <Button icon='pi pi-trash' raised rounded onClick={() => deleteChatThread(other.email)} />
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>
            }

            <div></div>
        </Layout>
    );
}

export default Messenger;