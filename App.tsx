
import React, { useState, useEffect, useCallback } from 'react';
import type { Restaurant, Coordinates, GeminiResponse } from './types';
import { findCheapEats, getPriceFromImage } from './services/geminiService';
import SearchBar from './components/SearchBar';
import RestaurantCard from './components/RestaurantCard';
import Loader from './components/Loader';
import { RestaurantIcon, MapPinIcon } from './components/icons';

const parsePrice = (price: string | null): number => {
  if (!price) return Infinity; // Treat unknown prices as most expensive
  const numericPart = price.match(/[\d.]+/);
  return numericPart ? parseFloat(numericPart[0]) : Infinity;
};


const App: React.FC = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationInput, setLocationInput] = useState<string>('Detecting location...');
  const [searchResult, setSearchResult] = useState<GeminiResponse | null>(null);
  const [currentDish, setCurrentDish] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(true);

  useEffect(() => {
    // We only try to get geolocation once on initial load.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationInput('Current Location');
        setIsLocating(false);
      },
      (err) => {
        setError(`Could not auto-detect location: ${err.message}. Please enter a location manually.`);
        setLocationInput(''); // Clear the input for manual entry
        setIsLocating(false);
      },
      { timeout: 10000 }
    );
  }, []);

  const handleSearch = useCallback(async (dish: string) => {
    const locationQuery = locationInput.trim();
    if (!locationQuery) {
        setError("Please enter a location to search.");
        return;
    }

    let locationData: Coordinates | string;
    if (locationQuery.toLowerCase() === 'current location' && userLocation) {
        locationData = userLocation;
    } else if (locationQuery.toLowerCase() === 'current location' && !userLocation) {
        setError("Could not use 'Current Location' as it was not detected. Please enter a location manually.");
        return;
    } else {
        locationData = locationQuery;
    }
    
    setIsLoading(true);
    setError(null);
    setSearchResult(null);
    setCurrentDish(dish);
    try {
      const result = await findCheapEats(dish, locationData);
      setSearchResult(result);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [userLocation, locationInput]);

  const handleFindPriceFromImage = useCallback(async (file: File, restaurantIndex: number) => {
    if (!currentDish || !searchResult) return;

    // Find the actual restaurant being updated to maintain its identity during re-sorting
    const restaurantToUpdate = searchResult.restaurants[restaurantIndex];

    setSearchResult(prevResult => {
      if (!prevResult) return null;
      const newRestaurants = prevResult.restaurants.map(r => 
        r.name === restaurantToUpdate.name ? { ...r, isUpdatingPrice: true } : r
      );
      return { ...prevResult, restaurants: newRestaurants };
    });

    try {
      const base64Image = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
      });
      
      const price = await getPriceFromImage(currentDish, base64Image, file.type);

      setSearchResult(prevResult => {
        if (!prevResult) return null;
        let newRestaurants = [...prevResult.restaurants];
        const targetIndex = newRestaurants.findIndex(r => r.name === restaurantToUpdate.name);
        
        if (targetIndex !== -1) {
          newRestaurants[targetIndex] = { ...newRestaurants[targetIndex], price: price, isUpdatingPrice: false };
        }
        
        // Re-sort the list based on price, then distance
        newRestaurants.sort((a, b) => {
          const priceA = parsePrice(a.price);
          const priceB = parsePrice(b.price);
          if (priceA !== priceB) {
            return priceA - priceB;
          }
          return a.distance - b.distance;
        });

        return { ...prevResult, restaurants: newRestaurants };
      });
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError("An unexpected error occurred while analyzing image.");

      setSearchResult(prevResult => {
        if (!prevResult) return null;
        const newRestaurants = prevResult.restaurants.map(r => 
          r.name === restaurantToUpdate.name ? { ...r, isUpdatingPrice: false } : r
        );
        return { ...prevResult, restaurants: newRestaurants };
      });
    }
  }, [currentDish, searchResult]);

  const renderContent = () => {
    if (isLoading && !searchResult) {
      return <Loader />;
    }
    
    if (searchResult) {
      if (searchResult.restaurants.length === 0) {
        return <div className="text-center p-8 text-slate-500">No restaurants found with a 4.3+ star rating for '{currentDish}' in '{locationInput}'. Try another dish or location!</div>;
      }
      return (
        <div className="space-y-6">
          <ul className="space-y-4">
            {searchResult.restaurants.map((resto, index) => (
              <RestaurantCard
                key={`${resto.name}-${index}`}
                restaurant={resto}
                rank={index + 1}
                index={index}
                dish={currentDish}
                onPriceUpdate={handleFindPriceFromImage}
              />
            ))}
          </ul>
          <div className="text-center p-6 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="font-semibold text-indigo-800">{searchResult.summary}</p>
          </div>
        </div>
      );
    }

    // Only show error after initial location check is done
    if (error && !isLocating) {
        return <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>;
    }

    return (
      <div className="text-center p-8 flex flex-col items-center">
        <RestaurantIcon className="w-16 h-16 text-indigo-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-700">Find the Best Deals on Your Favorite Food</h2>
        <p className="mt-2 text-slate-500">
          Enter a dish and location above to find the cheapest options!
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <main className="container mx-auto max-w-2xl p-4 sm:p-6">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Nearby <span className="text-indigo-600">Cheap Eats</span> Finder
          </h1>
          <p className="mt-2 text-slate-500">Discover the most affordable local spots for any craving.</p>
        </header>

        <div className="sticky top-4 z-10 p-2 bg-slate-50/80 backdrop-blur-sm rounded-xl">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          <div className="mt-3 relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MapPinIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                placeholder="e.g., Kuala Lumpur, Malaysia"
                className="w-full bg-white text-slate-700 placeholder-slate-400 rounded-full py-2.5 pl-10 pr-4 shadow-sm border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                disabled={isLocating}
            />
          </div>
        </div>
        
        <div className="mt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;