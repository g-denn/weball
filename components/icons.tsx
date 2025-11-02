
import React from 'react';

export const MapPinIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 005.16-4.057l-1.18-.92a15.436 15.436 0 01-4.02 3.23l-1.35 1.05-1.35-1.05a15.436 15.436 0 01-4.02-3.23l-1.18.92a16.975 16.975 0 005.16 4.057zM12 12.75a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
    <path d="M12 2.25a8.25 8.25 0 018.25 8.25c0 1.921-.662 4.243-1.993 6.364a1.5 1.5 0 01-2.427 0C14.636 14.743 14 12.42 14 10.5a2 2 0 114 0c0 .937.29 2.14.75 3.518a.5.5 0 01-.88.5A10.45 10.45 0 0014 10.5c0-2.899-2.005-5.46-4.5-6.326a.75.75 0 01-.5-1.418A8.25 8.25 0 0112 2.25z" />
  </svg>
);

export const ClockIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
  </svg>
);

export const PriceTagIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.75 2.25a.75.75 0 00-1.5 0v.816c-1.344.22-2.585.748-3.668 1.483A.75.75 0 106.75 5.69a6.378 6.378 0 015.25-2.262.75.75 0 00.75-.688V2.25z" />
    <path fillRule="evenodd" d="M8.34 8.055a.75.75 0 011.023-.465 6.002 6.002 0 014.15 4.15.75.75 0 01-.466 1.024l-.001.001a1.5 1.5 0 00-1.484 1.834.75.75 0 01-1.446.289 9.75 9.75 0 00-4.02-4.02.75.75 0 01.288-1.446A1.5 1.5 0 008.34 8.055z" clipRule="evenodd" />
    <path d="M12 21.75A9.75 9.75 0 1012 2.25a9.75 9.75 0 000 19.5zm0-1.5A8.25 8.25 0 1012 3.75a8.25 8.25 0 000 16.5z" />
  </svg>
);

export const RestaurantIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.776 48.776 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
);
