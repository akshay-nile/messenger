import { Button } from 'primereact/button';

type Props = {
    title?: string,
    subtitle: string,
    button: { label: string, action: () => void }
};

function Header({ title, subtitle, button }: Props) {
    return (
        <header className="flex gap-4 justify-between">
            <div className="flex gap-4 items-center">
                <img src="./favicon.png" width={50} />
                <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-xl">{title ?? 'Messenger'}</span>
                    <span className="text-gray-300 text-xs">{subtitle}</span>
                </div>
            </div>
            <Button label={button.label} size="small" raised onClick={button.action} />
        </header>
    );
}

export default Header;