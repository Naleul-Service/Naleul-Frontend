interface LabelProps {
  children: React.ReactNode
  isRequired?: boolean
}

export default function Label({ children, isRequired = false }: LabelProps) {
  return (
    <div className="flex items-start gap-x-[2px]">
      <label className="label-md text-gray-950">{children}</label>
      {isRequired ? <p className="label-md text-error-default">*</p> : null}
    </div>
  )
}
