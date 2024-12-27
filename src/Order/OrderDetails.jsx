import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../Componets/SideBar";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import emailjs from "emailjs-com";

const OrderDetails = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { id } = useParams(); // Get the ID from URL parameters
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${BASE_URL}/order/order-details/get/${id}`
        );
        setOrder(response.data.data);
        setStatus(response.data.data.orderStatus || ""); // Set default status if needed
        setDeliveryDate(response.data.data.deliveryDate || ""); // Set default delivery date if needed
        setLoading(false);
      } catch (error) {
        console.error("There was an error fetching the order details!", error);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  const updateOrder = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/order/updatePaymentStatus`,
        {
          id,
          orderStatus: status,
          deliveryDate,
        }
      );
      toast.success("Order Status updated successfully");
      console.log(response.data);
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update status order");
    }
  };

  const sendToEmail = async () => {
    try {
      // First, update the order status
      await updateOrder();

      // Then, send the email
      const templateParams = {
        orderId: order._id,
        user_email: order.email,
        price: order.price,
        totalPrice: order.totalPrice,
        orderDate: order.OrderDate,
        address: order.address,
        orderStatus: status,
        paymentMode: order.paymentMode,
        deliveryDate: deliveryDate,
        message: `Your order has been delivered successfully on ${deliveryDate}. Thank you for shopping with us!`,
      };

      emailjs
        .send(
          "service_oxo4hxf",
          "template_usqsb98",
          templateParams,
          "ktZBU8MR4ujCBjOfN"
        )
        .then(
          (response) => {
            console.log("SUCCESS!", response.status, response.text);
            toast.success("Order details sent to email successfully");
          },
          (error) => {
            console.error("FAILED...", error);
            toast.error("Failed to send order details to email");
          }
        );
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send order details to email");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>No order found.</p>;
  const columns = [
    {
      name: "SL",
      cell: (row) => (
        <div>
          {row.items.map((item, index) => (
            <p className="text-base mb-6 mt-6" key={index}>
              {item._id}
            </p> // Displaying the price of each item
          ))}
        </div>
      ),
      sortable: false,
    },

    {
      name: "Item Details",
      cell: (row) => (
        <div>
          {row.items.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              {/* Conditionally render Image or logoName */}

              {/* Product Name and Quantity */}
              <div>
                <p className="font-bold text-base">{item.productName}</p>
                <span className="font-bold text-base">
                  {" - "}
                  {item.color}
                </span>
                <p className="text-base">Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      ),
      sortable: false,
    },
    {
      name: "Print",
      cell: (row) => (
        <div>
          {row.items.map((item, index) => (
            <div key={index} className="flex items-center mb-2">
              {item.photo ? (
                <img
                  src={item.photo}
                  alt={item.productName}
                  onClick={() => handleDownload(item.photo)} // Pass the item.photo directly
                  className="h-12 w-12 mr-2 pt-2 rounded cursor-pointer" // Add cursor pointer for better UX
                />
              ) : (
                <div className="h-12 w-12 mr-2 pt-2 flex items-center justify-center rounded">
                  <p className="text-base">{item.logoName || "No Image"}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      ),
      sortable: false,
    },
    {
      name: "Price",
      cell: (row) => (
        <div className="text-center">
          {row.items.map((item, index) => (
            <p className="text-base mb-6 mt-6" key={index}>
              ₹{item.price}
            </p> // Displaying the price of each item
          ))}
        </div>
      ),
      sortable: false,
    },
    {
      name: "ItemPrice",
      cell: (row) => (
        <div>
          {row.items.map((item, index) => (
            <p className="text-base mb-6 mt-6" key={index}>
              ₹{item.totalItemPrice}
            </p> // Displaying total price for each item
          ))}
        </div>
      ),
      sortable: false,
    },
  ];

  const handleDownload = (url) => {
    // Fetch the image data
    axios
      .get(url, { responseType: "blob" })
      .then((response) => {
        // Create a blob URL
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = url.split("/").pop(); // Set the filename from the URL
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => {
        console.error("There was an error downloading the image!", error);
      });
  };
  const TotalPriceDisplay = ({ data }) => {
    // Calculate total price for all orders
    const totalPrice = data.reduce((sum, row) => sum + row.totalPrice, 0);

    return (
      <div className="text-right mt-4">
        <p className="font-bold text-xl">Total Price: ₹{totalPrice}</p>
      </div>
    );
  };
  const data = [order];

  return (
    <div>
      <SideBar />
      <div className="md:pl-64 pt-14 m-2">
        <div className="flex items-center pt-3 pl-6">
          <img
            src="/path/to/allorder.png"
            alt="Order Icon"
            className="h-6 w-6"
          />
          <p className="font-bold text-lg px-2">Order Details</p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 p-5">
          {/* Order Information Section */}
          <div className="flex-1 bg-white border border-gray-200 p-3 rounded-lg shadow-md">
            <p className="font-bold text-lg text-red-600">Customized Product</p>
            <p className="text-xl font-semibold mt-2">Order #{order._id}</p>
            <div className="flex justify-between mt-4 space-y-2">
              <div>
                <p className="font-semibold">Order Date: {order.OrderDate}</p>
              </div>
              <div>
                <p className="">
                  <span className="font-semibold">Address:</span>{" "}
                  {order.address}
                </p>
                <p className="">
                  <span className="font-semibold">Order Status:</span>{" "}
                  {order.orderStatus}
                </p>
                <p className="">
                  <span className="font-semibold">Payment Method:</span>{" "}
                  {order.paymentMode}
                </p>
                <p className="">
                  <span className="font-semibold">Payment Status:</span>
                  {order.paymentStatus}
                </p>
              </div>
            </div>
            <DataTable
              columns={columns}
              className="md:mt-12 mt-6 "
              data={data}
              progressPending={loading}
              highlightOnHover
              customStyles={{
                headRow: {
                  style: {
                    fontSize: "17px",
                    fontWeight: "bold",
                    backgroundColor: "#C0C2C9",
                  },
                },
              }}
            />
            <TotalPriceDisplay data={data} />
          </div>

          {/* Update Order Status Section */}
          <div className="w-full md:w-1/3 bg-white border border-gray-200 p-3 rounded-lg shadow-md">
            <h3 className="text-lg font-medium mb-4 text-center">
              Order Setup
            </h3>
            <div className="space-y-6">
              {/* Status Select */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">
                  Change Order Status:
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Canceled">Canceled</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>

              {/* Delivery Date */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Delivery Date:</label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="border border-gray-300 p-2 rounded"
                />
              </div>

              {/* Conditional Button */}
              {status === "Delivered" ? (
                <button
                  onClick={sendToEmail}
                  className="bg-red-600 w-full text-white p-2 px-4 rounded hover:bg-red-600"
                >
                  Send to Email
                </button>
              ) : (
                <button
                  onClick={updateOrder}
                  className="bg-red-600 w-full text-white p-2 px-4 rounded hover:bg-red-600"
                >
                  Update Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default OrderDetails;
