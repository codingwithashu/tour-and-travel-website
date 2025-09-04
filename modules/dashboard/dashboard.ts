import { count } from "drizzle-orm"
import { destinations, packages, categories, bookings } from "@/db/schema"
import { baseProcedure, createTRPCRouter } from "@/trpc/init"
import { db } from "@/db"
import { eq } from "drizzle-orm"

export const dashboardRouter = createTRPCRouter({
  getDashboardStats: baseProcedure.query(async ({ ctx }) => {
    const [destinationsCount] = await db.select({ count: count() }).from(destinations)

    const [packagesCount] = await db.select({ count: count() }).from(packages)

    const [categoriesCount] = await db.select({ count: count() }).from(categories)

    const [bookingsCount] = await db.select({ count: count() }).from(bookings)

    return {
      destinations: destinationsCount?.count ?? 0,
      packages: packagesCount?.count ?? 0,
      categories: categoriesCount?.count ?? 0,
      bookings: bookingsCount?.count ?? 0,
    }
  }),
  getPackagesByCategory: baseProcedure.query(async () => {
    const rows = await db
      .select({
        categoryId: packages.categoryId,
        categoryName: categories.name,
      })
      .from(packages)
      .leftJoin(categories, eq(packages.categoryId, categories.id));

    const categoryStats = rows.reduce<Record<string, number>>((acc, row) => {
      const categoryName = row.categoryName ?? "Unknown";
      acc[categoryName] = (acc[categoryName] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryStats).map(([name, count]) => ({
      name,
      count,
    }));
  }),
})
