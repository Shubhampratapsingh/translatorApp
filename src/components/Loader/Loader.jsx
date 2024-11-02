import React from "react";
import { Spin } from "antd";
import "./Loader.css";

const Loader = (props) => {
  return (
    <div id="loader" className="py-5">
      <Spin />
      <p className="mt-3 text-sky-900">Loading...</p>
    </div>
  );
};

export default Loader;
