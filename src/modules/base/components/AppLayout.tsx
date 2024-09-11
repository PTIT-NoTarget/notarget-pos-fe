import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Header";
import { routes } from "./Routes";
import ToastMessage from "../../../shared/component/ToastMessage";
import { useEffect, useState } from "react";
import { getAllInformation } from "../../../services/InformationService";
import useLoadingStore from "../../../store/LoadingStore";
import Loader from "../../../shared/component/Loader";
import { Layout } from "antd";
import { isValidToken } from "../../../services/AuthService";
import ConfirmPopup from "../../../shared/component/ComfirmPopup";

export default function AppLayout() {
  const [pageInformation, setPageInformation] = useState<any>(undefined);
  const { setLoading } = useLoadingStore();
  const navigate = useNavigate();

  useEffect(() => {}, []);

  useEffect(() => {
    setLoading(true);
    getAllInformation()
      .then((res) => {
        setPageInformation(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });

    let token: string = localStorage.getItem("access_token") || "";
    if (!token) {
      navigate("/sign-in");
    } else {
      isValidToken(token).catch((error) => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/sign-in");
      });
    }
  }, []);
  return (
    <>
      <Layout>
        {pageInformation && (
          <Routes>
            {routes.map(
              ({
                component: Component,
                path,
                pageInformationKey,
                hasHeader,
              }) => {
                const info: any = pageInformation[pageInformationKey];
                return (
                  <Route
                    key={path}
                    element={
                      <>
                        {hasHeader && <Header />}
                        <Component pageInformation={info} />
                      </>
                    }
                    path={path}
                  />
                );
              }
            )}
          </Routes>
        )}
      </Layout>
      <ToastMessage />
      <Loader />
      <ConfirmPopup />
    </>
  );
}
