import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function LandingNavbar() {
  const router = useRouter();
  const sections: { [key: string]: string } = {
    Inicio: 'start',
    Precios: 'pricing',
    Contacto: 'contact',
  };
  const [selectedSection, setSelectedSection] = useState<string>('Inicio');
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Disclosure
      as="nav"
      className="fixed inset-x-0 top-0 z-10 bg-gray-200 shadow"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex shrink-0 items-center">
                  <img
                    className="h-8 w-auto"
                    src={`${router.basePath}/logos/vambeLogo.svg`}
                    alt="Your Company"
                  />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  {Object.entries(sections).map(([section, id]) => (
                    <div
                      onClick={() => {
                        setSelectedSection(section);
                        scrollToSection(id);
                      }}
                      key={section}
                      className={clsx(
                        'inline-flex cursor-pointer items-center border-b-2 px-1 pt-1 text-sm font-medium text-gray-500',
                        selectedSection === section &&
                          'border-indigo-500 text-gray-900'
                      )}
                    >
                      {section}
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden gap-4 sm:ml-6 sm:flex sm:items-center">
                <button
                  type="button"
                  className="p-1 text-sm hover:text-gray-500"
                >
                  <div
                    onClick={() => {
                      router.push('/login');
                    }}
                  >
                    Entrar
                  </div>
                </button>
                <button
                  onClick={() => {
                    router.push('/signup');
                  }}
                  type="button"
                  className="rounded-md bg-indigo-500 px-4 py-2 text-sm text-white hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <div>Empezar</div>
                </button>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-3 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              {Object.entries(sections).map(([section, id]) => (
                <Disclosure.Button
                  onClick={() => {
                    setSelectedSection(section);
                  }}
                  href={`#${id}`}
                  key={`#${section}`}
                  as="a"
                  className={clsx(
                    'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700',
                    selectedSection === section &&
                      'border-indigo-500 bg-indigo-50 text-indigo-700'
                  )}
                >
                  {section}
                </Disclosure.Button>
              ))}
              <Disclosure.Button
                href={`/login`}
                as="a"
                className={clsx(
                  'block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700'
                )}
              >
                Login
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
