import React, { useEffect, useState } from "react";
import SideBar from "../Componets/SideBar";
import PersonIcon from "@mui/icons-material/Person";
import DataTable from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

const User = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = () => {
    axios
      .get(`${BASE_URL}/register/get`)
      .then((response) => {
        setOrders(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
        setLoading(false);
      });
  };

  const handleDelete = (row) => {
    setDeleteId(row._id);
    setShowDeleteDialog(true);
  };
  const confirmDelete = () => {
    axios
      .delete(`${BASE_URL}/register/delete/${deleteId}`)
      .then((response) => {
        if (response.status === 200) {
          fetchProducts();
          setShowDeleteDialog(false);
          toast.success("Register deleted successfully!");
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
      name: "Full Name",
      selector: (row) => row.fullname,
      sortable: false,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: false,
    },
    {
      name: "Phone No",
      selector: (row) => row.phone,
      sortable: false,
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
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
          <PersonIcon />
          <p className="font-bold text-lg px-2">All Register User</p>
        </div>
        <div className="md:mt-10 mt-4 text-base">
          <DataTable
            columns={columns}
            data={orders}
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
      </div>
    </div>
  );
};

export default User;
