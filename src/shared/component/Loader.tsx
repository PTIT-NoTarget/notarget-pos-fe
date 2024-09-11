import React from 'react';
import {Button, Spin} from 'antd';
import useLoadingStore from "../../store/LoadingStore";

export default function Loader() {
  const { loading } = useLoadingStore();
  return (
    <>
      <Spin spinning={loading} tip="Loading" size="large" fullscreen/>
    </>
  );
};