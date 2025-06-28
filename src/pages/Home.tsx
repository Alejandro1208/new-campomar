import TopBar from '../components/Layout/TopBar';
import Navbar from '../components/Layout/Navbar';
import HeroBanner from '../components/Home/HeroBanner';
import CompanySection from '../components/Home/CompanySection';
import Timeline from '../components/Home/Timeline';
import ProductsSection from '../components/Home/ProductsSection';
import LocationSection from '../components/Home/LocationSection';
import Footer from '../components/Layout/Footer';
import FloatingElements from '../components/Layout/FloatingElements';

export default function Home() {
  return (
    <div className="min-h-screen">
      <TopBar />
      <Navbar />
      <main>
        <HeroBanner />
        <CompanySection />
        <Timeline />
        <ProductsSection />
        <LocationSection />
      </main>
      <Footer />
      <FloatingElements />
    </div>
  );
}