import type { Metadata } from "next";
import { JoinForm } from "@/components/forms/JoinForm";
import { SectionTitle } from "@/components/ui/SectionTitle";

export const metadata: Metadata = {
  title: "Join the VIP club",
  description:
    "Become a VIP member of the official Alan Ritchson fan club and get your numbered digital pass.",
};

export default function JoinPage() {
  return (
    <section className="bg-gradient-to-b from-oxblood via-wine to-ink text-bone">
      <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40 xl:px-20">
        <SectionTitle as="h1" className="max-w-[12ch]">
          Join the club.
        </SectionTitle>
        <p className="mt-6 max-w-[50ch] text-lg text-bone/80">
          First word on news roundups, watch-alongs and member drops. Your
          pass is numbered and emailed as soon as your Bitcoin payment confirms.
        </p>
        <div className="mt-14">
          <JoinForm />
        </div>
      </div>
    </section>
  );
}
