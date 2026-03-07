import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export const metadata = {
  title: "Contact — Kris Welc",
};

export default function ContactPage() {
  return (
    <>
      <main className="pt-16">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
