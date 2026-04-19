import { Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Header from './Header';
import Signin from './components/Signin';
import { createBrowserRouter } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// ✅ Protects /dashboard — redirects to / if not logged in
function ProtectedRoute({ children }) {
    const { session } = useAuth();

    if (session === undefined) {
        // Still loading session — show nothing or a spinner
        return <div style={{ padding: '2rem' }}>Loading...</div>;
    }

    if (!session) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Signin />,
    },
    {
        path: '/dashboard',
        element: (
            <ProtectedRoute>
                <Header />
                <Dashboard />
            </ProtectedRoute>
        ),
    },
]);