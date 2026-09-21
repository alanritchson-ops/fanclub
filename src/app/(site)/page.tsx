import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { faqLd, pageMetadata, personLd } from "@/lib/seo";
import { site } from "@/lib/site";
import { Hero } from "@/components/sections/Hero";
import { Ticker } from "@/components/sections/Ticker";
import { Note } from "@/components/sections/Note";
import { Roots } from "@/components/sections/Roots";
import { Screen } from "@/components/sections/Screen";
import { Store } from "@/components/sections/Store";
import { Benefits } from "@/components/sections/Benefits";
import { Pass } from "@/components/sections/Pass";
import { Community } from "@/components/sections/Community";
import { Team } from "@/components/sections/Team";
import { Faq } from "@/components/sections/Faq";
import { ContactBlock } from "@/components/sections/Contact";

export const metadata: Metadata = pageMetadata({
  title: { absolute: `${site.name} Fan Club | Official News, Reacher & VIP Membership` },
  socialTitle: `${site.name} Fan Club | Official News, Reacher & VIP Membership`,
  description:
    "The official Alan Ritchson fan club: Reacher and Neagley news, where to watch War Machine, Titans and Smallville, watch-alongs, merch and a lifetime VIP pass.",
  path: "/",
});

export default function Home() {
  return (
    <>
      <JsonLd data={[personLd, faqLd]} />
      <Hero />
      <Ticker />
      <Note />
      <Roots />
      <Screen />
      <Store />
      <Benefits />
      <Pass />
      <Community />
      <Team />
      <Faq />
      <ContactBlock />
    </>
  );
}
