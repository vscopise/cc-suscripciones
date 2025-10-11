"use client";

import { User } from "@/interfaces";
import Link from "next/link";
import { ClientsTableItem } from "./ClientsTableItem";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { truncateString } from "@/utils";

interface Props {
  clients: any[];
  users: User[];
  isAdmin: boolean;
}

export const ClientsTable = ({ clients, users, isAdmin }: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentOrder = searchParams.get("order") || "asc"; // valor por defecto "asc"
  const { replace } = useRouter();

  const handleClick = useDebouncedCallback((field: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("orderby", field);
    const nextOrder = currentOrder === "asc" ? "desc" : "asc";
    params.set("order", nextOrder);
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <table className="table-fixed w-full">
      <thead className="bg-gray-200 text-gray-900 border-b text-xs">
        <tr>
          <th
            scope="col"
            className="w-1/6 px-4 py-4 text-left cursor-pointer"
            onClick={(e) => handleClick("name")}
          >
            Nombre
          </th>
          <th
            scope="col"
            className="w-1/6 px-4 py-4 text-left cursor-pointer"
            onClick={(e) => handleClick("email")}
          >
            Email
          </th>
          <th scope="col" className="w-1/12 px-4 py-4 text-left">
            Num. Cliente
          </th>
          <th scope="col" className="w-1/12 px-4 py-4 text-left">
            Contacto
          </th>
          <th scope="col" className="w-1/6 px-4 py-4 text-left">
            Notas
          </th>
          <th scope="col" className="w-1/12 px-4 py-4 text-left">
            Con suscripciones
          </th>
          <th scope="col" className="w-1/12 px-4 py-4 text-left">
            Baja reciente
          </th>

          <th scope="col" className="w-1/12 px-4 py-4 text-left">
            {isAdmin && <span>Usuario Asignado</span>}
          </th>
          <th className="w-1/12" />
        </tr>
      </thead>
      <tbody>
        {clients.map((client) => {
          let bajaReciente = false;
          if (client.Subscription.length > 0) {
            client.Subscription.map((s: any) => {
              if (null !== s.dateDeactivation) {
                const nowTimestamp = Date.now();
                const targetTimestamp = s.dateDeactivation.getTime();
                const differenceInMs = nowTimestamp - targetTimestamp;
                if (differenceInMs < 1000 * 3600 * 24 * 30) {
                  bajaReciente = true;
                }
              }
            });
          }
          return (
            <tr
              key={client.id}
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
            >
              <td className="text-sm  font-light whitespace-nowrap">
                <Link
                  href={`/client/${client.id}`}
                  className="hover:underline px-4 py-4 block"
                >
                  {truncateString(`${client.name} ${client.lastName}`, 20)}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                <Link
                  href={`/client/${client.id}`}
                  className="hover:underline px-4 py-4 block"
                >
                  {truncateString(`${client.email}`, 20)}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                <Link
                  href={`/client/${client.id}`}
                  className="hover:underline px-4 py-4 block"
                >
                  {client.clientNumber}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                <Link
                  href={`/client/${client.id}`}
                  className="hover:underline px-4 py-4 block"
                >
                  {client.phone}
                </Link>
              </td>
              <td className="text-sm  font-light whitespace-nowrap">
                {client.ClientNote.length > 0 && (
                  <Link
                    href={`/client/${client.id}`}
                    className="hover:underline px-4 py-4 block"
                  >
                    {client.ClientNote!.at(-1)!.note.length > 25
                      ? `${client.ClientNote!.at(-1)!.note.substring(0, 25)}...`
                      : client.ClientNote!.at(-1)!.note}
                  </Link>
                )}
              </td>
              <td className="text-sm font-light px-2 py-4 text-center">
                <Link
                  href={`/client/${client.id}`}
                  className="hover:underline py-4 block"
                >
                  {client.Subscription.length > 0 && <>SI</>}
                </Link>
              </td>
              <td className="text-sm font-light px-2 py-4 text-center">{bajaReciente && <>SI</>}</td>
              <td className="text-sm  font-light whitespace-nowrap">
                {isAdmin && (
                  <Link
                    href={`/client/${client.id}`}
                    className="hover:underline px-4 py-4 block"
                  >
                    {users.filter((u) => u.id === client.userId)[0].name}
                  </Link>
                )}
              </td>
              <td className="text-sm font-light px-2 py-4 flex justify-center">
                {isAdmin && <ClientsTableItem clientId={client.id} />}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
