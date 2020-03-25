import React from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { Link } from 'react-navi';
import { Routes } from 'utils/constants';
import useLanguage from 'hooks/useLanguage';
import CookieNotice from '../components/CookieNotice';
import { hot } from 'react-hot-loader/root';

const MarketingLayoutStyle = styled.div`
  /*! minireset.css v0.0.3 | MIT License | github.com/jgthms/minireset.css */
  p,
  ol,
  ul,
  li,
  dl,
  dt,
  dd,
  blockquote,
  figure,
  fieldset,
  legend,
  textarea,
  pre,
  iframe,
  hr,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-size: 100%;
    font-weight: normal;
  }

  ul {
    list-style: none;
  }

  button,
  input,
  select,
  textarea {
    margin: 0;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  img,
  embed,
  iframe,
  object,
  audio,
  video {
    height: auto;
    max-width: 100%;
  }

  iframe {
    border: 0;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  td,
  th {
    padding: 0;
    text-align: left;
  }
  /* end minireset */

  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: auto;
  padding: 0 40px;
  font-family: 'FT Base', Arial, Helvetica, sans-serif;
  font-weight: normal;
  font-style: normal;
  letter-spacing: normal;
  text-align: center;
  color: black;
  width: 100%;

  @media only screen and (max-width: 425px) {
    padding: 0 10px;
  }

  a {
    color: black;
    text-decoration: none;
  }
`;

const Header = styled.header`
  text-align: left;
  letter-spacing: 0.3px;

  .logo {
    font-size: 22px;
    line-height: 26px;
    font-weight: bold;
  }
`;

const Nav = styled.nav`
  float: right;
  display: flex;
  justify-content: center;
  font-size: 16px;

  a {
    text-decoration: none;
    color: black;
  }

  a:hover {
    color: #6d6d6d;
  }

  a:not(:first-child) {
    margin-left: ${props => props.separation || '56px'};
  }
`;

const MainNav = () => {
  const { lang } = useLanguage();

  return (
    <Nav style={{ fontSize: '19px' }}>
      <Link href={`${Routes.TRADE}`}>{lang.navbar.trade}</Link>
      <Link href={`${Routes.SAVE}`}>{lang.navbar.save}</Link>
      <Link href={`${Routes.BORROW}`}>{lang.navbar.borrow}</Link>
    </Nav>
  );
};

const centerFooterMaxWidth = '640px';

const Footer = styled.footer`
  margin-top: 90px;
  margin-bottom: 70px;
  letter-spacing: 0.3px;

  *,
  *:before,
  *:after {
    position: static;
  }

  ${Nav} {
    @media (max-width: ${centerFooterMaxWidth}) {
      float: none;
    }
  }

  .copyright {
    text-align: left;
    font-size: 16px;
    white-space: nowrap;

    @media (max-width: ${centerFooterMaxWidth}) {
      padding-top: 60px;
      text-align: center;
    }

    @media (max-width: 425px) {
      font-size: 13px;
    }
  }
`;

// It has the Oasis logo, the top nav links, and the copyright notice.
const MarketingLayout = ({ children }) => {
  const { lang } = useLanguage();
  return (
    <MarketingLayoutStyle>
      <div
        style={{
          margin: '0 auto',
          maxWidth: 1203,
          paddingTop: '41px',
          width: '100%'
        }}
      >
        <Helmet>
          <link
            rel="preload"
            as="font"
            href="/fonts/FTBase-Regular.woff2"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            href="/fonts/FTBase-Regular.woff"
            type="font/woff"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            href="/fonts/FTBase-Bold.woff2"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            as="font"
            href="/fonts/FTBase-Bold.woff"
            type="font/woff"
            crossOrigin="anonymous"
          />
        </Helmet>
        <Header>
          <Link className="logo" href="/">
            Oasis
          </Link>
          <MainNav />
        </Header>
        {children}
        <CookieNotice />
        <Footer>
          <Nav>
            <Link href={`/${Routes.PRIVACY}`}>{lang.navbar.privacy}</Link>
            <Link href={`/${Routes.TERMS}`}>{lang.navbar.terms}</Link>
          </Nav>
          <div className="copyright">
            © {new Date().getFullYear()} Maker Ecosystem Growth Holdings, Inc.
          </div>
        </Footer>
      </div>
    </MarketingLayoutStyle>
  );
};

export default hot(MarketingLayout);
