export enum TokenId {
  AUSD = 'AUSD',
  DOT = 'DOT',
  ACA = 'ACA',
  MYRIA = 'MYRIA',
}

export interface Token {
  id: string;
  token_name: string;
  token_image: string;
  token_decimal: number;
  address_format: number;
  rpc_address: string;
}
