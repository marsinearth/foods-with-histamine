import { decode as atob } from 'base-64';

export const extractUUID = (relayId?: string) => {
  if (relayId) {
    const decodedRelayID = atob(relayId);
    const relayIdAsArray = eval(decodedRelayID);
    return relayIdAsArray[3];
  }
  return '';
};
