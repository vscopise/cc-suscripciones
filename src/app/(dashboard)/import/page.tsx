import { ImportCsv, Title } from "@/components";

export default function ImportPage() {
    return (
        <div className="flex flex-col pt-8">
            <div className="flex justify-center">
                <div className="w-full sm:w-[950px] px-10">
                    <Title title="Importar Datos" />
                    <ImportCsv description="Clientes" item="Client" />
                    <ImportCsv description="Suscripciones" item="Subscription" />
                </div>
            </div>
        </div>
    );
}