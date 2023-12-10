import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  BrowserRouter, Route, Routes,
} from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Header from './components/Header';
import Footer from './components/Footer';
import AuthGuard from './components/AuthGuard';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Forum from './pages/Forum';
import Question from './pages/Question';
import AskQuestion from './pages/AskQuestion';
import Account from './pages/Account';
import Course from './pages/Course';
import CreateCourse from './pages/CreateCourse';
import AddCourseChapter from './pages/AddCourseChapter';
import MyCourses from './pages/MyCourses';
import EditQuestion from './pages/EditQuestion';
import { setUserId } from './store/authSlice';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';
import './App.scss';

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
      if (isJwtExpired(localStorage.getItem('token'))) {
        dispatch(setUserId(null));
      }
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
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Footer />}>
          <Route path="/" element={<Home />} />
          <Route element={<AuthGuard />}>
            <Route path="/forum">
              <Route path="" element={<Forum />} />
              <Route path=":questionId" element={<Question />} />
              <Route path="edit/:questionId" element={<EditQuestion />} />
              <Route path="ask" element={<AskQuestion />} />
            </Route>
            <Route path="/account" element={<Account />} />
            <Route path="/courses">
              <Route path=":id" element={<Course />} />
              <Route path="add" element={<CreateCourse />} />
              <Route path=":id/add" element={<AddCourseChapter />} />
              <Route path="my" element={<MyCourses />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
