import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const colorOptions = {
  Earbuds: [
    { value: "blue", label: "Blue" },
    { value: "red", label: "Red" },
    { value: "green", label: "Green" },
  ],
  Charger: [
    { value: "black", label: "Black" },
    { value: "white", label: "White" },
  ],
  Cable: [
    { value: "black", label: "Black" },
    { value: "white", label: "White" },
  ],
};

const Extra = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  // console.log(product);

  const [quantity, setQuantity] = useState(1);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);
  const [isProductAdded, setIsProductAdded] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");
  const [logoName, setLogoName] = useState("");

  const [bluetoothName, setBluetoothName] = useState("");

  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  function handleChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const basePath = "http://localhost:5000/orderuploads/";
      const fullPath = `${basePath}${selectedFile.name}`; // Construct the full path
      setFilePath(fullPath); // Set the full path in state

      // Set the preview URL for inline display
      setPreviewUrl(URL.createObjectURL(selectedFile));

      // Log the full path
      console.log("Selected File Path:", fullPath);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    console.log("Submitting File with Path:", filePath);
  }

  useEffect(() => {
    if (product) {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const productInCart = cart.find((item) => item.id === product.id);
      if (productInCart) {
        setQuantity(productInCart.quantity);
        setIsProductAdded(false);
        const newSubtotal = product.price * productInCart.quantity;
        setSubtotal(newSubtotal);
        setTotal(newSubtotal + 1.99); // Fixed tax for example
      } else {
        setIsProductAdded(false);
        setSubtotal(product.price);
        setTotal(product.price + 1.99); // Fixed tax for example
      }

      // Handle color options based on the product's category
      const options = colorOptions[product.category] || [];
      if (options.length > 0) {
        setSelectedColor(options[0].value);
      } else {
        setSelectedColor(""); // Or some default value
      }
    }
  }, [product]);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      updateCart(newQuantity);
      return newQuantity;
    });
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => {
      if (prevQuantity > 1) {
        const newQuantity = prevQuantity - 1;
        updateCart(newQuantity);
        return newQuantity;
      }
      return prevQuantity;
    });
  };

  const updateCart = (quantity) => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((item) => item.id !== product.id);
    updatedCart.push({
      ...product,
      quantity,
      color: selectedColor,
      logoName,

      bluetoothName,
    });

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    const newSubtotal = product.price * quantity;
    setSubtotal(newSubtotal);
    setTotal(newSubtotal + 1.99); // Fixed tax for example
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((item) => item.id !== product.id);
    updatedCart.push({
      ...product,
      quantity,
      color: selectedColor,
      logoName,

      bluetoothName,
    });
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setIsProductAdded(true);
  };

  const handleViewCart = () => {
    navigate("/cart");
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {isProductAdded && (
          <div className="w-full bg-green-800 text-white flex justify-between items-center rounded mb-4">
            <div className="p-4 px-5">Product Added To Your Cart.</div>
            <div>
              <button
                className="bg-white text-black mr-5 p-2 font-bold md:w-36 w-32 rounded"
                onClick={handleViewCart}
              >
                View Cart
              </button>
            </div>
          </div>
        )}
        <h1 className="text-2xl font-semibold mb-4 mt-5">Shopping Cart</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-3/4 w-full">
            <div className="bg-white rounded-lg shadow-md p-6 mb-4">
              {product ? (
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="relative">
                    <img
                      className="h-64 w-64 border-2 border-black"
                      src="./1.jpg"
                      alt={product.title}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      {" "}
                      <h2 className="text-xl font-bold">
                        {product.subCategoryName}
                      </h2>
                      <div className="items-center">
                        <button
                          type="button"
                          className="border rounded-md py-1 px-3 mr-2"
                          onClick={handleDecrement}
                        >
                          -
                        </button>
                        <span className="text-center w-8">{quantity}</span>
                        <button
                          type="button"
                          className="border rounded-md py-1 px-3 ml-2"
                          onClick={handleIncrement}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <p className="text-sm">{product.description}</p>
                    <div className="flex items-center gap-4">
                      <form>
                        <select
                          id="color-select"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          value={selectedColor}
                          onChange={(e) => setSelectedColor(e.target.value)}
                        >
                          {colorOptions[product.category]?.map((color) => (
                            <option key={color.value} value={color.value}>
                              {color.label}
                            </option>
                          )) || <option value="">No colors available</option>}
                        </select>
                      </form>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-lg ">Price: ₹{product.price}</span>
                    </div>
                    <p className="text-lg ">Total: ₹{subtotal}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">No products in cart.</div>
              )}
              <div className="flex flex-col mt-4">
                <span className="text-red-600">
                  *Select any one your logo name or upload your logo
                </span>
                <div className="flex items-center space-x-4">
                  <label className="font-semibold flex flex-col">
                    Your Logo Name
                    <input
                      className="border mt-1 p-2"
                      value={logoName}
                      onChange={(e) => setLogoName(e.target.value)}
                    />
                  </label>
                  <div className="mt-4">
                    <label
                      htmlFor="logoFile"
                      className="block text-sm font-medium"
                    >
                      Upload Logo
                    </label>
                    <div>
                      <input type="file" onChange={handleChange} />
                      <p>Selected File Path: {filePath}</p>{" "}
                      {/* Display the selected file path */}
                      {previewUrl && (
                        <div>
                          <img
                            src={previewUrl}
                            alt="Selected Preview"
                            style={{ width: "200px", marginTop: "10px" }}
                          />
                        </div>
                      )}
                      {/* A link to open the image in the browser */}
                      {filePath && (
                        <div>
                          <a
                            href={filePath}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open Image in Browser
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <label className="mt-4 font-semibold">
                  Bluetooth Search Name
                  <select
                    className="border mt-1 p-2 mx-3"
                    name="bluetoothName"
                    value={bluetoothName}
                    onChange={(e) => setBluetoothName(e.target.value)}
                  >
                    <option value="Select Option">Select Option</option>
                    <option value="My Love">My Love</option>
                    <option value="My Lifeline">My Lifeline</option>
                    <option value="SweetHeart">SweetHeart</option>
                    <option value="Soulmate">Soulmate</option>
                    <option value="Daddy">Daddy</option>
                    <option value="Mom">Mom</option>
                    <option value="Best Brother">Best Brother</option>
                    <option value="Wifey">Wifey</option>
                    <option value="Baby">Baby</option>
                    <option value="Darling">Darling</option>
                    <option value="My Queen">My Queen</option>
                    <option value="My King">My King</option>
                    <option value="Cute Sister">Cute Sister</option>
                    <option value="Bro">Bro</option>
                    <option value="MAA">MAA</option>
                    <option value="Best Friend">Best Friend</option>
                    <option value="Friend Forever">Friend Forever</option>
                    <option value="Bestie">Bestie</option>
                    <option value="Cutie">Cutie</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
          <div className="md:w-1/4 w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Summary</h2>
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Taxes</span>
                <span>₹1.99</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Shipping</span>
                <span>₹0.00</span>
              </div>
              <hr className="my-2" />
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">₹{total}</span>
              </div>
              <button
                className="bg-red-500 text-white py-2 px-4 rounded-lg mt-4 w-full"
                onClick={handleAddToCart}
              >
                Add To Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Extra;
