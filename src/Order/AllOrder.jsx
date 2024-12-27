import React, { useEffect, useState } from "react";
import SideBar from "../Componets/SideBar";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import DataTable from "react-data-table-component";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrintIcon from "@mui/icons-material/Print";
import { useNavigate } from "react-router-dom";

const AllOrder = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [pendingOrder, setPendingOrder] = useState(0);
  const [delivred, setDelivred] = useState(0);
  const [CancelOrder, setCancelOrder] = useState(0);
  const [confirm, setConfirm] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = () => {
    axios
      .get(`${BASE_URL}/order/get`)
      .then((response) => {
        setProducts(response.data.data);
        setFilteredProducts(response.data.data);

        setLoading(false);
      })

      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchPendingOrder = () => {
    axios
      .get(`${BASE_URL}/order/pendingStatusOrder`)
      .then((response) => {
        if (response.data && response.data.data) {
          setPendingOrder(response.data.data.length);
        } else {
          setPendingOrder(0); // Set to 0 if data is not in expected format
        }
      })
      .catch((error) => {
        console.error("There was an error fetching pending orders!", error);
        setPendingOrder(0); // Set to 0 in case of error
      });
  };
  useEffect(() => {
    fetchPendingOrder();
  }, []);

  const fetchDeliviredOrder = () => {
    axios
      .get(`${BASE_URL}/order/DeliveredStatusOrder`)
      .then((response) => {
        if (response.data && response.data.data) {
          setDelivred(response.data.data.length);
        } else {
          setDelivred(0); // Set to 0 if data is not in expected format
        }
      })
      .catch((error) => {
        console.error("There was an error fetching pending orders!", error);
        setDelivred(0); // Set to 0 in case of error
      });
  };
  useEffect(() => {
    fetchDeliviredOrder();
  }, []);
  const fetchConfirmOrder = () => {
    axios
      .get(`${BASE_URL}/order/ConfirmedStatusOrder`)
      .then((response) => {
        if (response.data && response.data.data) {
          setConfirm(response.data.data.length);
        } else {
          setConfirm(0); // Set to 0 if data is not in expected format
        }
      })
      .catch((error) => {
        console.error("There was an error fetching pending orders!", error);
        setConfirm(0); // Set to 0 in case of error
      });
  };
  useEffect(() => {
    fetchConfirmOrder();
  }, []);

  const fetchCancelOrder = () => {
    axios
      .get(`${BASE_URL}/order/CanceledStatusOrder`)
      .then((response) => {
        if (response.data && response.data.data) {
          setCancelOrder(response.data.data.length);
        } else {
          setCancelOrder(0); // Set to 0 if data is not in expected format
        }
      })
      .catch((error) => {
        console.error("There was an error fetching pending orders!", error);
        setCancelOrder(0); // Set to 0 in case of error
      });
  };
  useEffect(() => {
    fetchCancelOrder();
  }, []);

  const handleBillPrint = (id) => {
    navigate(`/print-bill/${id}`);
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredProducts(
      products.filter((product) => product.email.toLowerCase().includes(query))
    );
  };
  const handleViewClick = (id) => {
    navigate(`/order-details/${id}`);
  };
  const handleDelete = (row) => {
    setDeleteId(row._id);
    setShowDeleteDialog(true);
  };
  const confirmDelete = () => {
    axios
      .delete(`${BASE_URL}/order/delete/${deleteId}`)
      .then((response) => {
        if (response.status === 200) {
          fetchProducts();
          setShowDeleteDialog(false);
          toast.success("order deleted successfully!");
        }
      })
      .catch((error) => {
        console.error("There was an error deleting the product!", error);
        setShowDeleteDialog(false);
      });
  };
  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
  };
  const columns = [
    {
      name: "SL",
      selector: (row) => row._id,
      sortable: false,
    },

    {
      name: "Customer Info",
      selector: (row) => row.fullname,
      sortable: false,
      minWidth: "140px",
    },

    {
      name: "Email",
      selector: (row) => row.email,
      sortable: false,
      minWidth: "200px",
    },
    {
      name: "Product",
      selector: (row) => {
        // Check if items array exists and has at least one item
        if (row.items && row.items.length > 0) {
          // Extract product name and color from the first item
          const item = row.items[0];
          return `${item.productName} - ${item.color}`;
        }
        return "N/A";
      },
      sortable: false,
    },
    {
      name: "Amount",
      selector: (row) => row.totalPrice,
      sortable: false,
    },
    {
      name: "Order Date",
      selector: (row) => row.OrderDate,
      minWidth: "110px",
    },
    {
      name: "Payment Status",
      selector: (row) => row.paymentStatus,
      minWidth: "110px",
    },

    {
      name: "Order Status",
      selector: (row) => row.orderStatus,
      sortable: false,
      minWidth: "130px",
      cell: (row) => (
        <span className={`status-${row.orderStatus.toLowerCase()}`}>
          {row.orderStatus}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleViewClick(row._id)}
            className="text-red-600 hover:text-red-600"
          >
            <VisibilityIcon className="text-xl border  border-black" />
          </button>
          <button
            onClick={() => handleBillPrint(row._id)}
            className="text-black"
          >
            <PrintIcon className="text-xl border border-red-500" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 hover:text-red-800"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="text-xl" />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div>
      <SideBar />
      <div className="md:pl-64 pt-14 m-2">
        <div className="flex items-center pt-3 pl-6">
          <img src="../allorder.png" alt="/" className="h-6 w-6" />
          <p className="font-bold text-lg px-2">All Order</p>
        </div>

        <div className="p-5">
          <div className="bg-white border border-gray-200 p-3 rounded-lg shadow-md">
            <div className="grid grid-cols-1 xl:grid-cols-4 sm:grid-cols-2 gap-4 mt-4 m-4">
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center">
                  <img
                    src="./circular-clock (1).png"
                    alt="/box (1).png"
                    className="w-5 h-5"
                  />
                  <p className="ml-2 font-semibold">Pending</p>
                  <p className="ml-auto text-red-600 font-bold">
                    {pendingOrder}
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center">
                  <img
                    src="./checked (1).png"
                    alt="/box (1).png"
                    className="w-5 h-5"
                  />
                  <p className="ml-2 font-semibold">Confirmed</p>
                  <p className="ml-auto text-red-600 font-bold">{confirm}</p>
                </div>
              </div>

              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center">
                  <img
                    src="./cancel (1).png"
                    alt="/box (1).png"
                    className="w-5 h-5"
                  />
                  <p className="ml-2 font-semibold">Canceled</p>
                  <p className="ml-auto text-red-600 font-bold">
                    {CancelOrder}
                  </p>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex items-center">
                  <img
                    src="./package.png"
                    alt="/package.png"
                    className="w-5 h-5"
                  />
                  <p className="ml-2 font-semibold">Delivered</p>
                  <p className="ml-auto text-red-600 font-bold">{delivred}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 p-5">
              <div className="flex items-center mb-4 md:mb-0">
                <input
                  type="text"
                  className="form-control p-2 border border-gray-300 rounded-l-md"
                  placeholder="Search by email"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <button
                  onClick={() =>
                    setFilteredProducts(
                      products.filter((product) =>
                        product.email.toLowerCase().includes(searchQuery)
                      )
                    )
                  }
                  className="bg-red-600 text-white p-2 px-4 rounded-r-md"
                >
                  Search
                </button>
              </div>
              <div className="flex space-x-2">
                <button className="border border-red-600 text-red-600 p-2 px-4 rounded hover:bg-red-600 hover:text-white">
                  <DownloadIcon /> Export
                </button>
              </div>
            </div>
            <DataTable
              className=""
              columns={columns}
              data={filteredProducts}
              progressPending={loading}
              pagination
              paginationPerPage={10}
              highlightOnHover
              customStyles={{
                headRow: {
                  style: {
                    fontSize: "15px",
                    fontWeight: "bold",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-gray-100 p-6 rounded shadow-lg">
            <p>Are you sure you want to delete this user data?</p>
            <div className="mt-4 flex space-x-4 justify-center">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default AllOrder;
