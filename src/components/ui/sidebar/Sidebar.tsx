'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { 
    IoBookmarksOutline, 
    IoCardOutline, 
    IoCloseOutline, 
    IoDocumentsOutline, 
    IoLogInOutline, 
    IoLogOutOutline, 
    IoPeopleOutline, 
    IoPeopleSharp,
    IoPushOutline, 
    IoPersonOutline 
} from 'react-icons/io5';
import { useUIStore } from '@/store/ui';
import { logout } from '@/actions';

export const Sidebar = () => {

    const isSideMenuOpen = useUIStore(state => state.isSideMenuOpen);
    const closeSideMenu = useUIStore(state => state.closeSideMenu);

    const { data: session } = useSession();
    const isAuthenticated = !!session?.user;

    const isAdmin = session?.user.role === 'admin';

    return (
        <div>
            {isSideMenuOpen && (
                <>
                    <div
                        className="fixed top-0 left-0 w-screen h-screen z-10 bg-black opacity-30"
                        onClick={() => closeSideMenu()}
                    />
                    <div
                        className="fade-in fixed top-0 left-0 w-screen h-screen z10 backdrop-filter backdrop-blur-sm"
                    />
                </>
            )}
            <nav
                className={
                    clsx(
                        "fixed p-5 right-0 top-0 w-[300px] h-screen bg-white z-20 shadow-2xl transform transition-all duration-300",
                        { "translate-x-full": !isSideMenuOpen }
                    )
                }
            >
                <IoCloseOutline
                    size={50}
                    className="absolute top-0 right-0 cursor-pointer"
                    onClick={() => closeSideMenu()}
                />
                <div className="relative mt-4">
                    <Link
                        href="/profile"
                        onClick={() => closeSideMenu()}
                        className="flex items-center p-1 hover:bg-gray-100 rounded transition-all"
                    >
                        <IoPersonOutline size={30} />
                        <span className="ml-3">Mi Perfil</span>
                    </Link>

                    <div className="w-full h-px bg-gray-200 my-4" />

                    <Link
                        href="/subscriptions"
                        className="flex items-center p-1 hover:bg-gray-100 rounded transition-all"
                        onClick={() => closeSideMenu()}
                    >
                        <IoDocumentsOutline size={30} />
                        <span className="ml-3">Suscripciones</span>
                    </Link>

                    <div className="w-full h-px bg-gray-200 my-4" />

                    <Link
                        href="/plans"
                        className="flex items-center p-1 hover:bg-gray-100 rounded transition-all"
                        onClick={() => closeSideMenu()}
                    >
                        <IoBookmarksOutline size={30} />
                        <span className="ml-3">Planes</span>
                    </Link>

                    <div className="w-full h-px bg-gray-200 my-4" />

                    <Link
                        href="/clients"
                        className="flex items-center p-1 hover:bg-gray-100 rounded transition-all"
                        onClick={() => closeSideMenu()}
                    >
                        <IoPeopleSharp size={30} />
                        <span className="ml-3">Clientes</span>
                    </Link>

                    {isAdmin && (
                        <>
                            <div className="w-full h-px bg-gray-200 my-4" />

                            <Link
                                href="/users"
                                className="flex items-center p-1 hover:bg-gray-100 rounded transition-all"
                                onClick={() => closeSideMenu()}
                            >
                                <IoPeopleOutline size={30} />
                                <span className="ml-3">Usuarios</span>
                            </Link>

                            <div className="w-full h-px bg-gray-200 my-4" />

                            <Link
                                href="/cards"
                                className="flex items-center p-1 hover:bg-gray-100 rounded transition-all"
                                onClick={() => closeSideMenu()}
                            >
                                <IoCardOutline size={30} />
                                <span className="ml-3">Tarjetas</span>
                            </Link>

                            <div className="w-full h-px bg-gray-200 my-4" />

                            <Link
                                href="/import"
                                className="flex items-center p-1 hover:bg-gray-100 rounded transition-all"
                                onClick={() => closeSideMenu()}
                            >
                                <IoPushOutline size={30} />
                                <span className="ml-3">Importar datos</span>
                            </Link>
                        </>
                    )}

                    <div className="w-full h-px bg-gray-200 my-4" />

                    {isAuthenticated && (
                        <button
                            className="flex w-full items-center p-1 hover:bg-gray-100 rounded transition-all"
                            onClick={() => logout()}
                        >
                            <IoLogOutOutline size={30} />
                            <span className="ml-3">Salir</span>
                        </button>
                    )}

                    {!isAuthenticated && (
                        <Link
                            href="/auth/login/"
                            className="flex w-full items-center p-1 hover:bg-gray-100 rounded transition-all"
                            onClick={() => closeSideMenu()}
                        >
                            <IoLogInOutline size={30} />
                            <span className="ml-3">Ingresar</span>
                        </Link>
                    )}

                </div>

            </nav>
        </div>
    )
}
