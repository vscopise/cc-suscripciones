import { IoClose } from 'react-icons/io5';

interface Props {
    children: React.ReactNode;
    open: boolean;
    onClose: Function;
}

export const Dialog = ({ open, onClose, children }: Props) => {

    if (!open) return <></>;

    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-smoke-light flex">
            <div className="relative p-8 bg-white w-full max-w-md m-auto flex-col flex rounded-lg border shadow-sm">
                <div>{children}</div>
                <span className="absolute top-0 right-0 p-4">
                    <IoClose className="cursor-pointer" onClick={() => onClose()} />
                </span>
            </div>
        </div>
    );
}