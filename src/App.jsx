import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage';
import LeadsPage from './pages/LeadsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'kanban', element: <KanbanPage /> },
      { path: 'leads', element: <LeadsPage /> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
