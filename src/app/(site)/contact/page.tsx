import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/JsonLd";
import { abs, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  socialTitle: "Contact the Alan Ritchson Fan Club",
  description:
    "Contact the official Alan Ritchson fan club for fan support, press and partnership enquiries, or to report an impersonator.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <section className="bg-gradient-to-b from-oxblood via-wine to-ink text-bone">
      <JsonLd
        data={[
          { "@context": "https://schema.org", "@type": "ContactPage", name: "Contact the fan club", url: abs("/contact") },
          breadcrumbLd([{ name: "Contact", path: "/contact" }]),
        ]}
      />
      <div className="mx-auto grid max-w-[1400px] gap-14 px-5 pb-24 pt-32 md:px-10 md:pb-32 md:pt-40 lg:grid-cols-[1fr_1.1fr] lg:gap-20 xl:px-20">
        <div>
          <SectionTitle as="h1">Get in touch.</SectionTitle>
          <p className="mt-6 max-w-[44ch] text-lg text-bone/80">
            For press and partnerships, or fan club and order support, write
            below. Expect a reply within two business days.
          </p>
          <p className="mt-6 max-w-[44ch] text-bone/65">
            The club team reads everything sent here. For bookings and business
            enquiries, please contact Alan&apos;s representatives directly.
            Prefer email? Write to{" "}
            <a className="underline underline-offset-2" href={`mailto:${site.emails.support}`}>
              {site.emails.support}
            </a>
            .
          </p>
        </div>
        <ContactForm />
      </div>
    </section>
  );
}
