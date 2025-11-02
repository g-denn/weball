
import React, { useRef } from 'react';
import type { Restaurant } from '../types';
import { ClockIcon, MapPinIcon, PriceTagIcon, CameraIcon } from './icons';

interface RestaurantCardProps {
  restaurant: Restaurant;
  rank: number;
  index: number;
  dish: string;
  onPriceUpdate: (file: File, index: number) => void;
}

const rankEmojis: { [key: number]: string } = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
};

const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, rank, index, dish, onPriceUpdate }) => {
  const { name, price, distance, travelTime, isOpen, isUpdatingPrice } = restaurant;
  const rankDisplay = rankEmojis[rank] || `${rank}th`;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPriceUpdate(file, index);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <li className="bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-slate-100">
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{rankDisplay}</span>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800 tracking-wide">{name}</h3>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <PriceTagIcon className="w-5 h-5 text-indigo-500" />
            {isUpdatingPrice ? (
              <span className="font-semibold text-slate-500 italic">Analyzing...</span>
            ) : price ? (
              <span className="font-semibold">{price}</span>
            ) : (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  disabled={isUpdatingPrice}
                />
                <button
                  onClick={handleButtonClick}
                  disabled={isUpdatingPrice}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none flex items-center gap-1 group disabled:opacity-50 disabled:cursor-wait"
                >
                  <CameraIcon className="w-4 h-4 text-indigo-500 group-hover:text-indigo-700 transition-colors" />
                  Find from menu
                </button>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="w-5 h-5 text-indigo-500" />
            <span>{distance} km away</span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-indigo-500" />
            <span>{travelTime}</span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default RestaurantCard;
