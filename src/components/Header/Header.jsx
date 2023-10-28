import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useClickAway } from 'react-use';

function Header() {
  const [t, i18n] = useTranslation('global');
  const [isShownLangMenu, setIsShownLangMenu] = useState(false);
  const langMenuRef = useRef(null);
  const isAuthorized = false;

  const handleChangeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setIsShownLangMenu(false);
  };

  useClickAway(langMenuRef, () => setIsShownLangMenu(false));

  return (
    <div
      className="sticky top-0 left-0 flex justify-between items-center bg-primary h-16 px-10
        shadow-[0_-6px_10px_5px_rgba(0,0,0,0.5)]"
    >
      <Link to="/">
        <img
          src="logo.svg"
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
          className="mx-4"
        >
          {i18n.language}
        </button>
        <div
          className="flex flex-col absolute translate-y-12 -translate-x-1 py-1
            bg-primary rounded-md shadow-[0_1px_5px_2px_rgba(0,0,0,0.1)]"
          style={isShownLangMenu ? {} : { display: 'none' }}
        >
          <button
            type="button"
            onClick={() => handleChangeLanguage('en')}
            className="px-3 mx-2 border-b border-b-purple"
          >
            en

          </button>
          <button type="button" onClick={() => handleChangeLanguage('uk')}>uk</button>
        </div>
        {isAuthorized ? (
          <>x</>
        ) : (
          <>
            <Link
              to="/sign-in"
              className="border border-purple px-3 py-1 rounded-[4px] hover:opacity-75"
            >
              {t('header.signIn')}
            </Link>
            <Link
              to="/sign-up"
              className="border bg-purple text-[#fff] px-3 py-1 rounded-[4px] hover:opacity-75"
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
