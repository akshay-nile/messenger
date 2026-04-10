import type { ReactNode } from 'react';

type Props = { children: ReactNode };

function Footer({ children }: Props) {
    return (
        <div className="p-6 sticky bottom-0 z-10 bg-[#121212]">
            {children}
        </div>
    );
}

export default Footer;