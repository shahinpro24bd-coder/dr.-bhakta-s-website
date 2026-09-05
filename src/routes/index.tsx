import { createFileRoute, redirect } from "@tanstack/react-router";

// The site is a static HTML site served from /public.
// "/" forwards to the static home page.
export const Route = createFileRoute("/")({
  beforeLoad: () => {
    throw redirect({ href: "/index.html" });
  },
  head: () => ({
    meta: [
      { title: "Dr. Ananta Kumar Bhakta | Orthopedic & Spine Surgeon, Uttara, Dhaka" },
      {
        name: "description",
        content:
          "Dr. Ananta Kumar Bhakta — MBBS, BCS (Health), MS Orthopedics (NITOR), Endoscopic Spine Surgeon. Chambers in Uttara, Dhaka and Narsingdi. Serial: 01830-995336.",
      },
      {
        property: "og:title",
        content: "Dr. Ananta Kumar Bhakta | Orthopedic & Spine Surgeon",
      },
      {
        property: "og:description",
        content:
          "Orthopedic, spine and endoscopic spine surgery care in Uttara, Dhaka. Serial booking: 01830-995336.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => null,
});
