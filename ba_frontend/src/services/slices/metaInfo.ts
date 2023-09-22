import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_DATE } from "../../constants/default-values";
import { NUTS_LVL,  } from "../../constants/enums";
import { IMetaInfoState, NutsRegionInfo } from "../../models/meta-info";

const initialState: IMetaInfoState = {
  referrer: "",
  isChoroplethShown: false,
  current_NUTS_LVL: NUTS_LVL.NUTS0,
  currentDate: DEFAULT_DATE,
  hoveredNutsRegion: null,
  filters: [],
  showAvailableOnly: false,
};

export const metaInfoSlice = createSlice({
  name: "metaInfo",
  initialState: initialState,
  reducers: {
   
    setReferrer: (
      state: IMetaInfoState,
      { payload }: PayloadAction<string>
    ) => {
      state.referrer = payload;
    },
    setIsChoroplethShown: (
      state: IMetaInfoState,
      { payload }: PayloadAction<boolean>
    ) => {
      state.isChoroplethShown = payload;
    },
    setNUTS_LVL: (
      state: IMetaInfoState,
      { payload }: PayloadAction<NUTS_LVL>
    ) => {
      state.current_NUTS_LVL = payload;
    },
    setCurrentDate: (
      state: IMetaInfoState,
      { payload }: PayloadAction<Date>
    ) => {
      state.currentDate = new Date(
        Date.UTC(
          payload.getFullYear(),
          payload.getMonth(),
          payload.getDate(),
          payload.getHours(),
          payload.getMinutes()
        )
      );
    },
    setHoveredNutsRegion: (
      state: IMetaInfoState,
      { payload }: PayloadAction<NutsRegionInfo | null>
    ) => {
      state.hoveredNutsRegion = payload;
    },
    setFilters: (
      state: IMetaInfoState,
      { payload }: PayloadAction<string[] | []>
    ) => {
      state.filters = payload;
    },

    setShowAvailableOnly: (
      state: IMetaInfoState,
      { payload }: PayloadAction<boolean>
    ) => {
      state.showAvailableOnly = payload;
    },
  },
});

export default metaInfoSlice.reducer;
