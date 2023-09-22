import React from "react";
import { RouteObject } from "react-router-dom";
import { Layout } from "../containers/Layout/Layout";

import { NoMatch } from "../pages/NoMatch/NoMatch";

const defaultRoutes: RouteObject[] = [
  {
    path: "/chargeview",
    element: <Layout />,
    children: [],
  },
];

export const protectedRoutes: RouteObject[] = [
  ...defaultRoutes,
  {
    path: "",
    element: <Layout />,
  },
  { path: "*", element: <NoMatch /> },
];
