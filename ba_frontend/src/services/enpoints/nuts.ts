import { NUTS_LVL } from "./../../constants/enums";
import { NutsRegion } from "../../models/NUTSLevel";
import { emptySplitApi } from "../api";
import { toast } from "react-toastify";
import { noChoroplethFound } from "../../constants/error-messages";

export interface INutsParams {
  nutsLvl: NUTS_LVL;
  date: Date;
}

const nutsApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getNuts: builder.query<NutsRegion[], INutsParams>({
      query: (params: INutsParams) => ({
        url: `/choropleth/${params.nutsLvl}`,
        method: "GET",
        params: {
          date: params.date,
        },
      }),
      transformResponse: (response: NutsRegion[]) => {
        if (response.length < 1) {
          toast.error(noChoroplethFound.template, {
            ...noChoroplethFound.options,
            toastId: "error1",
          });
        }
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export const { useGetNutsQuery } = nutsApi;
