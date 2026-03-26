import { sha256 } from 'js-sha256';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import type { UserRegistration } from '../services/models';
import { getCurrentUser, registerUser } from '../services/service';
import { useNavigate } from 'react-router';
import Layout from './Layout';

function RegisterUser() {
    const navigate = useNavigate();

    const [user, setUser] = useState<UserRegistration>({ name: '', email: '', password: '' });
    const [emailAlreadyTaken, setEmailAlreadyTaken] = useState<boolean>(false);

    function titleCase(name: string): string {
        return name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.substring(1).toLowerCase())
            .join(' ');
    }

    function guessEmail(name: string): string {
        return name.trim().replaceAll(' ', '').toLowerCase() + '@email.com';
    }

    async function checkEmailAlreadyTaken(email: string) {
        if (!email) return;
        if (await getCurrentUser(email)) setEmailAlreadyTaken(true);
    }

    async function validateAndRegisterUser(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (emailAlreadyTaken) return;
        const data = await registerUser({ ...user, password: sha256(user.password) });
        if (data && data.registered) navigate('/login');
    }

    return (
        <form onSubmit={validateAndRegisterUser}>
            <Layout>
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Full Name</label>
                    <InputText id="name" required aria-describedby="name-help"
                        value={user.name}
                        onChange={e => setUser({ ...user, name: titleCase(e.target.value), email: guessEmail(e.target.value) })} />
                    <small id="name-help" className='text-xs'>Enter your firstname and lastname.</small>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email ID</label>
                    <InputText id="email" required aria-describedby="email-help"
                        value={user.email}
                        onChange={e => setUser({ ...user, email: e.target.value })}
                        onFocus={() => setEmailAlreadyTaken(false)}
                        onBlur={e => checkEmailAlreadyTaken(e.target.value.trim())} />
                    {
                        emailAlreadyTaken
                            ? <small id="email-help" className='text-xs text-red-400'>
                                User with this email id already exists.
                            </small>
                            : <small id="email-help" className='text-xs'>Enter your email id.</small>
                    }
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
                    <small id="password-help" className='text-xs'>Create your password.</small>
                </div>

                <div className="flex justify-center mt-8">
                    <Button type='submit' label='Register' className='w-[50%]' />
                </div>
            </Layout>
        </form>
    );
}

export default RegisterUser;