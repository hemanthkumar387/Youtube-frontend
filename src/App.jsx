import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Navbar from './components/Main/Main';
import VideoGrid from './components/VideoItem/VideoItem';

// Lazy-loaded components
const VideoPage = lazy(() => import('./components/VideoModal/VideoModal'));
const Login = lazy(() => import('./components/Login/Login'));
const Register = lazy(() => import('./components/Register/Register'));
const CreateChannel = lazy(() => import('./components/CreateChannel/CreateChannel'));
const ViewChannel = lazy(() => import('./components/ViewChannel/ViewChannel'));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<VideoGrid />} />
          <Route
            path="/video/:id"
            element={
              <Suspense fallback={<div>Loading video...</div>}>
                <VideoPage />
              </Suspense>
            }
          />
          <Route
            path="/channel/:userId"
            element={
              <Suspense fallback={<div>Loading channel...</div>}>
                <ViewChannel />
              </Suspense>
            }
          />
        </Route>
        <Route
          path="/login"
          element={
            <Suspense fallback={<div>Loading login...</div>}>
              <Login />
            </Suspense>
          }
        />
        <Route
          path="/register"
          element={
            <Suspense fallback={<div>Loading register...</div>}>
              <Register />
            </Suspense>
          }
        />
        <Route
          path="/create-channel"
          element={
            <Suspense fallback={<div>Loading channel creation...</div>}>
              <CreateChannel />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
