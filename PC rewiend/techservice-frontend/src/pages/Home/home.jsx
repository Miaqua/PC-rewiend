import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Hero from '../../components/Hero/Hero';
import ServicesSection from '../../components/Services/Services';
import Specialists from '../../components/Specialists/Specialists';
import NewsSection from '../../components/NewsSection/NewsSection';
import AboutSection from '../../components/AboutSection/AboutSection';
import ContactsSection from '../../components/ContactForm/ContactsSection';
import ContactForm from '../../components/ContactForm/ContactForm';

const HomePage = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100); 
      }
    }
  }, [location]);

  return (
    <main>
      <Hero />
      <ServicesSection />
      <Specialists />
      <NewsSection />
      <AboutSection />
      <ContactsSection />
      <ContactForm />
    </main>
  );
};

export default HomePage;












