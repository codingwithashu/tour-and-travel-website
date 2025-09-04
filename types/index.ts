// -------------------------
// Categories
// -------------------------
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

// -------------------------
// Destinations
// -------------------------
export interface Destination {
  id: number;
  slug: string;
  name: string;
  country?: string;
  region?: string;
  image?: string;
  description?: string;
  packageCount: number;
  startingPrice?: number;
  categoryId: number;
  categoryName: string;
  rating?: number;
  reviewCount: number;
  bestTime?: string;
}

// -------------------------
// Packages
// -------------------------
export interface Package {
  id: number;
  slug: string;
  title: string;
  destinationId: number;
  destinationName: string;
  categoryId: number;
  categoryName: string;
  duration?: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
  image?: string;
  featured: boolean;
  description?: string;
}

// -------------------------
// Package Gallery
// -------------------------
export interface PackageGallery {
  id: number;
  packageId: number;
  packageTitle: string;
  imageUrl: string;
}

// -------------------------
// Package Inclusions
// -------------------------
export interface PackageInclusion {
  id: number;
  packageId: number;
  packageTitle: string;
  inclusion: string;
}

// -------------------------
// Package Exclusions
// -------------------------
export interface PackageExclusion {
  id: number;
  packageId: number;
  packageTitle: string;
  exclusion: string;
}

// -------------------------
// Package Highlights
// -------------------------
export interface PackageHighlight {
  id: number;
  packageId: number;
  packageTitle: string;
  highlight: string;
}

// -------------------------
// Package Itinerary
// -------------------------
export interface PackageItinerary {
  id: number;
  packageId: number;
  packageTitle: string;
  dayNumber: number;
  title?: string;
  description?: string;
}

// -------------------------
// Reviews
// -------------------------
export interface Review {
  id: number;
  packageId: number;
  packageTitle: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  title?: string;
  comment?: string;
  date: Date;
  verified: boolean;
}

// -------------------------
// Bookings
// -------------------------
export interface Booking {
  id: number;
  packageId: number;
  packageTitle: string;
  fullName: string;
  email: string;
  phone: string;
  departureDate: string;
  returnDate: string;
  travelers: number;
  roomType: string;
  status: string;
  createdAt: Date;
}





export interface BookingForm {
  packageId: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: string
  }
  travelDetails: {
    departureDate: string
    returnDate: string
    travelers: number
    roomType: "single" | "double" | "suite"
    specialRequests?: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
}

export interface EnquiryForm {
  packageId?: string
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  travelPreferences: {
    destination?: string
    budget: string
    travelDates: string
    groupSize: number
    interests: string[]
  }
  message: string
}


export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
