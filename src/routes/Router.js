import { lazy } from "react";
import { Navigate } from "react-router-dom";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout/FullLayout.js"));
/****End Layouts*****/

// form Transactions
const Bank = lazy(() => import("../components/Masters/Bank.js"));
const Company = lazy(() => import("../components/Masters/Company.js"));
const Customer = lazy(() => import("../components/Masters/Customer.js"));
const PorductCategory = lazy(() =>
  import("../components/Masters/ProductCategory.js")
);
const Product = lazy(() => import("../components/Masters/Product.js"));
const Supplier = lazy(() => import("../components/Masters/Supplier.js"));
const UOM = lazy(() => import("../components/Masters/UOM.js"));
const Users = lazy(() => import("../components/Masters/Users.js"));

// form transacations
const PurchaseInvoice = lazy(() =>
  import("../components/Transactions/PurchaseInvoice.js")
);
const ManagePurchaseInvoice = lazy(() =>
  import("../components/Transactions/ManagePurchaseInvoice.js")
);

const ManageSalesInvoice = lazy(() =>
  import("../components/Transactions/ManageSalesInvoice")
);
const SalesInvoice = lazy(() =>
  import("../components/Transactions/SalesInvoice")
);

const MISPurchaseInvoice = lazy(() =>
  import("../components//Reports/MISPurchaseInvoice.js")
);

const MISSalesInvoice = lazy(() =>
  import("../components//Reports/MISSalesInvoice.js")
);


const MISStockReport = lazy(() =>
  import("../components//Reports/MISStockReport.js")
);

/*****Routes******/
const ThemeRoutes = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      // { path: "/", element: <Navigate to="dashboards/dashboard1" /> },
      // { path: "dashboards/dashboard1", exact: true, element: <Dashboard1 /> },
      { path: "/", element: <Company /> },
      { path: "/masters/Bank", element: <Bank /> },
      { path: "/masters/Company", element: <Company /> },
      { path: "/masters/Customer", element: <Customer /> },
      { path: "/masters/ProductCategory", element: <PorductCategory /> },
      { path: "/masters/Product", element: <Product /> },
      { path: "/masters/Supplier", element: <Supplier /> },
      { path: "/masters/UOM", element: <UOM /> },
      { path: "/masters/Users", element: <Users /> },
      { path: "/transacation/PurchaseInvoice", element: <PurchaseInvoice /> },
      {
        path: "/transacation/PurchaseInvoice/:id",
        element: <PurchaseInvoice />,
      },
      {
        path: "/transacation/ManagePurchaseInvoice",
        element: <ManagePurchaseInvoice />,
      },
      { path: "/transacation/SalesInvoice", element: <SalesInvoice /> },
      { path: "/transacation/SalesInvoice/:id", element: <SalesInvoice /> },
      {
        path: "/transacation/ManageSalesInvoice",
        element: <ManageSalesInvoice />,
      },
      {
        path: "/mis_reports/MISPurchaseInvoice",
        element: <MISPurchaseInvoice />,
      },
      {
        path: "/mis_reports/MISSalesInvoice",
        element: <MISSalesInvoice />,
      },      
      {
        path: "/mis_reports/MISStockReport",
        element: <MISStockReport />,
      },
    ],
  },
];

export default ThemeRoutes;
