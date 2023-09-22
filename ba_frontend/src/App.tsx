import React, { useEffect } from "react";
import {
  RouteObject,
  useNavigate,
  useRoutes,
  useSearchParams,
} from "react-router-dom";
import "./App.scss";
import { useAppDispatch } from "./hooks/redux";
import { mapSlice } from "./services/slices/map";
import L from "leaflet";
import { protectedRoutes } from "./constants/routes";
import { ToastContainer } from "react-toastify";
import { Portal } from "./components/Portal/Portal";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();

  // eslint-disable-next-line no-constant-condition
  const config: RouteObject[] = protectedRoutes;

  const routes = useRoutes(config);

  useEffect(() => {
    const nelat = Number(params.get("nelat"));
    const nelng = Number(params.get("nelng"));
    const swlat = Number(params.get("swlat"));
    const swlng = Number(params.get("swlng"));
    if (nelat && nelng && swlat && swlng) {
      const bounds = L.latLngBounds([nelat, nelng], [swlat, swlng]);
      dispatch(mapSlice.actions.setMapBounds(bounds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, navigate]);

  return (
    <>
      <h1 className="sr-only">Estation Map</h1>
      <Portal className="App__toast" el="aside">
        <ToastContainer />
      </Portal>
      {routes}
    </>
  );
}

export default App;
