import { PackageDetailPage } from "@/components/package-detail-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { notFound } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function PackagePage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
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
          <PackageDetailPage slug={slug} />
        </HydrationBoundary>
      </main>
      <Footer />
    </div>
  );
}
