import { Button } from 'primereact/button';

type Props = {
    title?: string,
    button: { label: string, action: () => void }
};

function Header({ title, button }: Props) {
    return (
        <header className="flex gap-4 justify-between">
            <div className="flex gap-4 items-center">
                <img src="./favicon.png" width={50} />
                <span className="font-bold text-xl">{title ?? 'Messenger'}</span>
            </div>
            <Button label={button.label} size="small" onClick={button.action} />
        </header>
    );
}

export default Header;