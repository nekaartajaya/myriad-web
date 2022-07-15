import {convertToPolkadotAddress} from './extension';

import capitalize from 'lodash/capitalize';
import {Network, NetworkIdEnum} from 'src/interfaces/network';
import {UserWallet} from 'src/interfaces/user';
import {BlockchainPlatform} from 'src/interfaces/wallet';
import {Server} from 'src/lib/api/wallet';

export const formatAddress = (currentWallet: UserWallet, address: null | string) => {
  if (address && address.length > 14) {
    let validAddress = '';

    if (currentWallet?.network?.blockchainPlatform === BlockchainPlatform.SUBSTRATE) {
      validAddress = convertToPolkadotAddress(address, currentWallet);
    } else {
      validAddress = address;
    }

    return (
      validAddress.substring(0, 4) +
      '...' +
      validAddress.substring(validAddress.length - 4, validAddress.length)
    );
  }
  return address;
};

export const formatNetworkTitle = (network?: Network) => {
  switch (network?.id) {
    case NetworkIdEnum.NEAR:
      return network.id.toUpperCase();
    default:
      return capitalize(network?.id ?? 'unknown');
  }
};

export const formatWalletTitle = (network?: Network) => {
  switch (network?.blockchainPlatform) {
    case BlockchainPlatform.SUBSTRATE:
      return 'Polkadot{.js}';
    case BlockchainPlatform.NEAR:
      return 'NEAR Wallet';
    default:
      return network?.blockchainPlatform;
  }
};

export const getServerId = (server: Server, networkId?: NetworkIdEnum): string => {
  if (!networkId) return server.id;

  switch (networkId) {
    case NetworkIdEnum.MYRIAD:
      return server.id;

    case NetworkIdEnum.NEAR:
      return server?.accountId?.[networkId];

    default:
      return server.id;
  }
};
