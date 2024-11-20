"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { FaSearch } from "react-icons/fa";

const Map = dynamic(() => import("../../map"), { ssr: false });

const CreateOrderPage = () => {
  const [pickUp, setPickUp] = useState([]);
  const [dropOff, setDropOff] = useState([]);
  const [pickUpInput, setPickUpInput] = useState("");
  const [dropOffInput, setDropOffInput] = useState("");
  const [originLat, setOriginLat] = useState("");
  const [originLon, setOriginLon] = useState("");
  const [destinationLat, setDestinationLat] = useState("");
  const [destinationLon, setDestinationLon] = useState("");
  const [price, setPrice] = useState<number | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);

  const [userId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userId");
    }
    return null; // Default value for SSR
  });

  const [formData, setFormData] = useState({
    user_id: userId,
    driver_id: "",
    status: "pending",
    origin: `${originLat},${originLon}`,
    destination: `${destinationLat},${destinationLon}`,
    price: 0,
    customer_name: "",
    customer_phone_number: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchLocationSuggestions = async (query: string, type: string) => {
    try {
      const response = await fetch(
        `http://liytapi.fenads.org/location/${query}`
      );
      const data = await response.json();
      if (type === "primary") {
        setPickUp(data.payload.data || []);
      } else {
        setDropOff(data.payload.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch location suggestions", error);
    }
  };

  const fetchRoute = async (origin: string, destination: string) => {
    if (origin && destination) {
      try {
        const response = await fetch(
          `http://liytapi.fenads.org/orders/get_price?origin=${origin}&destination=${destination}`
        );
        const data = await response.json();
        setRouteCoordinates(data.payload.directions);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    }
  };

  const handleSubmit = async () => {
    if (price === null) {
      alert("Please calculate the price first.");
    } else {
      try {
        const response = await fetch("http://liytapi.fenads.org/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          alert("Order created successfully!");
        } else {
          const errorData = await response.json();
          console.error(errorData);
        }
      } catch (error) {
        console.error("Order creation error:", error);
      }
    }
  };

  const handlePriceCalculation = async (
    originLat: string,
    originLon: string,
    destinationLat: string,
    destinationLon: string
  ) => {
    try {
      const response = await fetch(
        `http://liytapi.fenads.org/orders/get_price?origin=${originLat},${originLon}&destination=${destinationLat},${destinationLon}`
      );
      const data = await response.json();
      setPrice(data.payload.total_price);
      fetchRoute(
        `${originLat},${originLon}`,
        `${destinationLat},${destinationLon}`
      );
      setFormData((prevData) => ({
        ...prevData,
        price: data.payload.total_price,
      }));
    } catch (error) {
      console.error("Failed to fetch price", error);
    }
  };

  const handleLocationSelect = (
    location: any,
    type: "primary" | "secondary"
  ) => {
    const { latitude, longitude, name } = location;
    if (type === "primary") {
      setPickUpInput(name);
      setPickUp([]);
      setOriginLat(latitude);
      setOriginLon(longitude);
      if (destinationLat && destinationLon) {
        handlePriceCalculation(
          latitude,
          longitude,
          destinationLat,
          destinationLon
        );
      }
      setFormData((prevData) => ({
        ...prevData,
        origin: `${latitude},${longitude}`,
      }));
    } else {
      setDropOffInput(name);
      setDropOff([]);
      setDestinationLat(latitude);
      setDestinationLon(longitude);
      if (originLat && originLon) {
        handlePriceCalculation(originLat, originLon, latitude, longitude);
      }
      setFormData((prevData) => ({
        ...prevData,
        destination: `${latitude},${longitude}`,
      }));
    }
  };

  return (
    <div className="bg-black min-h-screen p-6 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-10/12 h-5/6">
        <h2 className="text-xl font-bold mb-4">Create New Order</h2>
        <form>
          <div className="flex justify-evenly">
            <div className="w-1/2">
              <Map
                zoom={12}
                h={50}
                origin={{ lat: originLat, lon: originLon }}
                destination={{
                  lat: destinationLat,
                  lon: destinationLon,
                }}
                routeCoordinates={routeCoordinates}
              />
            </div>
            <div className="w-1/3">
              <div className="mb-4">
                <input
                  type="text"
                  name="customer_name"
                  value={formData.customer_name}
                  className="w-full p-2 border rounded"
                  placeholder="Recipient name"
                  onChange={handleChange}
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="customer_phone_number"
                  value={formData.customer_phone_number}
                  className="w-full p-2 border rounded"
                  placeholder="Receiver's Phone Number"
                  onChange={handleChange}
                />
              </div>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Pick Up Address"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={pickUpInput}
                  onChange={(e) => setPickUpInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    fetchLocationSuggestions(pickUpInput, "primary")
                  }
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  <FaSearch className="text-gray-500" />
                </button>
                {Array.isArray(pickUp) && pickUp.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {pickUp.map((location: any, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleLocationSelect(location, "primary")
                        }
                      >
                        {location.name} - {location.City}, {location.Country}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Drop Of Address"
                  className="w-full p-3 border border-gray-300 rounded-md"
                  value={dropOffInput}
                  onChange={(e) => setDropOffInput(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    fetchLocationSuggestions(dropOffInput, "secondary")
                  }
                  className="absolute inset-y-0 right-3 flex items-center"
                >
                  <FaSearch className="text-gray-500" />
                </button>
                {Array.isArray(dropOff) && dropOff.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                    {dropOff.map((location: any, index) => (
                      <li
                        key={index}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() =>
                          handleLocationSelect(location, "secondary")
                        }
                      >
                        {location.name} - {location.City}, {location.Country}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex justify-between w-full mt-4">
                <div>Price: {price ? `${price}birr` : "N/A"}</div>
              </div>
            </div>
          </div>
          <div className="w-3/4 mt-4 mx-auto">
            <button
              type="button"
              className="w-full bg-purple-500 p-3 text-white rounded-md hover:bg-purple-600"
              onClick={handleSubmit}
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrderPage;
