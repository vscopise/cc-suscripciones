import { Button, Dialog } from "@/components";

interface Props {
    title: string;
    children: React.ReactNode;
    open: boolean;
    onClose: Function;
    onConfirm: Function;
}

export const ConfirmDialog = (props: Props) => {
  const { open, onClose, title, children, onConfirm } = props;
  if (!open)  return <></>;
  
  return (
      <Dialog open={open} onClose={onClose}>
        <h2 className="text-xl">{title}</h2>
        <div className="py-5">{children}</div>
        <div className="flex justify-end">
          <div className="p-1">
            <Button
              onClick={() => onClose()}
              className="btn-secondary hover:bg-secondary-light"
            >
              No
            </Button>
          </div>
          <div className="p-1">
            <Button
              onClick={() => {
                onClose();
                onConfirm();
              }}
              className="btn-primary hover:bg-secondary-light"
            >
              Sí
            </Button>
          </div>
        </div>
      </Dialog>
    );
}
