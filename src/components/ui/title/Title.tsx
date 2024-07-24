interface Props {
  title: string;
  className?: string;
}

export const Title = ({ title, className }: Props) => {

  return (
    <div className={`flex justify-between my-3 ${className}`}>
      <h1 className=" antialiased text-4xl font-semibold">
        {title}
      </h1>
    </div>
  )
}
