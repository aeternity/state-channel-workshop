import { AeSdk, Channel, encodeContractAddress } from '@aeternity/aepp-sdk';
import { SignTx } from '@aeternity/aepp-sdk/es/channel/internal';
import { Encoded } from '@aeternity/aepp-sdk/es/utils/encoder';
import contractSource from '@aeternity/rock-paper-scissors';
import {
  CONTRACT_CONFIGURATION,
  CONTRACT_NAME,
  Methods,
} from './contract.constants';

/**
 * Deploys the contract on channel and returns the instance and its address
 * @param config - parameters used in contract's `init` method {@link 'https://github.com/aeternity/state-channel-demo/blob/develop/contract/contracts/RockPaperScissors.aes#L29'}
 */
export async function deployContract(
  sdk: AeSdk,
  channel: Channel,
  config: {
    player0: Encoded.AccountAddress;
    player1: Encoded.AccountAddress;
    reactionTime: number;
    debugTimestamp?: number;
  },
  signTx: SignTx
) {
  const contract = await sdk.getContractInstance({
    source: contractSource,
  });
  const code = await contract.compile();

  const res = await channel.createContract(
    {
      ...CONTRACT_CONFIGURATION,
      code,
      callData: contract.calldata.encode(CONTRACT_NAME, Methods.init, [
        ...Object.values(config),
      ]) as Encoded.ContractBytearray,
    },
    signTx
  );

  return { instance: contract, address: res.address };
}

/**
 * Builds contract for the responder channel
 */
export async function buildContract(
  contractCreationChannelRound: number,
  owner: Encoded.AccountAddress,
  sdk: AeSdk
) {
  const contract = await sdk.getContractInstance({
    source: contractSource,
  });
  await contract.compile();
  const contractAddress = encodeContractAddress(
    owner,
    contractCreationChannelRound
  );
  return { instance: contract, address: contractAddress };
}
