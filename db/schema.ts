import {
  pgTable,
  serial,
  varchar,
  integer,
  boolean,
  decimal,
  text,
  date,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";


export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").default("member").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// -------------------------
// Destinations
// -------------------------
export const destinations = pgTable(
  "destinations",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(), // 👈 SEO slug
    name: varchar("name", { length: 255 }).notNull(),
    country: varchar("country", { length: 100 }),
    region: varchar("region", { length: 100 }),
    image: text("image"),
    description: text("description"),
    packageCount: integer("package_count").default(0).notNull(),
    startingPrice: decimal("starting_price", { precision: 10, scale: 2 }),
    categoryId: integer("category_id")
      .references(() => categories.id, { onDelete: "cascade" })
      .notNull(),
    rating: decimal("rating", { precision: 3, scale: 2 }),
    reviewCount: integer("review_count").default(0).notNull(),
    bestTime: varchar("best_time", { length: 255 }),
  },
  (table) => ({
    slugIdx: uniqueIndex("destinations_slug_idx").on(table.slug),
  })
);

// -------------------------
// Packages
// -------------------------
export const packages = pgTable(
  "packages",
  {
    id: serial("id").primaryKey(),
    slug: varchar("slug", { length: 255 }).notNull().unique(), // 👈 SEO-friendly slug
    title: varchar("title", { length: 255 }).notNull(),
    destinationId: integer("destination_id")
      .references(() => destinations.id)
      .notNull(),
    categoryId: integer("category_id")
      .references(() => categories.id)
      .notNull(),
    duration: varchar("duration", { length: 100 }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
    rating: decimal("rating", { precision: 2, scale: 1 }),
    reviewCount: integer("review_count").default(0),
    image: text("image"),
    featured: boolean("featured").default(false),
    description: text("description"),
  },
  (table) => ({
    slugIdx: uniqueIndex("packages_slug_idx").on(table.slug), // enforce uniqueness
  })
);

// -------------------------
// Categories
// -------------------------
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  icon: varchar("icon", { length: 100 }), // optional, e.g. for UI
});


// -------------------------
// Package Gallery
// -------------------------
export const packageGallery = pgTable("package_gallery", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id")
    .references(() => packages.id, { onDelete: "cascade" })
    .notNull(),
  imageUrl: text("image_url").notNull(),
});

// -------------------------
// Package Inclusions
// -------------------------
export const packageInclusions = pgTable("package_inclusions", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id")
    .references(() => packages.id, { onDelete: "cascade" })
    .notNull(),
  inclusion: text("inclusion").notNull(),
});

// -------------------------
// Package Exclusions
// -------------------------
export const packageExclusions = pgTable("package_exclusions", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id")
    .references(() => packages.id, { onDelete: "cascade" })
    .notNull(),
  exclusion: text("exclusion").notNull(),
});

// -------------------------
// Package Highlights
// -------------------------
export const packageHighlights = pgTable("package_highlights", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id")
    .references(() => packages.id, { onDelete: "cascade" })
    .notNull(),
  highlight: text("highlight").notNull(),
});

// -------------------------
// Package Itinerary
// -------------------------
export const packageItinerary = pgTable("package_itinerary", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id")
    .references(() => packages.id, { onDelete: "cascade" })
    .notNull(),
  dayNumber: integer("day_number").notNull(),
  title: varchar("title", { length: 255 }),
  description: text("description"),
});

// -------------------------
// Reviews
// -------------------------
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id")
    .references(() => packages.id, { onDelete: "cascade" })
    .notNull(),
  userName: varchar("user_name", { length: 100 }).notNull(),
  userAvatar: text("user_avatar"),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  comment: text("comment"),
  date: date("date").defaultNow(),
  verified: boolean("verified").default(false),
});

// -------------------------
// Bookings
// -------------------------
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),

  packageId: integer("package_id")
    .references(() => packages.id, { onDelete: "cascade" })
    .notNull(),

  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),

  departureDate: varchar("departure_date", { length: 20 }).notNull(),
  returnDate: varchar("return_date", { length: 20 }).notNull(),
  travelers: integer("travelers").notNull(),
  roomType: varchar("room_type", { length: 50 }).notNull(),

  status: varchar("status", { length: 50 }).default("pending"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});