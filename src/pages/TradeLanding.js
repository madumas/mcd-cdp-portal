import React from 'react';
import { hot } from 'react-hot-loader/root';
import { Link } from 'react-navi';
import PageContentLayout from 'layouts/PageContentLayout';

import {
  buildQuestionsFromLangObj,
  ConnectHero,
  Features,
  FixedHeaderTrigger,
  FullWidth,
  Questions,
  Quotes,
  ThickUnderline,
  Parallaxed,
  FilledButton,
  QuotesFadeIn,
  GradientBox,
  H1,
  H2
} from '../components/Marketing';
import { Box, Text } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import styled from 'styled-components';
import { ReactComponent as FrontParallelogramsBase } from 'images/landing/trade/front-parallelograms.svg';
import { ReactComponent as BackParallelogramsBase } from 'images/landing/trade/back-parallelograms.svg';
import { ReactComponent as QuotesImg } from 'images/landing/trade/quotes.svg';
import { ReactComponent as Feat1 } from 'images/landing/trade/feature-1.svg';
import { ReactComponent as Feat2 } from 'images/landing/trade/feature-2.svg';
import { ReactComponent as Feat3 } from 'images/landing/trade/feature-3.svg';
import { ReactComponent as Feat4 } from 'images/landing/trade/feature-4.svg';

const StyledConnectHero = styled(ConnectHero)`
  @media (min-width: ${props => props.theme.breakpoints.m}) {
    margin: 127px auto 0;
  }
`;

const HeroBackground = (() => {
  const BackParallelograms = styled(BackParallelogramsBase)`
    position: absolute;
    left: -81px;
    top: -45px;

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      left: -98px;
      top: -129px;
    }
  `;

  const FrontParallelograms = styled(FrontParallelogramsBase)`
    position: absolute;
    left: -162px;
    top: 0;

    @media (min-width: ${props => props.theme.breakpoints.m}) {
      left: -179px;
      top: -84px;
    }
  `;

  return () => (
    <FullWidth zIndex="-1" height="670px" style={{ position: 'absolute' }}>
      <Box maxWidth="866px" m="0 auto">
        <BackParallelograms />
        <Parallaxed style={{ zIndex: 10 }}>
          <FrontParallelograms />
        </Parallaxed>
      </Box>
    </FullWidth>
  );
})();

const StyledQuotes = styled(Quotes)`
  background: linear-gradient(125.71deg, #cbfffa 0%, #e7fce9 100%);

  :after {
    content: '';
    display: block;
    background: #bffff8;
    height: 100%;
    width: 100%;
    position: absolute;
    top: 40px;
    left: 40px;
    z-index: -1;
  }
`;

function TradeLanding() {
  const { lang } = useLanguage();
  const ctaButton = (
    <Link href="https://oasis.app/trade/market/">
      <FilledButton className="button" width="237px">
        {lang.trade_landing.cta_button}
      </FilledButton>
    </Link>
  );

  return (
    <PageContentLayout enableNotifications={false}>
      <FixedHeaderTrigger cta={ctaButton}>
        <StyledConnectHero>
          <HeroBackground />
          <ThickUnderline background="linear-gradient(176.45deg, #ECFFDA 18.9%, #AFFFFA 100%)">
            <Text.h4>{lang.trade_landing.page_name}</Text.h4>
          </ThickUnderline>
          <H1 className="headline" style={{ marginBottom: '23px' }}>
            {lang.trade_landing.headline}
          </H1>
          <Box minHeight="83px" mb={{ s: '9px', m: 'inherit' }}>
            <Text>{lang.trade_landing.subheadline}</Text>
          </Box>
          {ctaButton}
        </StyledConnectHero>
      </FixedHeaderTrigger>
      <GradientBox
        mt="427px"
        background="radial-gradient(242.42% 146.56% at 0% 0%, #E8FFFC 0%, #F8FFE6 50.52%, #E8FFFC 100%)"
      >
        <QuotesFadeIn>
          <StyledQuotes
            title={lang.trade_landing.quotes_block.title}
            body={<Box mb="95px">{lang.trade_landing.quotes_block.body}</Box>}
            quote={lang.trade_landing.quotes_block.quote1}
            author={lang.trade_landing.quotes_block.author1}
            url="https://chat.makerdao.com/group/team-marketing-internal"
            quotesImg={<QuotesImg />}
          />
        </QuotesFadeIn>
      </GradientBox>
      <Features
        mt="249px"
        features={[<Feat1 />, <Feat2 />, <Feat3 />, <Feat4 />].map(
          (img, index) => ({
            img: img,
            title: lang.trade_landing[`feature${index + 1}_heading`],
            content: lang.trade_landing[`feature${index + 1}_content`]
          })
        )}
      />
      <Box mt="280px" mb="126px">
        <H2>{lang.landing_page.questions_title}</H2>
        <Questions
          questions={buildQuestionsFromLangObj(lang.landing_page, lang)}
          links={
            <Link href="#" target="_blank" rel="noopener noreferrer">
              {lang.trade_landing.questions.bottom_link1}
            </Link>
          }
        />
      </Box>
    </PageContentLayout>
  );
}

export default hot(TradeLanding);
