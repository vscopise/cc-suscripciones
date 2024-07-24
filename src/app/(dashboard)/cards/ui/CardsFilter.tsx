'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

interface Props {
    email: string;
    name: string;
}


export const CardsFilter = ({ name, email }: Props) => {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleFilter = useDebouncedCallback((term: string, field: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set(field, term);
        } else {
            params.delete(field);
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <div className="-mx-3 flex flex-wrap w-full">
            <div className=" px-3 w-1/2">
                <div className="mb-5">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Nombre?"
                        onChange={(e) => handleFilter(e.target.value, 'name')}
                    />
                </div>
            </div>
            <div className=" px-3 w-1/2">
                <div className="mb-5">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="Email?"
                        onChange={(e) => handleFilter(e.target.value, 'email')}
                    />
                </div>
            </div>
        </div>
    )
}
