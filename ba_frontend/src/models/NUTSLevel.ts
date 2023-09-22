import * as L from "leaflet";

export interface NutsRegion {
  id: string;
  type: string;
  geometry: NUTSGeometry;
  properties: NUTSProperties;
}

export interface NUTSGeometry {
  type: string;
  coordinates: L.LatLngExpression[][] | L.LatLngExpression[][][];
}

export interface NUTSCoords {}

export interface NUTSProperties {
  NUTS_ID: string;
  LEVL_CODE: number;
  CNTR_CODE: string;
  NAME_LATN: string;
  NUTS_NAME: string;
  MOUNT_TYPE: number;
  URBN_TYPE: number | null;
  COAST_TYPE: number;
  FID: string;
  stationsTotal: number;
  freeStations: number;
  freePlugs: number;
}

export const coordinates: L.LatLngExpression[][] = [
  [
    [16.64622, 47.4466],
    [16.43376, 47.35292],
    [16.27984, 47.45483],
    [16.37254, 47.64214],
    [16.42154, 47.6653],
    [16.6655, 47.59777],
    [16.64622, 47.4466],
  ],
];

const multiPolygon: L.LatLngExpression[][][] = [
  [
    [
      [12.656083, 47.099701],
      [12.616731, 47.120289],
      [12.575174, 47.133262],
      [12.546493, 47.131143],
      [12.515488, 47.151768],
      [12.489891, 47.157509],
      [12.45517, 47.146726],
      [12.39839, 47.150257],
      [12.371714, 47.141679],
      [12.351624, 47.111173],
    ],
  ],
  [
    [
      [12.338046, 47.697087],
      [12.257755, 47.683125],
      [12.245954, 47.697973],
      [12.259099, 47.730653],
      [12.248248, 47.736859],
      [12.219648, 47.716336],
      [12.168274, 47.69728],
      [12.198323, 47.6389],
      [12.198279, 47.609174],
      [12.133966, 47.606999],
      [12.060662, 47.618743],
      [12.023307, 47.613591],
      [12.003297, 47.623066],
      [11.91097, 47.612483],
    ],
  ],
];
