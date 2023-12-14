import '@/styles/globals.css';
import PropTypes from 'prop-types';
import { Suspense } from 'react';
import { appWithTranslation } from 'next-i18next';
import nextI18NextConfig from 'next-i18next.config.cjs';

function App({ Component, pageProps }) {
  return (
    <Suspense fallback="...loading">
      <Component {...pageProps} />
    </Suspense>
  );
}

App.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.any.isRequired,
};

export default appWithTranslation(App, nextI18NextConfig);
