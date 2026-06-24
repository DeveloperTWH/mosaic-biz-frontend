import { getFrontendBuildInfo, isLikelySafePublicBuildInfo } from "@/lib/release/buildInfo";

export const dynamic = "force-dynamic";

export function GET() {
  const buildInfo = {
    ...getFrontendBuildInfo(),
    timestamp: new Date().toISOString(),
  };

  if (!isLikelySafePublicBuildInfo(buildInfo)) {
    return Response.json(
      {
        service: "mosaic-biz-frontend",
        release: {
          commit: "unknown",
          environment: "unknown",
          branch: "unknown",
          deploymentId: "unknown",
        },
      },
      { status: 500 }
    );
  }

  return Response.json(buildInfo);
}
