type Props = {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
  title: string;
  min?: string;
};
export default function DateInputComponent({
  name,
  onChange,
  value,
  title,
  min = new Date(-8640000000000000).toDateString(),
}: Props) {
  return (
    <div className="relative flex flex-col">
      <div>
        <label
          htmlFor={name}
          className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
        >
          {title}
        </label>
      </div>
      <input
        type="date"
        id={name}
        min={min}
        value={value}
        className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600"
        onChange={onChange}
        name="payment_due_date"
      />
    </div>
  );
}
