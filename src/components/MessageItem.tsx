import type { Message, User } from '../services/models';
import { getDateTime } from '../services/utilities';

type Props = { message: Message, other: User, showName: boolean };

function MessageItem({ message, other, showName }: Props) {
    const isMine = message.sender !== other.email;
    const [date, time] = getDateTime(message.timestamp / 1000);

    return (
        <div className={`flex items-center ${isMine ? 'justify-end text-right' : 'justify-start text-left'} my-2`}>
            <div className="flex flex-col gap-0.5">
                {showName && <span className="text-xs mx-2">{isMine ? 'You' : other.name.split(' ')[0]}</span>}
                <div className={`py-3 px-4 text-black font-medium rounded-2xl text-center
                    ${isMine ? 'bg-blue-300 rounded-br-none' : 'bg-yellow-100 rounded-bl-none'}`}>
                    {message.message}
                </div>
                <span className="text-[10px] font-light mx-1">{date}&nbsp;&nbsp;{time}</span>
            </div>
        </div>
    );
}

export default MessageItem;