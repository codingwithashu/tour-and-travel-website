# 🌍 Travel Booking & Tour Management Platform

A full-stack web application for managing **travel bookings, destinations, tour packages, itineraries, reviews, and organizations** with authentication, role-based access, and SEO-friendly content.

---

## ⚡ Tech Stack

- **Framework**: Next.js (App Router)  
- **Language**: TypeScript  
- **API Layer**: tRPC  
- **Database ORM**: Drizzle ORM (PostgreSQL)  
- **UI Components**: ShadCN UI  
- **Styling**: Tailwind CSS  

---

## 🗄️ Database Schema

### **User**
- `id` (PK)  
- `name`  
- `email` (unique)  
- `emailVerified`  
- `image`  
- `createdAt` / `updatedAt`  

### **Session**
- `id` (PK)  
- `expiresAt`  
- `token` (unique)  
- `userId` → references **User**  
- `ipAddress`, `userAgent`  
- `activeOrganizationId`  

### **Account**
- `id` (PK)  
- `accountId`, `providerId`  
- `userId` → references **User**  
- `accessToken`, `refreshToken`, `idToken`  
- `createdAt` / `updatedAt`  

### **Organization**
- `id` (PK)  
- `name`, `slug` (unique)  
- `logo`, `metadata`  
- `createdAt`  

### **Member**
- `id` (PK)  
- `organizationId` → references **Organization**  
- `userId` → references **User**  
- `role` (default: member)  
- `createdAt`  

### **Destinations**
- `id` (PK)  
- `slug` (unique, SEO)  
- `name`, `country`, `region`  
- `image`, `description`  
- `packageCount`  
- `startingPrice`  
- `categoryId` → references **Categories**  
- `rating`, `reviewCount`  
- `bestTime`  

### **Packages**
- `id` (PK)  
- `slug` (unique, SEO)  
- `title`, `description`  
- `destinationId` → references **Destinations**  
- `categoryId` → references **Categories**  
- `duration`, `price`, `originalPrice`  
- `rating`, `reviewCount`  
- `image`, `featured`  

### **Categories**
- `id` (PK)  
- `name` (unique)  
- `slug` (unique)  
- `description`, `icon`  

### **Package Details**
- **Gallery**: multiple images per package  
- **Inclusions / Exclusions**: text-based lists  
- **Highlights**: trip highlights  
- **Itinerary**: day-wise breakdown  

### **Reviews**
- `id` (PK)  
- `packageId` → references **Packages**  
- `userName`, `userAvatar`  
- `rating`, `title`, `comment`  
- `date`, `verified`  

### **Bookings**
- `id` (PK)  
- `packageId` → references **Packages**  
- `fullName`, `email`, `phone`  
- `departureDate`, `returnDate`  
- `travelers`, `roomType`  
- `status` (default: pending)  
- `createdAt`  

---

## 🔑 Environment Variables

Create a `.env` file in your project root:

```env
# Database
DATABASE_URL=""

# Authentication
BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET=""

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=""

# Email Service (Resend)
RESEND_API_KEY=""
```

# 🚀 Getting Started

## Clone the Repository

```bash
git clone https://github.com/your-username/travel-booking-platform.git
cd travel-booking-platform
```

## Install Dependencies

```bash
npm install
```

## Set Up Environment File

Configure your `.env` file as described in the project documentation.

## Run Database Migrations

```bash
npm run db:push
```
