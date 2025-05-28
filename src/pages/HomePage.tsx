import React from 'react';
import TopBar from '../components/TopBar';
import Navigation from '../components/Navigation';
import Banner from '../components/Banner';
import Company from '../components/Company';
import Timeline from '../components/Timeline';
import Products from '../components/Products';
import Location from '../components/Location';
import Footer from '../components/Footer';
import FloatingElements from '../components/FloatingElements';

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <Navigation />
      <Banner />
      <main>
        <Company />
        <Timeline />
        <Products />
        <Location />
      </main>
      <Footer />
      <FloatingElements />
    </div>
  );
};

export default HomePage;