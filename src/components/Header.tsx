import { Button } from 'primereact/button';
import type { Status } from '../services/models';

type Props = {
    title?: string,
    subtitle: string | Status,
    button: { label: string, action: () => void }
};

function Header({ title, subtitle, button }: Props) {
    const isStatus = ['online', 'typing', 'speaking', 'refresh', 'offline'].includes(subtitle);
    const status = subtitle + (subtitle === 'typing' || subtitle === 'speaking' ? '...' : '');

    return (
        <header className="flex gap-4 justify-between p-6 sticky top-0 z-10 bg-[#121212]">
            <div className="flex gap-4 items-center">
                <img src="./favicon.png" width={50} />
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-xl">{title ?? 'Messenger'}</span>
                    {
                        isStatus
                            ? <span className="flex gap-1 text-gray-300 text-xs">
                                <span>{status !== 'offline' ? '🟢' : '🔴'}</span>
                                <span>{status[0].toUpperCase() + status.substring(1)}</span>
                            </span>
                            : <span className="text-gray-300 text-xs">{subtitle}</span>
                    }

                </div>
            </div>
            <Button label={button.label} size="small" raised onClick={button.action} />
        </header>
    );
}

export default Header;