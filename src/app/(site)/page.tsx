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

export default function Home() {
  return (
    <>
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
