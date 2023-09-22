import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { emptySplitApi } from './services/api';
import mapReducer from './services/slices/map';
import metaInfoReducer from './services/slices/metaInfo';

const rootReducer = combineReducers({
  [emptySplitApi.reducerPath]: emptySplitApi.reducer,
  mapReducer,
  metaInfoReducer,
});

export const setupStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        emptySplitApi.middleware,
      ),
  });
};
//export type TStore = ReturnType<typeof store.getState>;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
