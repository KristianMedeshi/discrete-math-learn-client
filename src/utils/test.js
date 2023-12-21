import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import i18next from 'i18next';
import globalEn from '../translations/en/global.json';
import globalUa from '../translations/ua/global.json';
import tagsEn from '../translations/en/tags.json';
import tagsUa from '../translations/ua/tags.json';
import store from '../store';

i18next.init({
  interpolation: { escapeValue: true },
  lng: localStorage.getItem('language') ?? 'en',
  resources: {
    en: {
      global: globalEn,
      tags: tagsEn,
    },
    ua: {
      global: globalUa,
      tags: tagsUa,
    },
  },
});

const queryClient = new QueryClient();

function Wrapper({ children }) {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <I18nextProvider i18n={i18next}>
            <BrowserRouter>
              {children}
            </BrowserRouter>
          </I18nextProvider>
        </QueryClientProvider>
      </Provider>
    </React.StrictMode>
  );
}

export const getById = (container, id) => container.querySelector(`#${id}`);

const customRender = (ui, options) => render(ui, { wrapper: Wrapper, ...options });

export default customRender;
