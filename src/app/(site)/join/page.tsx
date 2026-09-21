import type { Metadata } from "next";
import { JoinForm } from "@/components/forms/JoinForm";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata: Metadata = pageMetadata({
  title: "Join the VIP Club",
  socialTitle: "Join the VIP Club | Alan Ritchson Fan Club",
  description:
    "Request lifetime VIP access to the official Alan Ritchson fan club: a numbered pass, private community, member pricing and first notice on drops.",
  path: "/join",
});

export default function JoinPage() {
  return (
    <section className="bg-gradient-to-b from-oxblood via-wine to-ink text-bone">
      <JsonLd data={breadcrumbLd([{ name: "Join the VIP Club", path: "/join" }])} />
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40 xl:px-20">
        <SectionTitle as="h1" className="max-w-[12ch]">
          Join the club.
        </SectionTitle>
        <p className="mt-6 max-w-[50ch] text-lg text-bone/80">
          First word on news roundups, watch-alongs and member drops. Your
          pass is numbered and issued once your payment is confirmed.
        </p>
        <div className="mt-14">
          <JoinForm />
        </div>
      </div>
    </section>
  );
}
