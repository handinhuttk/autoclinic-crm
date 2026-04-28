import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage';
import LeadsPage from './pages/LeadsPage';
import { LeadsProvider } from './context/LeadsContext';

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
  return (
    <LeadsProvider>
      <RouterProvider router={router} />
    </LeadsProvider>
  );
}
