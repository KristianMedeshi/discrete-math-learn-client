import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClickAway } from 'react-use';
import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineForum } from 'react-icons/md';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { setIsAuthorized } from '../../store/authSlice';
import './Header.scss';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [t, i18n] = useTranslation('global');
  const [isShownLangMenu, setIsShownLangMenu] = useState(false);
  const langMenuRef = useRef(null);
  const [isShownUserMenu, setIsShownUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const isAuthorized = useSelector((store) => store.auth.isAuthorized);
  const [isLightTheme, setLightTheme] = useState(localStorage.getItem('theme') === 'light');

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsShownLangMenu(false);
  };

  const handleLogout = () => {
    dispatch(setIsAuthorized(false));
    navigate('/sign-in');
  };

  useClickAway(langMenuRef, () => setIsShownLangMenu(false));
  useClickAway(userMenuRef, () => setIsShownUserMenu(false));

  const toggleTheme = () => {
    setLightTheme((prevState) => !prevState);
  };

  useEffect(() => {
    if (isLightTheme) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
    localStorage.setItem('theme', isLightTheme ? 'light' : 'dark');
  }, [isLightTheme]);

  return (
    <div
      className="sticky top-0 left-0 z-50 flex justify-between
        items-center bg-primary h-16 px-10 border-b border-b-lines"
    >
      <Link to="/">
        <img
          src="/logo.svg"
          alt=""
          className="h-12"
        />
      </Link>
      <div
        ref={langMenuRef}
        className="flex gap-6 items-center"
      >
        <button
          type="button"
          onClick={() => setIsShownLangMenu((value) => !value)}
          className="button"
        >
          {i18n.language}
        </button>
        <button type="button" className="button">
          {isLightTheme
            ? <FiSun size={22} onClick={() => toggleTheme()} />
            : <FiMoon size={22} onClick={() => toggleTheme()} />}
        </button>
        <div
          className="flex body-text-m flex-col absolute translate-y-14 -translate-x-8
            bg-primary rounded-s shadow-[0_1px_5px_2px_rgba(0,0,0,0.1)] border-2 border-lines
            rounded-md"
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
          <div className="divider" />
          <button
            type="button"
            onClick={() => handleChangeLanguage('uk')}
            className="menu-option wide"
          >
            <p>Ukraine</p>
            <p>uk</p>
          </button>
        </div>
        {isAuthorized ? (
          <>
            <Link to="forum" className="button">
              <MdOutlineForum size={22} />
            </Link>
            <div
              ref={userMenuRef}
              className="flex gap-6 items-center"
            >
              <div className="button">
                <AiOutlineUser
                  size={22}
                  onClick={() => setIsShownUserMenu((value) => !value)}
                />
              </div>
              <div
                className="flex flex-col justify-start absolute translate-y-14 -translate-x-12
                bg-primary rounded-s shadow-[0_1px_5px_2px_rgba(0,0,0,0.1)] border-2 border-lines
                rounded-md  "
                style={isShownUserMenu ? {} : { display: 'none' }}
              >
                <Link
                  to="/account"
                  className="menu-option"
                >
                  Account
                </Link>
                <div className="divider" />
                <button
                  type="button"
                  className="menu-option"
                  onClick={handleLogout}
                >
                  Logout
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
              className="bg-lightPurple hover:bg-purple text-[#fff] px-3 py-1 rounded-[4px] hover:"
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
