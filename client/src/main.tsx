import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import Dashboard from './pages/Dashboard/Dashboard';

import NotFound from './pages/NotFound';
import Login from './pages/Login/Login';
import MyPlaylistPage from './pages/MyPlaylist/MyPlaylistPage';
import Signup from './pages/Signup/Signup';


const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />
      },
        {
          path: '/login',
          element: <Login />
        },
        {
          path: '/signup',
          element: <Signup />
        },
        {
          path: '/my-playlists/:playlistId',
          element: <MyPlaylistPage />
        },
    ],
  },
]);

const rootElement = document.getElementById('root');

if(rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <RouterProvider router={router} />
  );
}

