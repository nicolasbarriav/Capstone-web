type Props = {
  title: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error: any;
  type: 'text' | 'password' | 'email' | 'number';
  rows?: number;
};

export default function TextAreaComponent({
  onChange,
  value,
  title,
  name,
  error,
  rows,
}: Props) {
  return (
    <div className="relative">
      <label
        htmlFor={name}
        className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-900"
      >
        {title}
      </label>
      <textarea
        id={name}
        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={value}
        onChange={onChange}
        name={name}
        rows={rows || 1}
      />
      {error && error.message && (
        <p className="text-left text-xs italic text-red-500">{error.message}</p>
      )}
    </div>
  );
}
