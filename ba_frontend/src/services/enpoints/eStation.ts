import { LatLngBounds } from "leaflet";
import { Estation, StationInfo } from "../../models/estation";
import { emptySplitApi } from "../api";

export interface StationsInBoundsParams {
  bounds: LatLngBounds;
  date: Date;
  filters?: string[];
  showAvailableOnly?: boolean;
}

export interface EstationInfoParams {
  stationId: number;
  date: Date;
}

const eStationApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getEstationsInBounds: builder.query<Estation[], StationsInBoundsParams>({
      query: (params: StationsInBoundsParams) => ({
        url: `station/inbounds`,
        method: "GET",
        params: {
          nelat: params.bounds.getNorthEast().lat,
          nelon: params.bounds.getNorthEast().lng,
          swlat: params.bounds.getSouthWest().lat,
          swlon: params.bounds.getSouthWest().lng,
          date: params.date,
          filters: params.filters,
          showAvailableOnly: params.showAvailableOnly,
        },
      }),
      transformResponse: (response: Estation[]) => {
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ stationid }) =>
                  ({ type: "stationsInbounds", stationid } as const)
              ),
              { type: "stationsInbounds", id: "LIST" },
            ]
          : [{ type: "stationsInbounds", id: "LIST" }],
    }),
    getEstationInfo: builder.query<StationInfo, EstationInfoParams>({
      query: (params: EstationInfoParams) => ({
        url: `station/info`,
        method: "GET",
        params: {
          stationId: params.stationId,
          date: params.date,
        },
      }),
      transformResponse: (response: StationInfo) => {
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetEstationsInBoundsQuery, useGetEstationInfoQuery } =
  eStationApi;
