import { Button } from 'primereact/button';
import type { Status } from '../services/models';

type Props = {
    title?: string,
    subtitle: string | Status,
    button: { label: string, action: () => void }
};

function Header({ title, subtitle, button }: Props) {
    const isStatus = ['online', 'typing', 'speaking', 'refresh', 'offline'].includes(subtitle);

    return (
        <header className="flex gap-4 justify-between p-6 sticky top-0 z-10 bg-[#121212]">
            <div className="flex gap-4 items-center">
                <img src="./favicon.png" width={50} />
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-xl">{title ?? 'Messenger'}</span>
                    <span className={`text-gray-300 ${isStatus ? 'ms-0.5 text-sm' : 'text-xs'}`}>{subtitle}</span>
                </div>
            </div>
            <Button label={button.label} size="small" raised onClick={button.action} />
        </header>
    );
}

export default Header;