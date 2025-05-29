import { lazy } from "react";

const Chat = lazy(() => import("../../pages/nurse/Chat"));

// Dashboard
const NurseDashboard = lazy(() => import("../../pages/nurse/NurseDashboard"));

export const nurseRoutes = [
    { path: 'nurse/dashboard', element: <NurseDashboard />, role: 'ROLE_NURSE' },

    { path: 'nurse/chat', element: <Chat />, role: 'ROLE_NURSE' },
];

export default nurseRoutes;