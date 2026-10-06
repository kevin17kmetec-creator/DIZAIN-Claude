import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

// MINIMAL: klasična zgornja vrstica, središčna postavitev
const Shell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <Navbar />
    <main id="main" className="relative z-10 w-full flex-grow flex flex-col">{children}</main>
    <Footer />
  </>
);

export default Shell;
