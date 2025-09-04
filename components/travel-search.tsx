"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Check,
  ChevronsUpDown,
  MapPin,
  Calendar as CalendarIcon,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Destination } from "@/types";

interface TravelSearchProps {
  destinations: Destination[];
}

export default function TravelSearch({ destinations }: TravelSearchProps) {
  const [openDestination, setOpenDestination] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState("");

  const [openDeparture, setOpenDeparture] = useState(false);
  const [departureDate, setDepartureDate] = useState<Date | undefined>();

  const [openReturn, setOpenReturn] = useState(false);
  const [returnDate, setReturnDate] = useState<Date | undefined>();

  const [travelers, setTravelers] = useState(1);

  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    if (selectedDestination)
      searchParams.set("destination", selectedDestination);
    if (departureDate)
      searchParams.set("departure", departureDate.toISOString());
    if (returnDate) searchParams.set("return", returnDate.toISOString());
    window.location.href = `/packages?${searchParams.toString()}`;
  };

  //if (travelers) searchParams.set("travelers", travelers.toString());

  return (
    <motion.div
      className="bg-white/95 backdrop-blur rounded-2xl p-6 mb-8 shadow-2xl max-w-7xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      whileHover={{ y: -2, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Destination Autocomplete */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Popover open={openDestination} onOpenChange={setOpenDestination}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openDestination}
                className="w-full h-12 justify-start border-0 bg-muted/50 hover:bg-background transition-colors text-left truncate"
              >
                <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <span className="truncate">
                  {selectedDestination
                    ? destinations.find(
                        (dest) => dest.name === selectedDestination
                      )?.name
                    : "Kerala, Dubai, Thailand..."}
                </span>
                <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder="Search destinations..." />
                <CommandList>
                  <CommandEmpty>No destination found.</CommandEmpty>
                  <CommandGroup>
                    {destinations.map((destination) => (
                      <CommandItem
                        key={destination.id}
                        value={destination.name}
                        onSelect={(currentValue) => {
                          setSelectedDestination(
                            currentValue === selectedDestination
                              ? ""
                              : currentValue
                          );
                          setOpenDestination(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedDestination === destination.name
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        <div className="flex flex-col">
                          <span>{destination.name}</span>
                          <span className="text-sm text-muted-foreground">
                            {destination.region}, {destination.country}
                          </span>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </motion.div>

        {/* Departure Date Picker */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Popover open={openDeparture} onOpenChange={setOpenDeparture}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full h-12 justify-start border-0 bg-muted/50 hover:bg-background transition-colors"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {departureDate
                  ? format(departureDate, "PPP")
                  : "Departure Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={departureDate}
                onSelect={(date) => {
                  setDepartureDate(date);
                  setOpenDeparture(false);
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </motion.div>

        {/* Travelers Count */}
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center h-12 w-full border rounded-xl bg-muted/50 px-3">
            <span className="mr-2 text-muted-foreground">Travelers</span>
            <div className="flex items-center ml-auto gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTravelers(Math.max(1, travelers - 1))}
              >
                -
              </Button>
              <span className="min-w-[20px] text-center">{travelers}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setTravelers(travelers + 1)}
              >
                +
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Search Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            size="lg"
            className="h-12 w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-md"
            onClick={handleSearch}
          >
            <Search className="w-5 h-5 mr-2" />
            Search
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
