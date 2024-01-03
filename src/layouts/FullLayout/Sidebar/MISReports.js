import AssessmentIcon from '@mui/icons-material/Assessment';
import RequestPageIcon from '@mui/icons-material/RequestPage';
import ShowChartIcon from '@mui/icons-material/ShowChart';

const MISReports = [
  {
    title: "Purchase Report",
    icon: AssessmentIcon,
    href: "/mis_reports/MISPurchaseInvoice",
  },
  {
    title: "Sales Report",
    icon: RequestPageIcon,
    href: "/mis_reports/MISSalesInvoice",
  },  
  {
    title: "Stock Report",
    icon: ShowChartIcon,
    href: "/mis_reports/MISStockReport",
  },
];

export default MISReports;
