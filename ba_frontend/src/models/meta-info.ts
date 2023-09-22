import { NUTS_LVL } from "./../constants/enums";
//import { Path, Location } from 'react-router-dom';

export interface IMetaInfoState {
  referrer: string;
  isChoroplethShown: boolean;
  current_NUTS_LVL: NUTS_LVL;
  currentDate: Date;
  hoveredNutsRegion: NutsRegionInfo | null;
  filters: string[];
  showAvailableOnly: boolean;
}

export interface NutsRegionInfo {
  name: string;
  totalStations: number;
}
