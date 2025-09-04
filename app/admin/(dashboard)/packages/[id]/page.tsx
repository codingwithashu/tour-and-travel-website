"use client";

import React from "react";
import { useParams } from "next/navigation";
import PackageDetailScreen from "@/components/admin/package/package-details";

export default function PackageDetailPage() {
  const params = useParams();
  const packageId = params.id as string;

  return <PackageDetailScreen packageId={packageId} />;
}
