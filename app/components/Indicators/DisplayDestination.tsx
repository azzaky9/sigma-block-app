"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import LocationOn from "@mui/icons-material/LocationOn";
import DropdownBtn from "../Buttons/DropdownBtn";
import { useLocationStore } from "@/lib/store";

type Destinations = { label: string; description?: string };

type Props = {
  destinations: Destinations[];
  setCurrentLocation: React.Dispatch<React.SetStateAction<string>>;
  currentLocation: string;
};

export default function DisplayDestination(props: Props) {
  const { destinations, setCurrentLocation, currentLocation } = props;
  const locations = useLocationStore((state) => state.location);

  const handleClickEachItem = (location: string) =>
    setCurrentLocation(location);

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper
        activeStep={1}
        orientation="vertical"
      >
        {destinations.map((destination, index) => (
          <Step key={destination.label}>
            <StepLabel icon={<LocationOn color="info" />}>
              {destination.label}
            </StepLabel>
            <StepContent>
              <DropdownBtn
                items={locations
                  .filter((location) => location !== currentLocation)
                  .map((location) => ({
                    label: location,
                    ComponentProps: {
                      onClick: () => handleClickEachItem(location)
                    }
                  }))}
                buttonSize="small"
              />
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
