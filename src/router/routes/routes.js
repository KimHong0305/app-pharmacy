import adminRoutes from './adminRoutes';
import MainLayout from './../../layout/MainLayout';
import employeeRoutes from './employeeRoutes';
import nurseRoutes from './nurseRoutes';

export const routes = [
    {
      path: '/',
      element: <MainLayout />,
      children: [
        ...adminRoutes,
        ...employeeRoutes,
        ...nurseRoutes,
      ],
    },
];