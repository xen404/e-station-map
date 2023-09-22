export interface Estation {
  stationid: number;
  name: string;
  street: string;
  zipcode: string;
  lat: number;
  lng: number;
  coord: string;
  nuts1: string;
  nuts2: string;
  nuts3: string;
  plugs: Plug[];
}
export interface StationInfo {
  stationid: number;
  name: string;
  street: string;
  zipcode: string;
  plugs: Plug[];
}

export interface Plug {
  plugid: number;
  plugType: String;
  power: number;
  statusid: number;
  status: PlugStatus;
}

export enum PlugStatus {
  UNKNOWN = "unknown",
  FREE = "available",
  BUSY = "occupied",
  RESERVED = "reserved",
  OUT_OF_ORDER = "out_of_order",
}
