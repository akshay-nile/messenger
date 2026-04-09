import { useCallback, useEffect, useRef } from 'react';
import { getSDP, postSDP, sendMessage, waitForIceGatheringCompletion } from '../services/connex';
import type { Status } from '../services/models';

function useStatusExchange(email: string, onStatusReceived: (status: Status) => void) {
    const pcRef = useRef<RTCPeerConnection>(null);
    const dcRef = useRef<RTCDataChannel>(null);

    const sendStatus = useCallback((status: Status) => {
        if (dcRef.current) sendMessage(dcRef.current, status);
    }, []);

    const disconnect = useCallback(() => {
        if (dcRef.current) {
            sendStatus('offline');
            onStatusReceived('offline');
            dcRef.current.close();
            dcRef.current = null;
        }
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
            postSDP(null, '');
        }
    }, [onStatusReceived, sendStatus]);

    useEffect(() => {
        onStatusReceived('offline');

        function onOpen(pc: RTCPeerConnection, dc: RTCDataChannel) {
            pcRef.current = pc;
            dcRef.current = dc;
            onStatusReceived('online');
            postSDP(null, email);
        };

        function onMessage(status: Status) {
            onStatusReceived(status);
            if (status === 'offline') disconnect();
        }

        async function connect() {
            const pc = new RTCPeerConnection();
            pc.onconnectionstatechange = () => {
                const states = ['closed', 'disconnected', 'failed', undefined];
                if (states.includes(pc.connectionState)) disconnect();
            };

            const offer = await getSDP('offer', email);
            if (offer) {
                pc.ondatachannel = (e: RTCDataChannelEvent) => {
                    const dc = e.channel;
                    dc.onopen = () => onOpen(pc, dc);
                    dc.onmessage = (e: MessageEvent<Status>) => onMessage(e.data);
                };
                await pc.setRemoteDescription(offer.sdp);
                await pc.setLocalDescription(await pc.createAnswer());
            } else {
                const dc = pc.createDataChannel('STATUS');
                dc.onopen = () => onOpen(pc, dc);
                dc.onmessage = (e: MessageEvent<Status>) => onMessage(e.data);
                await pc.setLocalDescription(await pc.createOffer());
            }

            await waitForIceGatheringCompletion(pc);
            const isPosted = await postSDP(pc.localDescription, email);

            while (isPosted && pc.remoteDescription === null) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                const answer = await getSDP('answer', email);
                if (answer) await pc.setRemoteDescription(answer.sdp);
            }
        }

        connect();
        return disconnect;
    }, [email, onStatusReceived, disconnect]);

    return { sendStatus, disconnect };
}

export default useStatusExchange;