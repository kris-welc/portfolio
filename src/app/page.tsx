import { Hero } from "@/components/hero";
import { ArticlesSection } from "@/components/articles-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <ArticlesSection />
      </main>
      <Footer />
    </>
  );
}
