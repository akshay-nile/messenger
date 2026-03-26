import type { ReactNode } from 'react';

type Props = { children: ReactNode };

function Layout({ children }: Props) {
    return (
        <div className='w-full min-h-[calc(100dvh-8rem)] flex flex-col items-center justify-center'>
            <div className='w-full md:w-[40%] flex flex-col gap-6 px-4' >
                {children}
            </div>
        </div>
    );
}

export default Layout;