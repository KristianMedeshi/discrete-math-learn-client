import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter, Route, Routes,
} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import AuthGuard from './components/AuthGuard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Forum from './pages/Forum';
import Question from './pages/Question';
import AskQuestion from './pages/AskQuestion';
import { setLoggedIn } from './store/authSlice';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import './App.css';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const intervalTime = 60000;

    const isJwtExpired = (token) => {
      if (!token) return true;
      const { exp } = jwtDecode(token);
      const currentTime = (new Date().getTime() + intervalTime) / 1000;
      return currentTime > exp;
    };

    const checkJwtExpiration = () => {
      dispatch(setLoggedIn(!isJwtExpired(localStorage.getItem('token'))));
    };

    checkJwtExpiration();

    const interval = setInterval(() => {
      checkJwtExpiration();
    }, intervalTime);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Header />
      <div className="flex justify-center px-10 py-5">
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route element={<AuthGuard />}>
            <Route path="/forum">
              <Route path="" element={<Forum />} />
              <Route path=":questionId" element={<Question />} />
              <Route path="ask" element={<AskQuestion />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
