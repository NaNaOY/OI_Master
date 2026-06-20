import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { AppRoutes } from './App';
import { useUserStore } from './store/useUserStore';
import { useEffect } from 'react';
import './styles/globals.css';

function App() {
  const { loadUser } = useUserStore();

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return <AppRoutes />;
}

const root = createRoot(document.getElementById('root')!);
root.render(
  <HashRouter>
    <App />
  </HashRouter>
);