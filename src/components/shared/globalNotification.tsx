import React, { useEffect } from 'react';
import { useNotification } from '../../context/notificationContext';

const GlobalNotification = () => {
  const { notification, setNotification } = useNotification();

  useEffect(() => {
    if (notification) {
      setTimeout(() => {
        setNotification(null);
      }, 15000); // Comment said "Close after 5 seconds", but it's actually set to 15 seconds
    }
  }, [notification]);

  if (!notification) return null;

  const handleClose = () => {
    setNotification(null);
  };

  const toastConfig = {
    green: {
      id: 'toast-success',
      iconPath:
        'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z',
      bgColor: 'bg-green-100',
      textColor: 'text-green-500',
      darkBgColor: 'dark:bg-green-800',
      darkTextColor: 'dark:text-green-200',
      srOnly: 'Check icon',
    },
    red: {
      id: 'toast-danger',
      iconPath:
        'M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z',
      bgColor: 'bg-red-100',
      textColor: 'text-red-500',
      darkBgColor: 'dark:bg-red-800',
      darkTextColor: 'dark:text-red-200',
      srOnly: 'Error icon',
    },
  };

  const config = toastConfig[notification.color as keyof typeof toastConfig];

  return (
    <div
      id={config.id}
      className="fixed bottom-0 left-1/2 mx-auto mb-4 flex w-full max-w-sm -translate-x-1/2 items-center rounded-lg bg-white p-4 text-gray-500 shadow-2xl dark:bg-gray-800 dark:text-gray-400"
      role="alert"
    >
      <div
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${config.bgColor} ${config.textColor} ${config.darkBgColor} ${config.darkTextColor}`}
      >
        <svg
          className="h-5 w-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d={config.iconPath} />
        </svg>
        <span className="sr-only">{config.srOnly}</span>
      </div>
      <div className="ml-3 text-sm font-normal">{notification.message}.</div>
      <button
        type="button"
        className="-m-1.5 ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
        data-dismiss-target={`#${config.id}`}
        aria-label="Close"
        onClick={handleClose}
      >
        <span className="sr-only">Close</span>
        <svg
          className="h-3 w-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};

export default GlobalNotification;
