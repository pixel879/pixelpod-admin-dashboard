import { BrowserRouter, Route, Routes } from "react-router-dom";

import SideBar from "./Componets/SideBar";
import DashBoard from "./Componets/DashBoard";
import Category from "./CategorySetup/Category";
import ProductAdd from "./ProductSetup/ProductAdd";
import ProductList from "./ProductSetup/ProductList";
import User from "./Pages/User";
import Authentication from "./Componets/Authentication";
import ProtectedRoute from "./Componets/ProtectedRoute";
import AllOrder from "./Order/AllOrder";
import OrderDetails from "./Order/OrderDetails";
import PendingOrder from "./Order/PendingOrder";
import ConfirmOrder from "./Order/ConfirmOrder";
import CancelOrder from "./Order/CancelOrder";
import DelivredOrder from "./Order/DelivredOrder";
import SubCategory from "./CategorySetup/SubCategory";
import BillPrint from "./Order/BillPrint";
import "./index.css";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route
            path="/dashboard"
            element={
              <DashBoard>
                <SideBar />
              </DashBoard>
            }
          />
          <Route path="/category" element={<Category />} />
          <Route path="/sub-category" element={<SubCategory />} />
          <Route path="/product-add" element={<ProductAdd />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/product-edit" element={<ProductAdd />} />
          <Route path="/user" element={<User />} />
          <Route path="/all-order" element={<AllOrder />} />

          <Route path="/order-details" element={<OrderDetails />} />
          <Route path="/order-details/:id" element={<OrderDetails />} />
          <Route path="/order/pending-order" element={<PendingOrder />} />
          <Route path="/order/confirmed-order" element={<ConfirmOrder />} />
          <Route path="/order/cancel-order" element={<CancelOrder />} />
          <Route path="/order/deliver-order" element={<DelivredOrder />} />
          <Route path="/print-bill" element={<BillPrint />} />
          <Route path="/print-bill/:id" element={<BillPrint />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
