import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClickAway } from 'react-use';
import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineForum } from 'react-icons/md';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setLoggedIn } from '../../store/authSlice';
import './Header.scss';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [t, i18n] = useTranslation('global');
  const [isShownLangMenu, setIsShownLangMenu] = useState(false);
  const langMenuRef = useRef(null);
  const [isShownUserMenu, setIsShownUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const isLoggedIn = useSelector((store) => store.auth.isLoggedIn);
  const [isLightTheme, setLightTheme] = useState(localStorage.getItem('theme') === 'light');

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsShownLangMenu(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(setLoggedIn(false));
    navigate('/sign-in');
  };

  useClickAway(langMenuRef, () => setIsShownLangMenu(false));
  useClickAway(userMenuRef, () => setIsShownUserMenu(false));

  const toggleTheme = () => {
    setLightTheme((prevState) => !prevState);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', !isLightTheme);
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
  }, [isLightTheme]);

  return (
    <div
      className="sticky top-0 left-0 z-50 flex justify-between
        items-center bg-primary h-16 px-10 border-b border-b-lines"
    >
      <Link to="/">
        <img
          src={`/logoTheme${isLightTheme ? 'Light' : 'Dark'}.svg`}
          alt=""
          className="h-12"
        />
      </Link>
      <div
        className="flex gap-6 items-center"
      >
        <div ref={langMenuRef}>
          <button
            type="button"
            onClick={() => setIsShownLangMenu((value) => !value)}
            className="button w-[34px] h-[34px]"
          >
            {i18n.language}
          </button>
          <div
            className="menu body-text-m -translate-x-8"
            style={isShownLangMenu ? {} : { display: 'none' }}
          >
            <button
              type="button"
              onClick={() => handleChangeLanguage('en')}
              className="menu-option wide"
            >
              <p className="whitespace-nowrap">English (US)</p>
              <p>en</p>
            </button>
            <div className="divider-x" />
            <button
              type="button"
              onClick={() => handleChangeLanguage('uk')}
              className="menu-option wide"
            >
              <p>Ukraine</p>
              <p>uk</p>
            </button>
          </div>
        </div>
        <button type="button" className="button" onClick={() => toggleTheme()}>
          {isLightTheme
            ? <FiSun size={22} />
            : <FiMoon size={22} />}
        </button>
        {isLoggedIn ? (
          <>
            <Link to="forum" className="button">
              <MdOutlineForum size={22} />
            </Link>
            <div
              ref={userMenuRef}
              className="flex gap-6 items-center"
            >
              <button
                type="button"
                className="button"
                onClick={() => setIsShownUserMenu((value) => !value)}
              >
                <AiOutlineUser
                  size={22}
                />
              </button>
              <div
                className="menu translate-y-[76px] -translate-x-12"
                style={isShownUserMenu ? {} : { display: 'none' }}
              >
                <Link
                  to="/courses/my"
                  className="menu-option whitespace-nowrap"
                >
                  {t('myCourses')}
                </Link>
                <div className="divider-x" />
                <Link
                  to="/account"
                  className="menu-option"
                >
                  {t('header.account')}
                </Link>
                <div className="divider-x" />
                <button
                  type="button"
                  className="menu-option"
                  onClick={handleLogout}
                >
                  {t('header.logout')}
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <Link
              to="/sign-in"
              className="border border-lines px-3 py-1 rounded-[4px] hover:bg-secondary"
            >
              {t('header.signIn')}
            </Link>
            <Link
              to="/sign-up"
              className="bg-lightPurple hover:bg-purple text-[#fff] px-3 py-1 rounded-[4px]"
            >
              {t('header.signUp')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
