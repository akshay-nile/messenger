import { sha256 } from 'js-sha256';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { UserLogin } from '../services/models';
import { loginUser } from '../services/service';
import Layout from './Layout';

function LoginUser() {
    const navigate = useNavigate();
    const [user, setUser] = useState<UserLogin>({ email: '', password: '' });

    async function validateAndLoginUser(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const isLoggedIn = await loginUser({ ...user, password: sha256(user.password) });
        if (isLoggedIn) navigate('/messenger');
        else setUser({ email: '', password: '' });
    }

    return (
        <form onSubmit={validateAndLoginUser}>
            <Layout>
                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email ID</label>
                    <InputText id="email" required aria-describedby="email-help"
                        value={user.email}
                        onChange={e => setUser({ ...user, email: e.target.value })} />
                    <small id="email-help" className='text-xs'>Enter your email id.</small>
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
                    <small id="password-help" className='text-xs'>Enter your password.</small>
                </div>

                <div className="flex justify-center mt-8">
                    <Button type='submit' label='Login' className='w-[50%]' />
                </div>
            </Layout>
        </form>
    );
}

export default LoginUser;