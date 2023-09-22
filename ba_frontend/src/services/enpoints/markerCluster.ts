import { LatLngBounds } from "leaflet";
import { Station } from "../../models/station";
import { emptySplitApi } from "../api";

export interface StationClusterParams {
  bounds: LatLngBounds;
  filters?: string[];
  showAvailableOnly?: boolean;
}

const markerClusterApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getStationCluster: builder.query<Station[], StationClusterParams>({
      query: (params: StationClusterParams) => ({
        url: `station/cluster`,
        method: "GET",
        params: {
          bounds: params.bounds,
          filters: params.filters,
          isAvailable: params.showAvailableOnly,
        },
      }),
      transformResponse: (response: any) => {
        return response;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(
                ({ stationid }) =>
                  ({ type: "stationCluster", stationid } as const)
              ),
              { type: "stationCluster", id: "LIST" },
            ]
          : [{ type: "stationCluster", id: "LIST" }],
    }),
  }),

  overrideExisting: false,
});

export const { useGetStationClusterQuery } = markerClusterApi;
