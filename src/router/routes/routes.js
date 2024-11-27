import adminRoutes from './adminRoutes';
import MainLayout from './../../layout/MainLayout';

export const routes = [
    {
      path: '/',
      element: <MainLayout />,
      children: adminRoutes,
    },
];