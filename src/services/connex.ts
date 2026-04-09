import type { SDP } from './models';

const baseURL = 'https://akshaynile.pythonanywhere.com/exchange';

export async function getSDP(type: 'offer' | 'answer', email: string): Promise<SDP | null> {
    const response = await fetch(baseURL);
    if (!response.ok) return null;
    const data = await response.json();
    if (data && data.email !== email && data.sdp?.type === type) return data;
    return null;
}

export async function postSDP(sdp: RTCSessionDescription | null, email: string): Promise<boolean> {
    const response = await fetch(baseURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sdp, email })
    });
    if (!response.ok) return false;
    const data = await response.json();
    return data.email == email;
}

export async function waitForIceGatheringCompletion(pc: RTCPeerConnection): Promise<void> {
    return await new Promise(resolve => {
        function checkIceGatheringState() {
            if (pc.iceGatheringState === 'complete') {
                pc.removeEventListener('icegatheringstatechange', checkIceGatheringState);
                return resolve();
            }
        }
        pc.addEventListener('icegatheringstatechange', checkIceGatheringState);
        checkIceGatheringState();
    });
}

export function sendMessage(dc: RTCDataChannel, message: string): boolean {
    if (dc.readyState === 'open') {
        dc.send(message);
        return true;
    }
    return false;
}
