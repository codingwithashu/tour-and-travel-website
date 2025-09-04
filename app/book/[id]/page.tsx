import { BookingPage } from "@/components/booking-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

interface BookingPageProps {
  params: {
    id: string;
  };
}

// export async function generateMetadata({
//   params,
// }: BookingPageProps): Promise<Metadata> {
//   const packageData = getPackageById(params.id);

//   if (!packageData) {
//     return {
//       title: "Package Not Found - Atharv Travel",
//     };
//   }

//   return {
//     title: `Book ${packageData.title} - Atharv Travel`,
//     description: `Book your ${packageData.title} package to ${packageData.destination}. Secure booking with instant confirmation.`,
//   };
// }

export default async function BookingPageRoute({ params }: BookingPageProps) {
  const { id } = await params;

  if (!params) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <BookingPage id={id} />
      </main>
      <Footer />
    </div>
  );
}
