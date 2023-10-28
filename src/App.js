/* eslint-disable react/jsx-filename-extension */
import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { PulseLoader } from 'react-spinners';
import Header from './components/Header/Header';
import SignIn from './components/pages/SignIn/SignIn';
import SignUp from './components/pages/SignUp/SignUp';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Suspense fallback={(
        <div className="w-screen h-screen flex items-center justify-center">
          <PulseLoader
            color="var(--color-purple)"
            speedMultiplier={0.5}
          />
        </div>
        )}
      >
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
