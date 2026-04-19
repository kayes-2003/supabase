import { RouterProvider } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthContext';
import { router } from './router';
import './App.css';

function App() {
  return (
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  );
}

export default App;