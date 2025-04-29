import React from 'react';
import { Outlet } from 'react-router-dom';

// This is a special layout that doesn't include the Header and Footer
const LandingPageLayout = () => {
  return (
    <div className="landing-page-container">
      <Outlet />
    </div>
  );
};

export default LandingPageLayout;