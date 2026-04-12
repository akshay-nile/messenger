import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { useToastMessage } from '../contexts/ToastMessage/useToastMessage';
import type { User } from '../services/models';
import { deleteChatThread } from '../services/service';

type Props = { other: User, user: User };

function UserItem({ other, user }: Props) {
    const navigate = useNavigate();
    const toast = useToastMessage();

    return (
        <div className="flex justify-between items-center my-6 px-4 py-3 bg-gray-100 text-black rounded-lg hover:cursor-pointer shadow-xl group">
            <i className="pi pi-user p-overlay-badge me-4" style={{ fontSize: '2.25rem' }}>
                {other.unseen > 0 && <Badge value={other.unseen} severity="danger" style={{ zoom: 0.8 }} />}
            </i>
            <div className="w-full flex flex-col justify-center" onClick={() => navigate('/chat', { state: { other, user } })}>
                <span className="text-lg font-bold group-hover:text-blue-700">{other.name}</span>
                <span className="text-xs font-medium">{other.email}</span>
            </div>
            <div className="flex gap-2">
                <Button icon="pi pi-trash" raised rounded onClick={async () => {
                    const data = await deleteChatThread(other.email);
                    if (data) toast.showMessage({ severity: 'success', summary: 'Chat History Deleted' });
                    else toast.showMessage({ severity: 'error', summary: 'Failed to Delete Chat' });
                }} />
            </div>
        </div>
    );
}

export default UserItem;