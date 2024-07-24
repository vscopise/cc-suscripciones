interface Props {
    children: React.ReactNode;
    type?: 'submit' | 'button' | 'reset';
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    className?: string;
}

export const Button = ({ type = 'button', children, onClick, className = '' }: Props) => {
    return (
        <button
            className={`btn-primary ${className}`}
            type={type}
            onClick={onClick}
        >
            {children}
        </button>
    )
}
