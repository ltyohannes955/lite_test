'use client';
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FaPhone } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

const JobDetails = ({ params }) => {
  const { id } = React.use(params);

  const [jobDetails, setJobDetails] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  useEffect(() => {
    if (id) {
      fetch(`https://liyt-api-1.onrender.com/orders/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then(data => {
          setJobDetails(data);
          fetchRoute(data.origin, data.destination); // Fetch route after getting job details
        })
        .catch(error => console.error("Error fetching job details:", error));
    }
  }, [id]);

  const fetchRoute = async (origin, destination) => {
    if (origin && destination) {
      const response = await fetch(
        `https://liyt-api-1.onrender.com/orders/get_price?origin=${origin}&destination=${destination}`
      );
      const data = await response.json();
      setRouteCoordinates(data.payload.directions);
    }
  };

  if (!jobDetails) {
    return <p>Loading...</p>;
  }

  const {
    origin,
    destination,
    price,
    status,
    itemDescription = "Red T-shirt",
    customer_name,
    customer_phone_number,
    user: sender,
  } = jobDetails;

  const isValidCoordinate = (lat, lon) => {
    return (
      typeof lat === "number" &&
      typeof lon === "number" &&
      lat >= -90 && lat <= 90 &&
      lon >= -180 && lon <= 180
    );
  };

  const originLatLng = origin
    ? origin.split(',').map(coord => parseFloat(coord))
    : [9.04, 38.75];
  const destinationLatLng = destination
    ? destination.split(',').map(coord => parseFloat(coord))
    : [9.04, 38.75];

  const validOriginLatLng = isValidCoordinate(originLatLng[0], originLatLng[1]) ? originLatLng : [9.04, 38.75];
  const validDestinationLatLng = isValidCoordinate(destinationLatLng[0], destinationLatLng[1]) ? destinationLatLng : [9.04, 38.75];

  const centerLatLng = [
    (validOriginLatLng[0] + validDestinationLatLng[0]) / 2,
    (validOriginLatLng[1] + validDestinationLatLng[1]) / 2
  ];

  return (
    <div className="relative min-h-screen">
      <div className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-400 text-white flex items-center justify-between shadow-md fixed top-0 z-20">
        <FiMenu size={24} className="cursor-pointer" />
        <h1 className="text-xl font-bold flex-grow text-center">LIYT</h1>
      </div>

      <div className="absolute inset-0 z-10">
        <MapContainer
          key={centerLatLng.join(',')}
          center={centerLatLng}
          zoom={13}
          style={{ height: "100vh", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          <Marker position={validOriginLatLng}>
            <Popup>Origin</Popup>
          </Marker>
          <Marker position={validDestinationLatLng}>
            <Popup>Destination</Popup>
          </Marker>

          {/* Polyline for the route path from API */}
          <Polyline positions={routeCoordinates} color="blue" />
        </MapContainer>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 z-30 p-4 bg-white bg-opacity-90 rounded-t-lg shadow-lg mx-4 mb-4 text-gray-800 transition-transform duration-300 ${
          isCollapsed ? "transform translate-y-[90%]" : "transform translate-y-0"
        }`}
      >
        <button
          className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-purple-700 text-white rounded-full p-2 shadow-md"
          onClick={toggleCollapse}
        >
          {isCollapsed ? <IoIosArrowUp size={24} /> : <IoIosArrowDown size={24} />}
        </button>

        {!isCollapsed && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-bold">Sender</p>
                <p>{sender.first_name} {sender.last_name}</p>
                <button className="flex items-center text-blue-500 mt-1">
                  <FaPhone className="mr-1" /> {sender.phone_number}
                </button>
              </div>
              <div>
                <p className="font-bold">Receiver</p>
                <p>{customer_name}</p>
                <button className="flex items-center text-blue-500 mt-1">
                  <FaPhone className="mr-1" /> {customer_phone_number}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="font-bold">Item</p>
              <p>{itemDescription}</p>
              <p className="text-sm text-gray-600">Order ID: {id}</p>
              <p className="text-purple-600">Status: {status}</p>
            </div>

            <div className="mb-4">
              <p className="font-bold">Route</p>
              <p>{origin} ➔ {destination}</p>
              <p className="font-bold mt-2">Estimated Price: Birr {price}</p>
            </div>

            <button className="w-full py-2 bg-purple-700 text-white font-bold rounded-lg mt-6">
              Order Completed
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;
