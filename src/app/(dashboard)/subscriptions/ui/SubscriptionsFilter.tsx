"use client";

import { getFilteredSubscriptions } from "@/actions";
import { useUIStore } from "@/store/ui";
import clsx from "clsx";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import { useDebouncedCallback } from "use-debounce";

interface Props {
  active: string;
  client: string;
  status: string;
  page: number;
  take: number;
  isAdmin: boolean;
  subscriptions: any[];
}

export const SubscriptionsFilter = ({
  active,
  client,
  status,
  page,
  take,
}: Props) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = useDebouncedCallback((term: string, field: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set(field, term);
    } else {
      params.delete(field);
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  const openFilter = useUIStore((state) => state.openSubscriptionFilter);
  const closeFilter = useUIStore((state) => state.closeSubscriptionFilter);
  const isFilterOpen = useUIStore((state) => state.isSubscriptionFilterOpen);

  const downloadCSV = async () => {
    const { allSubscriptions = [] } = await getFilteredSubscriptions({
      active,
      client,
      status,
      page,
      take,
    });

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Nombre, Email, Contacto, Dirección, Ciudad, Estado, Fecha inicio, Ultimo Pago, Monto\n" +
      allSubscriptions
        .map((s) => {
          let nombre = `"${s.client.name} ${s.client.lastName}"`;
          let email = s.client.email;
          let telefono = s.client.phone;
          let direccion = s.client.address;
          let ciudad = s.client.city;
          let estado = s.client.state;
          let fechaInicio = s.dateStart.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
          let ultimoPago = s.dateLastPay?.toLocaleDateString("es-ES", {
            month: "long",
            day: "numeric",
          });
          let monto = s.amount;

          return `${nombre}, ${email}, ${telefono}, ${direccion}, ${ciudad}, ${estado}, ${fechaInicio}, ${ultimoPago}, ${monto}`;
          //return `"${s.client.name} ${s.client.lastName}", ${s.client.email}, ${s.client.phone}, ${s.client.address}, ${s.client.city}, ${s.client.state}, ${s.dateStart}, ${s.amount}`;
        })
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Listado Suscripciones.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div
      className={clsx(
        "mb-4 overflow-hidden transform transition-all duration-300",
        { "h-auto": isFilterOpen },
        { "h-16": !isFilterOpen }
      )}
    >
      <div className="flex p-2 justify-between items-center w-full">
        <h4 className="text-2xl">Opciones de Filtrado</h4>
        <div className="flex items-center">
          <button
            className="btn-secondary"
            type="button"
            onClick={() => downloadCSV()}
          >
            Descargar datos
          </button>
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
      </div>
      <div className="flex px-5 justify-between items-center w-full">
        <div className="-mx-3 flex flex-wrap w-full">
          <div className=" px-3 w-1/3">
            <div className="mb-5">
              <select
                className="form-control form-select"
                onChange={(e) => handleFilter(e.target.value, "active")}
              >
                <option value="all">Suscripción Activa ?</option>
                <option value="yes">Activa</option>
                <option value="1">Inactiva por menos de 3 meses</option>
                <option value="2">Inactiva más de 3 meses</option>
              </select>
            </div>
          </div>
          <div className=" px-3 w-1/3">
            <div className="mb-5">
              <input
                className="form-control"
                type="text"
                placeholder="Email?"
                onChange={(e) => handleFilter(e.target.value, "client")}
              />
            </div>
          </div>
          <div className=" px-3 w-1/3">
            <div className="mb-5">
              <div className="mb-5">
                <select
                  className="form-control form-select"
                  onChange={(e) => handleFilter(e.target.value, "status")}
                >
                  <option value="all">Estado ?</option>
                  <option value="1" className="text-green-500">
                    Verde
                  </option>
                  <option value="2" className="text-yellow-400">
                    Amarillo
                  </option>
                  <option value="3" className="text-red-500">
                    Rojo
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
