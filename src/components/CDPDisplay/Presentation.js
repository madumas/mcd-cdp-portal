import React, { useEffect, useState } from 'react';
import { Address } from '@makerdao/ui-components-core';
import useLanguage from 'hooks/useLanguage';
import useEventHistory from 'hooks/useEventHistory';
import useMaker from 'hooks/useMaker';

import { TextBlock } from 'components/Typography';
import PageContentLayout from 'layouts/PageContentLayout';
import { Box, Grid, Flex, Text, Link } from '@makerdao/ui-components-core';
import History from './History';
import {
  ActionButton,
  ActionContainerRow,
  AmountDisplay,
  CdpViewCard,
  ExtraInfo,
  InfoContainerRow
} from './subcomponents';
import theme from '../../styles/theme';
import FullScreenAction from './FullScreenAction';
import debug from 'debug';
import useNotification from 'hooks/useNotification';
import useAnalytics from 'hooks/useAnalytics';
import useEmergencyShutdown from 'hooks/useEmergencyShutdown';
import { FeatureFlags } from 'utils/constants';
import { NotificationList, SAFETY_LEVELS } from 'utils/constants';
import { formatter } from 'utils/ui';
import BigNumber from 'bignumber.js';

const log = debug('maker:CDPDisplay/Presentation');
const { FF_VAULT_HISTORY } = FeatureFlags;

export default function({
  vault,
  showSidebar,
  account,
  network,
  cdpOwner,
  showVaultHistory = true
}) {
  const { lang } = useLanguage();
  const { maker } = useMaker();

  const {
    emergencyShutdownActive,
    emergencyShutdownTime
  } = useEmergencyShutdown();
  const { trackBtnClick } = useAnalytics('CollateralView');
  let {
    collateralAmount,
    collateralizationRatio,
    liquidationPrice,
    vaultType,
    unlockedCollateral
  } = vault;
  log(`Rendering vault #${vault.id}`);

  const gem = collateralAmount?.symbol;

  liquidationPrice = formatter(liquidationPrice);
  collateralizationRatio = formatter(collateralizationRatio, {
    percentage: true
  });
  // eslint-disable-next-line react-hooks/rules-of-hooks

  const eventHistory =
    FF_VAULT_HISTORY && showVaultHistory ? useEventHistory(vault.id) : null;

  if (['Infinity', Infinity, 'NaN', NaN].includes(liquidationPrice))
    liquidationPrice = lang.cdp_page.not_applicable;
  if (['Infinity', Infinity, 'NaN', NaN].includes(collateralizationRatio))
    collateralizationRatio = lang.cdp_page.not_applicable;
  const isOwner =
    account && account.address.toLowerCase() === cdpOwner.toLowerCase();

  const [actionShown, setActionShown] = useState(null);
  const { addNotification, deleteNotifications } = useNotification();

  useEffect(() => {
    const reclaimCollateral = async () => {
      const txObject = maker
        .service('mcd:cdpManager')
        .reclaimCollateral(vault.id, unlockedCollateral.toFixed());
      await txObject;
      deleteNotifications([NotificationList.CLAIM_COLLATERAL]);
    };

    if (emergencyShutdownActive) {
      addNotification({
        id: NotificationList.EMERGENCY_SHUTDOWN_ACTIVE,
        content: lang.formatString(
          lang.notifications.emergency_shutdown_active,
          emergencyShutdownTime
            ? `${emergencyShutdownTime.toUTCString().slice(0, -3)} UTC`
            : '--',
          <Link
            css={{ textDecoration: 'underline' }}
            href={'http://migrate.makerdao.com/'}
            target="_blank"
          >
            {'http://migrate.makerdao.com/'}
          </Link>,
          <Link
            css={{ textDecoration: 'underline' }}
            href={'https://forum.makerdao.com/'}
            target="_blank"
          >
            {'here'}
          </Link>
        ),
        level: SAFETY_LEVELS.DANGER
      });
    }

    if (isOwner && unlockedCollateral > 0) {
      const claimCollateralNotification = lang.formatString(
        lang.notifications.claim_collateral,
        gem,
        unlockedCollateral && formatter(unlockedCollateral),
        gem
      );

      addNotification({
        id: NotificationList.CLAIM_COLLATERAL,
        content: claimCollateralNotification,
        level: SAFETY_LEVELS.WARNING,
        hasButton: isOwner,
        buttonLabel: lang.notifications.claim,
        onClick: () => reclaimCollateral()
      });
    }

    if (!isOwner && account) {
      addNotification({
        id: NotificationList.NON_VAULT_OWNER,
        content: lang.formatString(
          lang.notifications.non_vault_owner,
          <Address full={cdpOwner} shorten={true} expandable={false} />
        ),
        level: SAFETY_LEVELS.WARNING
      });
    }

    return () =>
      deleteNotifications([
        NotificationList.CLAIM_COLLATERAL,
        NotificationList.NON_VAULT_OWNER,
        NotificationList.EMERGENCY_SHUTDOWN_ACTIVE
      ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOwner,
    account,
    vault,
    unlockedCollateral,
    emergencyShutdownTime,
    emergencyShutdownActive
  ]);

  const showAction = props => {
    const emSize = parseInt(getComputedStyle(document.body).fontSize);
    const pxBreakpoint = parseInt(theme.breakpoints.l) * emSize;
    const isMobile = document.documentElement.clientWidth < pxBreakpoint;
    if (isMobile) {
      setActionShown(props);
    } else {
      showSidebar(props);
    }
  };

  return (
    <PageContentLayout>
      <Box>
        <Text.h2>
          {vaultType} {lang.cdp} #{vault.id}
        </Text.h2>
      </Box>
      <Grid
        py="m"
        gridColumnGap="l"
        gridTemplateColumns={{
          0: '1fr',
          1: '1fr',
          xl: '1fr 1fr'
        }}
      >
        <CdpViewCard title={lang.cdp_page.liquidation_price}>
          <Flex alignItems="flex-end" mt="s" mb="xs">
            <AmountDisplay amount={liquidationPrice} denomination="USD" />
            <ExtraInfo>({gem}/USD)</ExtraInfo>
          </Flex>
          <InfoContainerRow
            title={
              <TextBlock fontSize="l">
                {lang.cdp_page.current_price_info}
                <ExtraInfo ml="2xs">{`(${gem}/USD)`}</ExtraInfo>
              </TextBlock>
            }
            value={`${formatter(vault.collateralTypePrice)} USD`}
          />
          <InfoContainerRow
            title={lang.cdp_page.liquidation_penalty}
            value={
              formatter(vault.liquidationPenalty, {
                percentage: true
              }) + '%'
            }
          />
        </CdpViewCard>

        <CdpViewCard title={lang.cdp_page.collateralization_ratio}>
          <Flex alignItems="flex-end" mt="s" mb="xs">
            <AmountDisplay amount={collateralizationRatio} denomination="%" />
          </Flex>
          <InfoContainerRow
            title={lang.cdp_page.minimum_ratio}
            value={
              formatter(vault.liquidationRatio, {
                percentage: true
              }) + '%'
            }
          />
          <InfoContainerRow
            title={lang.cdp_page.stability_fee}
            value={
              formatter(vault.annualStabilityFee, {
                percentage: true,
                rounding: BigNumber.ROUND_HALF_UP
              }) + '%'
            }
          />
        </CdpViewCard>

        <CdpViewCard title={`${gem} ${lang.cdp_page.locked.toLowerCase()}`}>
          <ActionContainerRow
            title={`${gem} ${lang.cdp_page.locked.toLowerCase()}`}
            value={`${formatter(vault.collateralAmount)} ${gem}`}
            conversion={`${formatter(vault.collateralValue)} USD`}
            button={
              <ActionButton
                disabled={!account || emergencyShutdownActive}
                onClick={() => {
                  trackBtnClick('Deposit');
                  showAction({
                    type: 'deposit',
                    props: { vault }
                  });
                }}
              >
                {lang.actions.deposit}
              </ActionButton>
            }
          />
          <ActionContainerRow
            title={lang.cdp_page.able_withdraw}
            value={`${formatter(vault.collateralAvailableAmount)} ${gem}`}
            conversion={`${formatter(vault.collateralAvailableValue)} USD`}
            button={
              <ActionButton
                disabled={!account || !isOwner || emergencyShutdownActive}
                onClick={() => {
                  trackBtnClick('Withdraw');
                  showAction({
                    type: 'withdraw',
                    props: { vault }
                  });
                }}
              >
                {lang.actions.withdraw}
              </ActionButton>
            }
          />
        </CdpViewCard>

        <CdpViewCard title={lang.cdp_page.outstanding_dai_debt}>
          <ActionContainerRow
            title={lang.cdp_page.outstanding_dai_debt}
            value={formatter(vault.debtValue) + ' DAI'}
            button={
              <ActionButton
                disabled={!account || emergencyShutdownActive}
                onClick={() => {
                  trackBtnClick('Payback');
                  showAction({
                    type: 'payback',
                    props: { vault }
                  });
                }}
              >
                {lang.actions.pay_back}
              </ActionButton>
            }
          />
          <ActionContainerRow
            title={lang.cdp_page.available_generate}
            value={`${formatter(vault.daiAvailable)} DAI`}
            button={
              <ActionButton
                disabled={!account || !isOwner || emergencyShutdownActive}
                onClick={() => {
                  trackBtnClick('Generate');
                  showAction({
                    type: 'generate',
                    props: { vault }
                  });
                }}
              >
                {lang.actions.generate}
              </ActionButton>
            }
          />
        </CdpViewCard>
      </Grid>

      {FF_VAULT_HISTORY && showVaultHistory && (
        <History
          title={lang.cdp_page.tx_history}
          rows={eventHistory}
          network={network}
          isLoading={eventHistory === null}
        />
      )}

      {actionShown && (
        <FullScreenAction {...actionShown} reset={() => setActionShown(null)} />
      )}
    </PageContentLayout>
  );
}
