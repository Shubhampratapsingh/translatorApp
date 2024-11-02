import React from "react";
import noDataSVG from "../../assets/noDataSVG.svg";
import "./NoData.css";

const NoData = (props) => {
  return (
    <div id="noData" className="py-5">
      <img src={noDataSVG} alt="Not Found" />
      <p className="mt-3 font-bold">{props.title}</p>
    </div>
  );
};

export default NoData;
