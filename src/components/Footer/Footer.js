import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaFacebook, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import './Footer.scss';

function Footer() {
  const isDarkTheme = useSelector((store) => store.theme.isDark);
  const [t] = useTranslation('global');

  return (
    <>
      <div className="flex justify-center px-10 py-5">
        <Outlet />
      </div>
      <div className="flex flex-wrap justify-evenly gap-32 footer-wrap
      bg-primary min-h-[315px] py-14 px-10 border-t border-t-lines"
      >
        <div className="flex flex-col gap-1 self-center">
          <Link to="/">
            <img
              src={`/logoTheme${isDarkTheme ? 'Dark' : 'Light'}.svg`}
              alt=""
              className="h-12"
            />
          </Link>
          <div className="divider-x" />
          <div className="flex justify-evenly">
            <div className="nav-button p-[9px]">
              <FaFacebook
                size={20}
              />
            </div>
            <div className="nav-button p-[9px]">
              <FaInstagram
                size={20}
              />
            </div>
            <div className="nav-button p-[9px]">
              <FaXTwitter
                size={20}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="heading-s">{t('footer.explore.title')}</h2>
          <p>{t('footer.explore.home')}</p>
          <p>{t('footer.explore.aboutUs')}</p>
          <p>{t('footer.explore.courses')}</p>
          <p>{t('footer.explore.pages')}</p>
          <p>{t('footer.explore.blog')}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="heading-s">{t('footer.information.title')}</h2>
          <p>{t('footer.information.privacyPolicy')}</p>
          <p>{t('footer.information.membership')}</p>
          <p>{t('footer.information.purchaseGuide')}</p>
          <p>{t('footer.information.termsOfService')}</p>
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="heading-s">{t('footer.getInTouch.title')}</h2>
          <address className="pl-5">{t('footer.getInTouch.address')}</address>
          <address className="pl-5">{t('footer.getInTouch.phone')}</address>
          <address className="pl-5">{t('footer.getInTouch.email')}</address>
        </div>
      </div>
    </>
  );
}

export default Footer;
