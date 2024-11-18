"use client";
import React, { useState, useEffect } from "react";
import Header from "../Header/page";
import dynamic from "next/dynamic";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";

const Map = dynamic(() => import("../map"), { ssr: false });

const Orders = () => {
  const [activeTab, setActiveTab] = useState("All Order");
  const [orders, setOrders] = useState([]); // State for orders data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null as any); // Error state
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasSearched] = useState(false); // New state to track search attempts

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://liytapi.fenads.org/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data = await response.json();
      setOrders(data); // Update orders state with fetched data
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchLocationSuggestions = async (query: string, type: string) => {
    try {
      const response = await fetch(
        `http://liytapi.fenads.org/location/${query}`
      );
      const data = await response.json();
      if (type === "primary") {
        if (data.payload.data && data.payload.data.length > 0) {
          setPickUp(data.payload.data);
        } else {
          setPickUp([]); // Clear pickUp if no data
          alert(
            "The location you are trying to set does not exist. Please try again."
          ); // Show alert
        }
      } else {
        if (data.payload.data && data.payload.data.length > 0) {
          setDropOff(data.payload.data);
        } else {
          setDropOff([]); // Clear dropOff if no data
          alert(
            "The location you are trying to set does not exist. Please try again."
          ); // Show alert
        }
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
    try {
      const response = await fetch("http://liytapi.fenads.org/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        await fetchOrders();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create order");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      console.error("Order creation error:", error);
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
      setFormData((prevData) => ({
        ...prevData,
        origin: `${latitude},${longitude}`,
      }));
    } else {
      setDropOffInput(name);
      setDropOff([]);
      setDestinationLat(latitude);
      setDestinationLon(longitude);
      setFormData((prevData) => ({
        ...prevData,
        destination: `${latitude},${longitude}`,
      }));
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

  const filteredOrders = orders.filter((order: any) =>
    activeTab === "All Order" ? true : order.status === activeTab
  );

  return (
    <>
      <Header />
      <div className="bg-white w-full h-screen">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4 w-full">
            <h1 className="text-2xl font-bold">Orders Details</h1>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-semibold"
            >
              New Orders
            </button>
          </div>

          <div className="flex space-x-6 mb-4 border-b">
            {["All Order", "Pending", "In Progress", "Delivered"].map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabClick(tab)}
                className={`py-2 ${
                  activeTab === tab
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center items-center w-full h-screen">
              <Image
                className="pb-96"
                src="/img/liyt.gif"
                alt="Loading"
                width={100}
                height={100}
              />
            </div>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border hidden sm:table">
                <thead>
                  <tr className="text-gray-800">
                    <th className="px-4 py-2 text-left border-b">Order ID</th>
                    <th className="px-4 py-2 text-left border-b">Customer</th>
                    <th className="px-4 py-2 text-left border-b">Origin</th>
                    <th className="px-4 py-2 text-left border-b">
                      Destination
                    </th>
                    <th className="px-4 py-2 text-left border-b">Date</th>
                    <th className="px-4 py-2 text-left border-b">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order: any) => (
                    <tr key={order.id} className="border-b text-gray-800">
                      <td className="px-4 py-2">{order.id}</td>
                      <td className="px-4 py-2">{order.customer_name}</td>
                      <td className="px-4 py-2">{order.origin}</td>
                      <td className="px-4 py-2">{order.destination}</td>
                      <td className="px-4 py-2">{order.date || "N/A"}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-white text-sm ${
                            order.status === "Pending"
                              ? "bg-purple-200 text-purple-800"
                              : order.status === "Delivering"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Responsive Design for Small Screens */}
              <div className="sm:hidden">
                {filteredOrders.map((order: any) => (
                  <div
                    key={order.id}
                    className="border rounded-lg mb-4 bg-white p-4 shadow"
                  >
                    <p className="text-gray-800">
                      <strong>Order ID:</strong> {order.id}
                    </p>
                    <p className="text-gray-800">
                      <strong>Customer:</strong> {order.customer_name}
                    </p>
                    <p className="text-gray-800">
                      <strong>Origin:</strong> {order.origin}
                    </p>
                    <p className="text-gray-800">
                      <strong>Destination:</strong> {order.destination}
                    </p>
                    <p className="text-gray-800">
                      <strong>Date:</strong> {order.date || "N/A"}
                    </p>
                    <p className="text-gray-800">
                      <strong>Status:</strong>{" "}
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm ${
                          order.status === "Pending"
                            ? "bg-purple-200 text-purple-800"
                            : order.status === "Delivering"
                            ? "bg-blue-200 text-blue-800"
                            : "bg-green-200 text-green-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
              <div className="bg-black w-5/6 h-5/6 flex justify-center items-center bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500">
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
                        {/* <div className="mb-4">
                        <label className="block text-gray-700">Item:</label>
                        <input
                          type="text"
                          className="w-full p-2 border rounded"
                          placeholder="Enter Item"
                          onChange={handleChange}
                        />
                      </div> */}
                        <div className="mb-4">
                          {/* <label className="block text-gray-700">
                          Recipient name:
                        </label> */}
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
                          {/* <label className="block text-gray-700">
                          Recipient Phone NO:
                        </label> */}
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
                          {Array.isArray(pickUp) && pickUp.length > 0 ? (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1">
                              {pickUp.map((location: any, index) => (
                                <li
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() =>
                                    handleLocationSelect(location, "primary")
                                  }
                                >
                                  {location.name} - {location.City},{" "}
                                  {location.Country}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            hasSearched && ( // Only show message if a search has been attempted
                              <p className="text-red-500">
                                The location you are trying to set does not
                                exist. Please try again.
                              </p>
                            )
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
                              fetchLocationSuggestions(
                                dropOffInput,
                                "secondary"
                              )
                            }
                            className="absolute inset-y-0 right-3 flex items-center"
                          >
                            <FaSearch className="text-gray-500" />
                          </button>
                          {dropOff.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1">
                              {dropOff.map((location: any, index) => (
                                <li
                                  key={index}
                                  className="p-2 hover:bg-gray-100 cursor-pointer"
                                  onClick={() =>
                                    handleLocationSelect(location, "secondary")
                                  }
                                >
                                  {location.name} - {location.City},
                                  {location.Country}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex justify-between w-full mt-4">
                          <button
                            type="button" // Ensures this button doesn’t submit the form
                            onClick={(e) => {
                              e.preventDefault(); // Prevents form submission behavior
                              handlePriceCalculation(
                                originLat,
                                originLon,
                                destinationLat,
                                destinationLon
                              );
                            }}
                            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
                          >
                            Calculate Price
                          </button>
                          <div>Price: {price ? `${price}birr` : "N/A"}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-4 mt-16">
                      <button
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault(); // Prevents form submission behavior
                          handleSubmit();
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
                      >
                        Create Order
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Orders;
