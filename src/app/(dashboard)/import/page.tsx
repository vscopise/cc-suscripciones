import { ImportCsv, Title } from "@/components";

export default function ImportPage() {
    return (
        <div className="flex flex-col pt-8">
            <div className="flex justify-center">
                <div className="w-full sm:w-[850px] px-10">
                    <Title title="Importar Datos" />
                    <ImportCsv description="Clientes" />
                </div>
            </div>
        </div>
    );
}