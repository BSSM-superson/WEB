import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import "./App.css";

const App = () => {
  const webcamRef = useRef(null);
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState("");
  const [isRaspberryPi, setIsRaspberryPi] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes("arm") || userAgent.includes("raspberry")) {
      setIsRaspberryPi(true);
    }

    const getDevices = async () => {
      try {
        const mediaDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = mediaDevices.filter((device) => device.kind === "videoinput");
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          setDeviceId(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("웹캠을 찾을 수 없습니다:", error);
      }
    };

    getDevices();
  }, []);

  const handleDeviceChange = (event) => {
    setDeviceId(event.target.value);
  };

  // 👉 Flask로 요청 보내는 함수들
  const handleStart = async () => {
    console.log("start");
    try {
      await fetch("http://192.168.137.238:5000/start", {
        method: "POST",
      });
    } catch (error) {
      console.error("Start 요청 실패:", error);
    }
  };

  const handleEnd = async () => {
    console.log("end");
    try {
      await fetch("http://192.168.137.238:5000/end", {
        method: "POST",
      });
    } catch (error) {
      console.error("End 요청 실패:", error);
    }
  };

  return (
    <div className="container">
      <header className="header">
        {isRaspberryPi ? "라즈베리파이 웹캠" : "PC 웹캠"}
      </header>
      <main className="main">
        <div className="button-container">
          <button className="btn" onClick={handleStart}>start</button>
          <button className="btn" onClick={handleEnd}>end</button>
        </div>

        <div className="dropdown">
          <label>카메라 선택:</label>
          <select onChange={handleDeviceChange} value={deviceId}>
            {devices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label || `Camera ${device.deviceId}`}
              </option>
            ))}
          </select>
        </div>

        <div className="webcam-container">
          {deviceId ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              videoConstraints={{ deviceId: { exact: deviceId } }}
              className="webcam"
            />
          ) : (
            <p>웹캠을 찾을 수 없습니다.</p>
          )}
        </div>

        <footer className="footer">슈퍼손</footer>
      </main>
    </div>
  );
};

export default App;
