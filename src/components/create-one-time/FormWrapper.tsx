import type { ReactNode } from 'react';

type FormWrapperProps = {
  title: string;
  children: ReactNode;
};

export function FormWrapper({ title, children }: FormWrapperProps) {
  return (
    <>
      <div className="flex items-center justify-center px-4 py-6 sm:px-6">
        <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
      </div>
      <div>
        <dl className="divide-y divide-gray-300 px-4">{children}</dl>
      </div>
    </>
  );
}
