import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";

export const routes = [
  {
    path: '/',
    component: HomePage,
    exact: true,
  },
  {
    path: '*',
    component: NotFoundPage,
  },
];