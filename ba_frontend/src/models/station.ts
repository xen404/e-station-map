import { LatLng } from 'leaflet';

export interface Station {
  stationid: number;
  name: string;
  street: string;
  zipcode: string;
  lat: number;
  lng: number;
}

