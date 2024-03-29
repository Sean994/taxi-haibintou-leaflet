/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */
import React, { useState, useEffect, PureComponent } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import moment from "moment";
import { fbqTaxiDataCall, fbqViewContent } from "../pixelComponents/fbPixel";

const DataViz = () => {
  const [dataTime, setDataTime] = useState(
    moment().format("YYYY-MM-DDTHH:mm:ss")
  );
  const [data, setData] = useState([]);
  const [dataRes, setDataRes] = useState(1);
  const [dataLength, setDataLength] = useState(6);

  const getData = (dataLength, dataRes) => {
    const getTaxiAPI = (dataTime, x) => {
      const url = `https://api.data.gov.sg/v1/transport/taxi-availability?date_time=`;
      fetch(url + dataTime)
        .then((response) => response.json())
        .then((data) =>
          setData((prevState) => [
            ...prevState,
            {
              x: x,
              "Taxi Count": data.features[0].properties["taxi_count"],
              time: dataTime.slice(11, 16), //to check on parse fn in moment.js
              date: dataTime.slice(0,10)
            },
          ])
        )
        .then(data.sort((a, b) => a.x - b.x));
    };

    for (let x = dataLength; x >= 0; x--) {
      const timeInput = moment()
        .subtract(x * dataRes, "minutes")
        .format("YYYY-MM-DDTHH:mm:ss");
      getTaxiAPI(timeInput, x);

      if (x == 0){
        const dataStartTime = timeInput.slice(11,16)
        const dataStartDate = timeInput.slice(0,10)
        fbqTaxiDataCall(dataLength, dataRes, dataStartTime, dataStartDate)
        fbqViewContent()
      }
    }




    console.log("this will show dataArray in resolution:", dataRes, data);
  };

  useEffect(() => {
    setDataTime(moment().format("YYYY-MM-DDTHH:mm:ss"));
    setData([]);
    getData(dataLength, dataRes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dataRes, dataLength]);

  class CustomizedLabel extends PureComponent {
    render() {
      const { x, y, value } = this.props;

      return (
        <text
          x={x}
          y={y}
          dy={-15}
          fill="white"
          fontSize={12}
          textAnchor="middle"
        >
          {value}
        </text>
      );
    }
  }

  return (
    <div id="dataWrapper">
      <p id="lastUpdate">Taxi Population; up to the last 3 days</p>
      <p id="lastUpdate">Graph last updated: {dataTime.slice(11, 19)}</p>
      {/* <p>Data resolution: {dataRes} Data length: {dataLength} </p> */}
      <label className="DataVizLabel"> Data Resolution: </label>
      <select
        name="resolution"
        onChange={(event) => {
          setDataRes(event.target.value);
        }}
      >
        <option value={1}>1 minute</option>
        <option value={5}>5 minutes</option>
        <option value={10}>10 minutes</option>
        <option value={30}>30 minutes</option>
        <option value={60}>60 minutes</option>
        <option value={120}>2 hours</option>
      </select>
      <label className="DataVizLabel"> Data Length: </label>
      <select
        name="dataLength"
        onChange={(event) => {
          setDataLength(parseInt(event.target.value));
        }}
      >
        <option value={6}>6 points</option>
        <option value={12}>12 points</option>
        <option value={18}>18 points</option>
        <option value={24}>24 points</option>
        <option value={30}>30 points</option>
        <option value={36}>36 points</option>
      </select>
      <ResponsiveContainer className="lineGraph" width="95%" height="80%">
        <LineChart
        //   width={500}
        //   height={100}
          data={data.sort((a, b) => b.x - a.x)}
          margin={{
            top: 10,
            right: 30,
            left: 30,
            bottom: 18,
          }}
        >
          <CartesianGrid horizontal={false} strokeDasharray="1 10" />
          <XAxis tick={{ fill: 'grey' }} interval={1} tickSize={18} angle={-15} dataKey="time" height={20} />
          <YAxis tick={{ fill: "#ffbf00" }} tickSize={18} unit=" Taxis"angle={0} domain={[500, 5000]} />
          <Tooltip itemStyle={{ color: "black" }} />
          <Legend verticalAlign="top" height={36}/>
          <Line
            type="monotone"
            dataKey="Taxi Count"
            stroke="#ffbf00"
            strokeWidth={3}
            label={<CustomizedLabel />}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DataViz;
