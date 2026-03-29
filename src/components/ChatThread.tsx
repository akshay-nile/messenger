import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import type { Message } from '../services/models';
import { getChatThread, sendMessage } from '../services/service';
import { loaderStyle } from '../services/utilities';
import Header from './Header';
import Layout from './Layout';
import MessageItem from './MessageItem';

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

    function onEnterOrEscapeKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            if (message.trim().length > 0) validateAndSendMessage();
            else refreshChatThread();
            return;
        }
        if (e.key === 'Escape' || e.key === 'Esc') setMessage('');
    }

    return (
        <Layout>
            <Header title={location.state.other.name} button={{ label: 'Close', action: () => navigate(-1) }} />

            {
                loading
                    ? <ProgressSpinner style={loaderStyle} strokeWidth='0.15rem' animationDuration='0.5s' />
                    : <ul>{
                        chatThread.map((message, i) =>
                            <li key={message.timestamp}>
                                <MessageItem message={message} other={location.state.other}
                                    showName={i > 0 ? chatThread[i - 1].sender !== message.sender : true} />
                            </li>)
                    }</ul>

            }

            <div className="p-inputgroup flex">
                <InputText placeholder='Type your message...' className='w-full'
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onKeyDown={onEnterOrEscapeKey} />
                <Button icon={`pi ${message.trim().length > 0 ? 'pi-arrow-up' : 'pi-arrow-down'}`}
                    onClick={() => message.trim().length > 0 ? validateAndSendMessage() : refreshChatThread()} />
            </div>
        </Layout>
    );
}

export default ChatThread;