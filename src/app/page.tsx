import { Nav } from "@/components/nav";
import { Hero } from "@/components/hero";
import { ProjectsSection } from "@/components/projects-section";
import { ArticlesSection } from "@/components/articles-section";
import { SystemsSection } from "@/components/systems-section";
import { StackSection } from "@/components/stack-section";
import { ContactSection } from "@/components/contact-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <ProjectsSection />
        <ArticlesSection />
        <SystemsSection />
        <StackSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
