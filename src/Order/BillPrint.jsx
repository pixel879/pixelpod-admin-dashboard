import React, { useEffect, useState } from "react";
import SideBar from "../Componets/SideBar";
import { useParams } from "react-router-dom";
import axios from "axios";

const getCurrentDate = () => {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth() + 1; // Months are zero-indexed
  const year = today.getFullYear();

  return `${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year}`;
};

const BillPrint = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/order/order-details/get/${id}`)
      .then((response) => {
        setOrder(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the order details!", error);
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while data is being fetched
  }

  if (!order) {
    return <div>Order not found.</div>; // Handle case where order is null or undefined
  }

  return (
    <div>
      <SideBar />
      <div className="md:pl-64 pt-14 m-2">
        <div className="mx-auto text-center mt-12">
          <button
            onClick={handlePrint}
            className="bg-red-600 text-white p-2 px-4 rounded mb-4"
          >
            Print Bill
          </button>
        </div>
        <div className="text-center print-container">
          <p className="font-bold text-2xl">Make It Yours</p>
          <p className="text-lg pt-2 font-semibold">
            516, 5th Floor, Pushti Heights,
            <br /> Gurukul Rd, Nilmani Society, Memnagar,
            <br /> Ahmedabad, Gujarat 380052
          </p>
          <p className="text-lg font-normal">+91 7600483333</p>
          <p className="border-b border-black md:w-[450px] w-[350px] mx-auto mt-3"></p>
          <p className="border-b border-black md:w-[450px] w-[350px] mx-auto mt-1"></p>
        </div>
        <div>
          <div className="mb-4 mx-auto md:w-[470px] w-[340px] mt-3">
            <div className="flex justify-between">
              <p className="font-bold">
                Order ID: <span>{order._id}</span>
              </p>
              <p className="font-medium">
                Date: <span>{getCurrentDate()}</span>
              </p>
            </div>
            <p className="font-bold">
              Customer Name: <span>{order.fullname}</span>
            </p>
            <p className="font-medium">
              Phone: <span>+91 {order.phone}</span>
            </p>
            <p className="font-medium">
              Address: <span>{order.address}</span>
            </p>
          </div>
          <hr className="text-dark hr-style-2 md:w-[450px] w-[350px] mx-auto mb-4"></hr>
          <div className="flex justify-center">
            <table className="md:w-[450px] w-[350px] mx-auto border-collapse mt-3 border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left border-b border-gray-300 font-medium">
                    QTY
                  </th>
                  <th className="p-2 text-left border-b border-gray-300 font-medium">
                    DESC
                  </th>
                  <th className="p-2 text-right border-b border-gray-300 font-medium">
                    PRICE
                  </th>
                  <th className="p-2 text-right border-b border-gray-300 font-medium">
                    TOTAL
                  </th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-2 border-b border-gray-300">
                      {item.quantity}
                    </td>
                    <td className="p-2 border-b border-gray-300">
                      <span className="break-all">{item.productName}</span>
                      {" - "}
                      <span className="break-all">{item.color}</span>
                    </td>
                    <td className="p-2 text-right border-b border-gray-300">
                      {item.price} Rs
                    </td>
                    <td className="p-2 text-right border-b border-gray-300">
                      {item.totalItemPrice} Rs
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <hr className="border-dark my-4 md:w-[450px] w-[350px] mx-auto"></hr>
          <h5 className="text-center pt-3 md:w-[450px] w-[350px] mx-auto font-bold">
            THANK YOU
          </h5>
          <hr className="border-dark my-4 md:w-[450px] w-[350px] mx-auto"></hr>
          <div className="text-center md:w-[450px] w-[350px] mx-auto">
            copyright
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPrint;
