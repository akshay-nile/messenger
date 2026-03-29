import type { ReactNode } from 'react';

type Props = { children: ReactNode };

function Layout({ children }: Props) {
    return (
        <div className='flex justify-center'>
            <div className='w-full md:w-1/3 min-h-dvh flex flex-col justify-between gap-4 p-5' >
                {children}
            </div>
        </div>
    );
}

export default Layout;