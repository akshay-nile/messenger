import { useCallback, useEffect, useRef } from 'react';
import { clearSDP, getSDP, postSDP, sendMessage, waitForIceGatheringCompletion } from '../services/connex';
import type { Status } from '../services/models';

function useStatusExchange(email: string, other: string, onStatusReceived: (status: Status) => void) {
    const pcRef = useRef<RTCPeerConnection>(null);
    const dcRef = useRef<RTCDataChannel>(null);
    const msRef = useRef<MediaStream>(null);
    const pollingRef = useRef<boolean>(true);

    const sendStatus = useCallback((status: Status) => {
        if (dcRef.current) sendMessage(dcRef.current, status);
        if (msRef.current) msRef.current.getAudioTracks().forEach(track => track.enabled = status === 'speaking');
    }, []);

    const disconnect = useCallback(() => {
        pollingRef.current = false;
        if (msRef.current) {
            msRef.current.getTracks().forEach(track => track.stop());
            msRef.current = null;
        }
        if (dcRef.current) {
            sendStatus('offline');
            onStatusReceived('offline');
            dcRef.current.close();
            dcRef.current = null;
        }
        if (pcRef.current) {
            pcRef.current.close();
            pcRef.current = null;
            clearSDP();
        }
    }, [onStatusReceived, sendStatus]);

    useEffect(() => {
        onStatusReceived('offline');

        function onOpen(pc: RTCPeerConnection, dc: RTCDataChannel) {
            pcRef.current = pc;
            dcRef.current = dc;
            onStatusReceived('online');
            clearSDP();
        };

        function onMessage(status: Status) {
            onStatusReceived(status);
            if (status === 'offline') disconnect();
        }

        async function connect() {
            const pc = new RTCPeerConnection();

            pc.ontrack = (e: RTCTrackEvent) => {
                const audio = new Audio();
                audio.srcObject = e.streams[0];
                audio.autoplay = true;
            };
            pc.onconnectionstatechange = () => {
                const states = ['closed', 'disconnected', 'failed', undefined];
                if (states.includes(pc.connectionState)) disconnect();
            };

            msRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            msRef.current.getAudioTracks().forEach(track => {
                pc.addTrack(track, msRef.current!);
                track.enabled = false;
            });

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
            pollingRef.current = await postSDP(pc.localDescription, email);

            while (pollingRef.current && pc.remoteDescription === null) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                const answer = await getSDP('answer', email);
                if (answer && answer.email === other) await pc.setRemoteDescription(answer.sdp);
            }

            if (pc.remoteDescription === null) {
                pc.close();
                disconnect();
            }
        }

        connect();
        return disconnect;
    }, [email, other, onStatusReceived, disconnect]);

    return { sendStatus, disconnect };
}

export default useStatusExchange;