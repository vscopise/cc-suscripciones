'use client';

import { useUIStore } from '@/store/ui';
import clsx from 'clsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useDebouncedCallback } from 'use-debounce';

export const ClientsFilter = () => {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFilter = useDebouncedCallback((term: string, field: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set(field, term);
        } else {
            params.delete(field);
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    const openFilter = useUIStore(state => state.openClientFilter);
    const closeFilter = useUIStore(state => state.closeClientFilter);
    const isFilterOpen = useUIStore(state => state.isClientFilterOpen);

    return (
        <div className={clsx(
            "mb-4 overflow-hidden transform transition-all duration-300",
            { "h-auto": isFilterOpen },
            { "h-16": !isFilterOpen },
        )}>
            <div className="flex p-2 justify-between items-center w-full">
                <h4 className="text-2xl">Opciones de Filtrado</h4>
                {isFilterOpen && (
                    <button
                        className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                        onClick={() => closeFilter()}
                    >
                        <IoChevronUp className="w-5 h-5" />
                    </button>
                )}
                {!isFilterOpen && (
                    <button
                        className="m-2 p-2 rounded-md transition-all hover:bg-gray-100"
                        onClick={() => openFilter()}
                    >
                        <IoChevronDown className="w-5 h-5" />
                    </button>
                )}
            </div>
            <div className="flex px-5 justify-between items-center w-full">
                <div className=" px-3 w-1/3">
                    <div className="mb-5">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Nombre?"
                            onChange={(e) => handleFilter(e.target.value, 'name')}
                        />
                    </div>
                </div>
                <div className=" px-3 w-1/3">
                    <div className="mb-5">
                        <input
                            className="form-control"
                            type="text"
                            placeholder="Email?"
                            onChange={(e) => handleFilter(e.target.value, 'email')}
                        />
                    </div>
                </div>
                <div className=" px-3 w-1/3">
                    <div className="mb-5">
                        <select className="form-control form-select" onChange={(e) => handleFilter(e.target.value, 'subscriptions')}>
                            <option value="all">Con Suscripciones ?</option>
                            <option value="yes">Si</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    )
}
