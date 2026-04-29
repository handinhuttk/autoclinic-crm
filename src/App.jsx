import { createBrowserRouter, RouterProvider } from 'react-router';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage';
import LeadsPage from './pages/LeadsPage';
import MetaAdsPage from './pages/MetaAdsPage';
import { LeadsProvider } from './context/LeadsContext';
import { ClienteProvider } from './context/ClienteContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true,      element: <DashboardPage /> },
      { path: 'kanban',   element: <KanbanPage />    },
      { path: 'leads',    element: <LeadsPage />     },
      { path: 'metaads',  element: <MetaAdsPage />   },
    ],
  },
]);

export default function App() {
  return (
    <ClienteProvider>
      <LeadsProvider>
        <RouterProvider router={router} />
      </LeadsProvider>
    </ClienteProvider>
  );
}
