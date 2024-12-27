import React, { useEffect, useState } from "react";
import SideBar from "../Componets/SideBar";
import axios from "axios";
import DownloadIcon from "@mui/icons-material/Download";
import DataTable from "react-data-table-component";
import AddIcon from "@mui/icons-material/Add";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ProductionQuantityLimitsOutlined } from "@mui/icons-material";
import { Box } from "lucide-react";

const ProductList = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios
      .get(`${BASE_URL}/product/get`)
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

  const handleEdit = (row) => {
    navigate("/product-edit", {
      state: { product: row },
    });
  };

  const handleDelete = (row) => {
    setDeleteId(row._id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`${BASE_URL}/product/delete/${deleteId}`)
      .then((response) => {
        if (response.status === 200) {
          fetchProducts();
          setShowDeleteDialog(false);
          toast.success("Product deleted successfully!");
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

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setFilteredProducts(
      products.filter((product) =>
        product.productName.toLowerCase().includes(query)
      )
    );
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row._id,
      sortable: false,
      width: "80px",
      cell: (row) => (
        <div className="text-gray-600 text-sm truncate" title={row._id}>
          {row._id}
        </div>
      ),
    },
    {
      name: "Product",
      sortable: false,
      width: "300px",
      cell: (row) => (
        <div className="flex items-center py-3 gap-3">
          <img
            src={row.photo}
            alt={row.productName}
            className="w-12 h-12 rounded-lg object-cover shadow-sm"
          />
          <div className="flex flex-col">
            <div
              className="font-medium text-gray-800 line-clamp-1"
              title={row.productName}
            >
              {row.productName}
            </div>
            <div
              className="text-sm text-gray-500 line-clamp-1"
              title={row.category}
            >
              {row.category}
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: false,
      width: "120px",
      cell: (row) => (
        <div className="font-medium text-gray-800">
          Rs. {Number(row.discountPrice).toLocaleString()}
        </div>
      ),
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: false,
      width: "500px",
      cell: (row) => (
        <div className="py-3 text-gray-600">
          <div className="line-clamp-2 text-sm" title={row.description}>
            {row.description}
          </div>
        </div>
      ),
    },
    {
      name: "Actions",
      width: "120px",
      cell: (row) => (
        <div className="flex gap-3">
          <button
            onClick={() => handleEdit(row)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit Product"
          >
            <FontAwesomeIcon icon={faEdit} className="text-lg" />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Product"
          >
            <FontAwesomeIcon icon={faTrashAlt} className="text-lg" />
          </button>
        </div>
      ),
    },
  ];

  const customStyles = {
    table: {
      style: {
        minWidth: "100%",
        backgroundColor: "white",
        borderRadius: "8px",
      },
    },
    rows: {
      style: {
        minHeight: "72px",
        "&:hover": {
          backgroundColor: "#f8fafc",
          cursor: "default",
        },
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f8fafc",
        borderBottom: "1px solid #e2e8f0",
        minHeight: "48px",
      },
    },
    headCells: {
      style: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#475569",
        paddingLeft: "16px",
        paddingRight: "16px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      },
    },
    cells: {
      style: {
        paddingLeft: "16px",
        paddingRight: "16px",
        borderBottom: "1px solid #f1f5f9",
      },
    },
    pagination: {
      style: {
        borderTop: "1px solid #e2e8f0",
        backgroundColor: "#f8fafc",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar />
      <div className="md:pl-64 pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex items-center py-6">
            <div className="bg-red-100 p-2 rounded-lg">
              <Box className="w-6 h-6" />
            </div>
            <h1 className="ml-3 text-2xl font-semibold text-gray-900">
              Products
            </h1>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-gray-200 focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-colors text-gray-700 placeholder-gray-400"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={handleSearch}
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="inline-flex items-center px-4 py-2.5 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors">
                    <DownloadIcon className="w-5 h-5 mr-2" />
                    Export
                  </button>
                  <button
                    onClick={() => navigate("/product-add")}
                    className="inline-flex items-center px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-200 transition-colors"
                  >
                    <AddIcon className="w-5 h-5 mr-2" />
                    Add Product
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={filteredProducts}
                progressPending={loading}
                pagination
                paginationPerPage={10}
                highlightOnHover
                customStyles={customStyles}
                noDataComponent={
                  <div className="p-12 text-center text-gray-500">
                    No products found
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={cancelDelete}
          />
          <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm w-full m-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Delete Product
            </h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ProductList;
