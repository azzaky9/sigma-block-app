import { trpc } from "@/utils/trpc-client";
import React, { createContext, useContext } from "react";

// Define the type for LocationContext
interface LocationContextType {
  locations: string[];
  loading: boolean;
  error: boolean;
}

// Create a context for LocationProvider
const LocationContext = createContext<LocationContextType>(
  {} as LocationContextType
);

// Define the type for LocationProvider props
interface LocationProviderProps {
  children: React.ReactNode;
}

// Create LocationProvider component
const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const { data, isLoading, isError } = trpc.getExisitingLocation.useQuery();

  return (
    <LocationContext.Provider
      value={{
        locations: data ? data.map((dat) => dat.location_name) : [],
        loading: isLoading,
        error: isError
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Create a custom hook to use LocationContext
const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export { LocationProvider, useLocation };
