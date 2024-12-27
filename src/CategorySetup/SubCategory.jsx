import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import SideBar from "../Componets/SideBar";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

// update the ui

const SubCategory = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState();
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(
    "https://minaxipalace.in/app/public/assets/admin/img/400x400/img2.jpg"
  );
  const [formData, setFormData] = useState({
    subCategoryName: "",
    category: "",
    photo: null,
  });
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchSubCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get(`${BASE_URL}/category/get`)
      .then((response) => {
        setCategories(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
        setLoading(false);
      });
  };
  const fetchSubCategories = () => {
    axios
      .get(`${BASE_URL}/sub-category/get`)
      .then((response) => {
        setSubCategories(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
        setLoading(false);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, photo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("category", formData.category);
    data.append("subCategoryName", formData.subCategoryName);
    data.append("photo", formData.photo);

    if (editMode) {
      // Update category
      axios
        .put(`${BASE_URL}/sub-category/update/${editId}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            fetchCategories();
            resetForm();
            toast.success("Sub-Category updated successfully!");
          }
        })
        .catch((error) => {
          console.error("There was an error updating the category!", error);
        });
    } else {
      // Add new category
      axios
        .post(`${BASE_URL}/sub-category/add`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          if (response.status === 200) {
            fetchSubCategories();
            resetForm();
            toast.success("Sub-Category added successfully!"); // Success toast
          }
        })
        .catch((error) => {
          console.error("There was an error adding the category!", error);
        });
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleEdit = (row) => {
    setFormData({
      category: row.category,
      subCategoryName: row.subCategoryName,
      photo: null,
    });
    setImagePreview(row.photo);
    setEditId(row._id);
    setEditMode(true);
  };

  const handleDelete = (row) => {
    setDeleteId(row._id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    axios
      .delete(`${BASE_URL}/sub-category/delete/${deleteId}`)
      .then((response) => {
        if (response.status === 200) {
          fetchSubCategories();
          setShowDeleteDialog(false);
          toast.success("Sub Category deleted successfully!");
        }
      })
      .catch((error) => {
        console.error("There was an error deleting the category!", error);
        setShowDeleteDialog(false);
      });
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  const resetForm = () => {
    setFormData({ category: "", subCategoryName: "", photo: null });
    setImagePreview(
      "https://minaxipalace.in/app/public/assets/admin/img/400x400/img2.jpg"
    );
    setEditMode(false);
    setEditId(null);
  };

  const columns = [
    {
      name: "SL",
      selector: (row) => row._id,
    },
    {
      name: "Sub Category Image",
      selector: "photo",
      cell: (row) => (
        <img src={row.photo} alt="Category" className="w-14 h-14 mb-2 mt-2" />
      ),
    },

    {
      name: "subCategoryName",
      selector: (row) => row.subCategoryName,
    },
    {
      name: "Category",
      selector: (row) => row.category,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleEdit(row)}
            className="text-blue-600 text-xl"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="text-red-600 text-xl"
          >
            <FontAwesomeIcon icon={faTrashAlt} />
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
          <img
            src="./addcategory.png"
            alt="Add Category"
            className="w-6 h-6 mr-2"
          />
          <p className="font-bold text-lg">
            {editMode ? "Edit Category" : "Add Sub Category"}
          </p>
        </div>
        <div className="m-2 bg-white border border-gray-200 p-3 mb-4 rounded-lg shadow">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <ul className="flex mb-4">
              <li className="nav-item">
                <a
                  className="nav-link lang_link active text-red-600"
                  href="/"
                  id="en-link"
                >
                  English(EN)
                </a>
              </li>
            </ul>
            <div className="flex flex-wrap md:flex-nowrap gap-2 items-end">
              <div className="w-full md:w-1/2 mb-4">
                <label className="block text-gray-700 font-semibold">
                  Category
                  <span className="text-orange-700">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus: block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500"
                  required
                >
                  <option value="">---Select Branch---</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category.categoryName}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
                <label className="block text-gray-700 font-semibold mt-4">
                  Sub CategoryName
                </label>
                <input
                  type="text"
                  name="subCategoryName"
                  className="p-2 form-input mt-1 block w-full border border-gray-300 rounded-md"
                  placeholder="New Sub-Category"
                  maxLength="255"
                  value={formData.subCategoryName}
                  required
                  onChange={handleInputChange}
                />
              </div>

              <div className="w-full md:w-1/2 mb-4">
                <div className="text-center mt-2">
                  <img
                    width="105"
                    className="rounded-lg border"
                    id="viewer"
                    src={imagePreview}
                    alt="/"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-gray-700 font-semibold">
                    Sub Category Image{" "}
                    <small className="text-red-500">* ( Ratio 1:1 )</small>
                  </label>
                  <div className="custom-file mt-2">
                    <input
                      type="file"
                      name="photo"
                      id="customFileEg1"
                      className="custom-file-input border border-gray-300 rounded-md w-full p-1"
                      accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex md:justify-end gap-3 mt-4">
              <button
                type="reset"
                id="reset"
                className="btn btn-secondary bg-gray-400 text-white py-2 px-4 rounded-md"
                onClick={resetForm}
              >
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary bg-red-600 text-white py-2 px-4 rounded-md"
              >
                {editMode ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
        <div>
          <DataTable
            columns={columns}
            data={subCategories}
            progressPending={loading}
            pagination
            paginationPerPage={5}
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
        {showDeleteDialog && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-gray-100 p-6 rounded-lg shadow-lg w-100">
              <h3 className="text-lg font-semibold text-center">
                Confirm Delete
              </h3>
              <p>Are you sure you want to delete this category?</p>
              <div className="mt-4 flex justify-center gap-2">
                <button
                  onClick={confirmDelete}
                  className="bg-red-500 text-white py-2 px-4 rounded-md"
                >
                  Delete
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-500 text-white py-2 px-4 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
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

export default SubCategory;
