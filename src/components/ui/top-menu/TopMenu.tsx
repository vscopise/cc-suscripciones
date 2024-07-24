'use client';

import { useUIStore } from '@/store/ui';
import Image from 'next/image';
import Link from 'next/link';
import { IoMenuOutline } from 'react-icons/io5';

export const TopMenu = () => {

    const openSideMenu = useUIStore(state => state.openSideMenu);
    
    return (
        <nav className="flex px-5 justify-between items-center w-full shadow-md">
            <div>
                <Link
                    href="/"
                    className="flex flex-col sm:flex-row items-center pt-1"
                >
                    <span className="pr-2">
                        <Image src="/img/logo-cyc.png" width="200" height="200" alt="" />
                    </span>
                    <span className="pr-1 hidden sm:block">|</span>
                    <span>
                        Suscripciones
                    </span>
                </Link>
            </div>
            <div className="flex items-center">
                <button
                    className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                    onClick={() => openSideMenu()}
                >
                    <IoMenuOutline className="w-5 h-5" />
                </button>
            </div>
        </nav>
    )
}
