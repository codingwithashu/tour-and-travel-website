import { PackageDetailPage } from "@/components/package-detail-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { caller, getQueryClient, trpc } from "@/trpc/server";
import { PackageDetailSkeleton } from "@/components/package-detail-skeleton";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { slug } = params;

  const packageData = await caller.packages.getBySlug({ slug });

  if (!packageData) {
    return {
      title: "Package Not Found - Atharv Travel",
    };
  }

  return {
    title: `${packageData?.title} - Atharv Travel`,
    description: packageData.description ?? undefined,
    keywords: `${packageData.destination}, ${packageData.category}, travel package, vacation, ${packageData.title}`,
    openGraph: {
      title: packageData.title,
      description: packageData.description ?? "",
      images: [packageData.image ?? "/placeholder.png"],
    },
  };
}

export default async function PackagePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.packages.getBySlug.queryOptions({ slug })
  );

  if (!slug) {
    notFound();
  }

  console.log("Slug:", slug);
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense fallback={<PackageDetailSkeleton />}>
            <PackageDetailPage slug={slug} />
          </Suspense>
        </HydrationBoundary>
      </main>
      <Footer />
    </div>
  );
}
