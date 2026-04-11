import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import useStatusExchange from '../hooks/useStatusExchange';
import type { Message, Status } from '../services/models';
import { getChatThread, sendMessage } from '../services/service';
import { loaderStyle, scrollToBottom } from '../services/utilities';
import Footer from './Footer';
import Header from './Header';
import Layout from './Layout';
import MessageItem from './MessageItem';

function ChatThread() {
    const navigate = useNavigate();
    const location = useLocation();

    const [status, setStatus] = useState<Status>('offline');
    const [loading, setLoading] = useState<boolean>(true);
    const [typing, setTyping] = useState<boolean>(false);
    const [speaking, setSpeaking] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [chatThread, setChatThread] = useState<Message[]>([]);

    useEffect(() => { setTyping(message.trim().length > 0); }, [message]);

    const refreshChatThread = useCallback(async () => {
        const data = await getChatThread(location.state.other.email, true);
        if (data) {
            setChatThread(prev => [...prev, ...data]);
            scrollToBottom();
        }
    }, [location.state.other.email]);

    const { sendStatus, disconnect } = useStatusExchange(
        location.state.user.email,
        location.state.other.email,
        useCallback(async (status: Status) => {
            setStatus(status);
            if (status === 'refresh') await refreshChatThread();
        }, [refreshChatThread])
    );

    useEffect(() => {
        sendStatus(message.length > 0 ? 'typing' : 'online');
    }, [message, sendStatus]);

    useEffect(() => {
        let cleanup = false;

        (async () => {
            setLoading(true);
            const data = await getChatThread(location.state.other.email);
            if (data) setChatThread(data);
            setLoading(false);
            scrollToBottom();
            cleanup = true;
        })();

        if (cleanup) return disconnect;
    }, [location.state.other.email, disconnect]);

    async function validateAndSendMessage() {
        const data = await sendMessage(location.state.other.email, message);
        if (data) {
            setChatThread(prev => [...prev, data]);
            sendStatus('refresh');
            setMessage('');
            scrollToBottom();
        }
    }

    function onEnterOrEscapeKey(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            if (message.trim().length > 0) validateAndSendMessage();
            else refreshChatThread();
            return;
        }
        if (e.key === 'Escape' || e.key === 'Esc') setMessage('');
    }

    function sendSpeaking(enabled: boolean) {
        sendStatus(enabled ? 'speaking' : 'online');
        setSpeaking(enabled);
    }

    return (
        <Layout>
            <Header
                title={location.state.other.name}
                subtitle={status}
                button={{ label: 'Close', action: () => navigate(-1) }} />

            {
                loading
                    ? <ProgressSpinner style={loaderStyle} strokeWidth="0.15rem" animationDuration="0.5s" />
                    : <ul className="mx-8 my-auto overflow-y-hidden">
                        {
                            chatThread.map((message, i) =>
                                <li key={message.timestamp}>
                                    <MessageItem message={message} other={location.state.other}
                                        showName={i > 0 ? chatThread[i - 1].sender !== message.sender : true} />
                                </li>
                            )
                        }
                    </ul>

            }

            <Footer>
                <div className="p-inputgroup flex">
                    <InputText className="w-full"
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        onKeyDown={onEnterOrEscapeKey}
                        disabled={speaking}
                        placeholder={speaking ? 'Speak now...' : 'Type your message...'} />
                    {
                        (typing || status === 'offline')
                            ? <Button icon={`pi ${typing ? 'pi-arrow-up' : 'pi-arrow-down'}`}
                                onClick={() => typing ? validateAndSendMessage() : refreshChatThread()} />
                            : <Button icon="pi pi-microphone"
                                onMouseDown={() => sendSpeaking(true)} onTouchStart={() => sendSpeaking(true)}
                                onMouseUp={() => sendSpeaking(false)} onTouchEnd={() => sendSpeaking(false)}
                                onMouseLeave={() => sendSpeaking(false)} />
                    }
                </div>
            </Footer>
        </Layout>
    );
}

export default ChatThread;