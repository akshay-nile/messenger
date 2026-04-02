import { sha256 } from 'js-sha256';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import type { UserLogin } from '../services/models';
import { isLoggedIn, loginUser } from '../services/service';
import Layout from './Layout';
import Header from './Header';

function LoginUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserLogin>({ email: '', password: '' });

    useEffect(() => { if (isLoggedIn()) navigate('/messenger'); }, [navigate]);

    async function validateAndLoginUser(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const loggedIn = await loginUser({ ...user, password: sha256(user.password) });
        if (loggedIn) navigate('/messenger');
        else setUser({ email: '', password: '' });
    }

    return (
        <Layout>
            <Header button={{ label: 'Register', action: () => navigate('/register') }} />

            <form id="login-form" onSubmit={validateAndLoginUser} className="flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email ID</label>
                    <InputText id="email" required aria-describedby="email-help"
                        value={user.email.toLowerCase()}
                        onChange={e => setUser({ ...user, email: e.target.value })} />
                    <small id="email-help" className="text-xs">Enter your email id.</small>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="password">Password</label>
                    <Password id="password" required aria-describedby="password-help" toggleMask
                        value={user.password}
                        onChange={e => setUser({ ...user, password: e.target.value })}
                        feedback={false}
                        minLength={4}
                        pt={{
                            root: { className: 'w-full flex items-center relative' },
                            input: { className: 'w-full' },
                            iconField: { root: { className: 'w-full' } },
                            showIcon: { className: 'absolute right-2 cursor-pointer flex items-center justify-center' },
                            hideIcon: { className: 'absolute right-2 cursor-pointer flex items-center justify-center' }
                        }} />
                    <small id="password-help" className="text-xs">Enter your password.</small>
                </div>
            </form>

            <Button type="submit" form="login-form" label="Login" className="w-full self-center" />
        </Layout>
    );
}

export default LoginUser;