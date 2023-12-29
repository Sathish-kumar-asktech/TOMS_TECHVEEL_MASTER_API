import LocalMallIcon from '@mui/icons-material/LocalMall';
import StorefrontIcon from '@mui/icons-material/Storefront';

const Transaction = [
  {
    title: "Purchase Invoice",
    icon: StorefrontIcon,
    href: "/transacation/ManagePurchaseInvoice",
  },
  {
    title: "Sales Invoice",
    icon: LocalMallIcon,
    href: "/transacation/ManageSalesInvoice",
  },
];

export default Transaction;
