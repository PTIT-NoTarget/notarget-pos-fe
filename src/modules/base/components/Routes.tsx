import NotFoundPage from "./NotFoundPage";

export const routes = [
  {
    path: '/sign-in',
    component: HomePage,
    exact: true,
  },
  {
    path: '*',
    component: NotFoundPage,
  },
];