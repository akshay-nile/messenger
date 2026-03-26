import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { logout } from '../services/service';

function Header() {
    const navigate = useNavigate();

    return (
        <div className='w-full md:w-[40%] mx-auto'>
            <header className='h-18 flex gap-4 justify-between border border-purple-500 rounded-lg p-4 m-4'>
                <div className='flex gap-4 items-center'>
                    <img src='./favicon.png' width={40} />
                    <span className='font-bold text-xl'>Messenger</span>
                </div>
                {
                    window.location.pathname === '/login' &&
                    <Button label='Register' size='small' onClick={() => navigate('/register')} />
                }
                {
                    window.location.pathname === '/register' &&
                    <Button label='Login' size='small' onClick={() => navigate('/login')} />
                }
                {
                    window.location.pathname === '/messenger' &&
                    <Button label='Logout' size='small' onClick={() => {
                        logout();
                        navigate('/login');
                    }} />
                }
            </header>
        </div>
    );
}

export default Header;