import { PackagesScreen } from "@/components/packages-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

export default async function PackagesPageRoute({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.packages.getAll.queryOptions({ packageSlug: slug })
  );

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <PackagesScreen slug={slug} isPackage={true} />
        </HydrationBoundary>
      </main>
      <Footer />
    </div>
  );
}
