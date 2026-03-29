import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { Message } from '../services/models';
import { getChatThread, sendMessage } from '../services/service';
import Header from './Header';
import Layout from './Layout';

function ChatThread() {
    const navigate = useNavigate();
    const location = useLocation();

    const [loading, setLoading] = useState<boolean>(true);
    const [message, setMessage] = useState<string>('');
    const [chatThread, setChatThread] = useState<Message[]>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const data = await getChatThread(location.state.other.email);
            if (data) setChatThread(data);
            setLoading(false);
        })();
    }, [location.state.other.email]);

    function isMine(message: Message): boolean {
        return message.sender !== location.state.other.email;
    }

    function isTyping(): boolean {
        return message.trim().length > 0;
    }

    async function validateAndSendMessage() {
        const data = await sendMessage(location.state.other.email, message);
        if (data) {
            setChatThread(prev => [...prev, data]);
            setMessage('');
        }
    }

    async function refreshChatThread() {
        const data = await getChatThread(location.state.other.email, true);
        if (data) setChatThread(prev => [...prev, ...data]);
    }

    return (
        <Layout>
            <Header title={location.state.other.name} button={{ label: 'Close', action: () => navigate(-1) }} />

            {
                loading
                    ? <ProgressSpinner style={loaderStyle} strokeWidth='0.15rem' animationDuration='0.5s' />
                    : <ul>
                        {chatThread.map(m =>
                            <li key={m.timestamp} className={`
                                    flex p-4 my-4 rounded-2xl text-black font-bold
                                    ${isMine(m)
                                    ? 'justify-end bg-blue-300 rounded-br-none ms-20'
                                    : 'justify-start bg-yellow-100 rounded-bl-none me-20'
                                }  
                                `}>{m.message}</li>)}
                    </ul>

            }

            <div className="p-inputgroup flex">
                <InputText placeholder='Type your message...' className='w-full'
                    value={message}
                    onChange={e => setMessage(e.target.value)} />
                <Button icon={`pi ${isTyping() ? 'pi-arrow-up' : 'pi-arrow-down'}`}
                    onClick={() => isTyping() ? validateAndSendMessage() : refreshChatThread()} />
            </div>
        </Layout>
    );
}

export default ChatThread;

const loaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '66vh',
    width: '40%'
};