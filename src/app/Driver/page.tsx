"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Import useRouter
import { FiMenu } from "react-icons/fi";
import { FaMapMarkerAlt } from "react-icons/fa";

const Orders = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedCard, setExpandedCard] = useState(null);
  const [orders, setOrders] = useState([]);
  const router = useRouter(); // Initialize router

  const mapApiStatusToUiStatus = (apiStatus) => {
    switch (apiStatus) {
      case "pending":
        return "Available";
      case "delivering":
        return "Delivering";
      case "completed":
        return "Completed";
      default:
        return "Scheduled";
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://liyt-api-1.onrender.com/orders");
        const data = await response.json();
        const formattedOrders = data.map((order) => ({
          id: order.id,
          item: `Job #${order.id}`,
          origin: order.origin,
          destination: order.destination,
          price: order.price,
          status: mapApiStatusToUiStatus(order.status),
          customer_name: order.customer_name,
          customer_phone: order.customer_phone_number,
        }));
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleCardClick = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  const handleAcceptJob = async (orderId) => {
    try {
      await fetch(`/api/orders/${orderId}/accept`, { method: "POST" });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: "Delivering" } : order
        )
      );

      // Navigate to JobDetails page with the order ID
      router.push(`/Driver/${orderId}`);
    } catch (error) {
      console.error("Failed to accept job:", error);
    }
  };

  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div className="bg-white min-h-screen">
      <div className="w-full p-4 bg-gradient-to-r from-purple-600 to-blue-400 text-white flex items-center justify-between shadow-md fixed top-0">
        <FiMenu size={24} className="cursor-pointer" />
        <h1 className="text-xl font-bold flex-grow text-center">LIYT</h1>
      </div>

      <div className="pt-20 p-4">
        <div className="flex space-x-4 mb-4 overflow-x-auto">
          {["All", "Completed", "Delivering", "Available"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              className={`py-2 px-4 rounded-full whitespace-nowrap ${
                activeTab === tab
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => handleCardClick(order.id)}
              className="bg-white shadow-md p-4 rounded-lg cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {order.item}
                  </p>
                  <p className="text-gray-500 text-sm">#{order.id}</p>
                  <p
                    className={`font-semibold text-sm mt-2 ${
                      order.status === "Available"
                        ? "text-purple-600"
                        : order.status === "Delivering"
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {order.status}
                  </p>
                </div>
                {expandedCard === order.id && (
                  <div className="text-center">
                    <p className="text-xl font-bold text-gray-800">
                      {order.price} Birr
                    </p>
                  </div>
                )}
              </div>

              {expandedCard === order.id && (
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="text-red-500" />
                    <p className="text-sm text-gray-700">{order.origin}</p>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <p className="text-sm text-gray-700">
                      {order.destination}
                    </p>
                  </div>
                  {order.status === "Available" ? (
                    <button
                      className="w-full mt-4 py-2 rounded-lg bg-purple-600 text-white font-semibold"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptJob(order.id);
                      }}
                    >
                      Accept Job
                    </button>
                  ) : (
                    <p className="w-full mt-4 py-2 rounded-lg bg-gray-300 text-center text-gray-600 font-semibold cursor-default">
                      {order.status}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;
