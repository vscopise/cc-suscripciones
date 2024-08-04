'use client';

import type { User } from '@/interfaces';
import { changeUserRole } from '@/actions';
import Link from 'next/link';
import { UserDelete } from './UserDelete';

interface Props {
    users: User[];
    currentUser: string;
}

export const UsersTable = ({ users, currentUser }: Props) => {

    return (
        <table className="min-w-full">
            <thead className="bg-gray-200 border-b">
                <tr>
                    <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                        Email
                    </th>
                    <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                        Nombre completo
                    </th>
                    <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                    >
                        Rol
                    </th>
                    <th />
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr
                        key={user.id}
                        className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
                    >
                        <td className="text-sm text-gray-900 font-light whitespace-nowrap">
                            <Link href={`/user/${user.id}`} className='hover:underline px-6 py-4 block'>
                                {user.email}
                            </Link>
                        </td>
                        <td className="text-sm text-gray-900 font-light whitespace-nowrap">
                            <Link href={`/user/${user.id}`} className='hover:underline px-6 py-4 block'>
                                {user.name}
                            </Link>
                        </td>
                        <td className="flex items-center text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {user.id === currentUser
                                ? <span className="text-sm w-full p-2 capitalize">{user.role}</span>
                                : (
                                    <select
                                        value={user.role}
                                        onChange={(e) => changeUserRole(user.id, e.target.value)}
                                        className="text-sm w-full p-2 text-gray-900"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="user">User</option>
                                    </select>
                                )
                            }
                        </td>
                        <td className="text-sm text-gray-900 font-light whitespace-nowrap">
                            {user.id !== currentUser && <UserDelete userId={user.id} />}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
