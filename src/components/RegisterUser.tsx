import { sha256 } from 'js-sha256';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { UserRegistration } from '../services/models';
import { checkUserExists, registerUser } from '../services/service';
import Layout from './Layout';
import Header from './Header';

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
        const data = await checkUserExists(email);
        setEmailAlreadyTaken(data !== null && data.exists);
    }

    async function validateAndRegisterUser(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        if (emailAlreadyTaken) return;
        const data = await registerUser({ ...user, password: sha256(user.password) });
        if (data && data.registered) navigate('/login');
    }

    return (
        <Layout>
            <Header
                subtitle="Create a new user account"
                button={{ label: 'Login', action: () => navigate('/login') }} />

            <form id="register-form" onSubmit={validateAndRegisterUser} className="flex flex-col gap-8 bg-gray-100 px-4 py-5 text-black rounded-lg">
                <div className="flex flex-col gap-2">
                    <label htmlFor="name">Full Name</label>
                    <InputText id="name" required aria-describedby="name-help"
                        value={user.name}
                        onChange={e => setUser({ ...user, name: titleCase(e.target.value), email: guessEmail(e.target.value) })} />
                    <small id="name-help" className="text-xs">Enter your firstname and lastname.</small>
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="email">Email ID</label>
                    <InputText id="email" required aria-describedby="email-help"
                        value={user.email.toLowerCase()}
                        onChange={e => setUser({ ...user, email: e.target.value })}
                        onFocus={() => setEmailAlreadyTaken(false)}
                        onBlur={e => checkEmailAlreadyTaken(e.target.value.trim())} />
                    {
                        emailAlreadyTaken
                            ? <small id="email-help" className="text-xs text-red-400">
                                User with this email id already exists.
                            </small>
                            : <small id="email-help" className="text-xs">Enter your email id.</small>
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
                    <small id="password-help" className="text-xs">Create your password.</small>
                </div>
            </form>

            <Button type="submit" form="register-form" label="Register" className="w-full self-center" />
        </Layout>
    );
}

export default RegisterUser;