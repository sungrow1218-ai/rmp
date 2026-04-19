import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * A blank layout component that just renders the child routes.
 * Used for pages like login, where the main app navigation is not needed.
 */
const BlankLayout: React.FC = () => {
  return <Outlet />;
};

export default BlankLayout;
