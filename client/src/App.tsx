import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid } from "@mui/x-data-grid";

import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

interface PayrollTableProps {
  startDate: string;
}

const PayrollTable = ({ startDate }: PayrollTableProps) => {
  const [data, setData] = useState([]);
  const fetchData = async (from: String) => {
    const response = await fetch(`/payroll-dates/${from}`, {
      headers: { accept: "application/json" },
    });
    return response.json();
  };
  useEffect(() => {
    const init = async () => {
      const data = await fetchData(startDate);
      setData(data);
    };
    init();
  }, [startDate]);
  const columns = [
    {
      field: "type",
      headerName: "Payment Type",
      width: 120,
    },
    {
      field: "date",
      headerName: "Payment Date",
      width: 320,
    },
  ];
  const rows = data.map((row: { date: string; type: string }, id) => ({
    date: dayjs(new Date(row.date)).format("dddd DD MMM YYYY"),
    type: `${row.type.charAt(0).toUpperCase()}${row.type.slice(1)}`,
    id,
  }));
  return (
    <>
      <DataGrid rows={rows} columns={columns} hideFooterPagination autoHeight />
    </>
  );
};

export default function App() {
  const [startDate, setStartDate] = useState(dayjs() as dayjs.Dayjs | null);
  const mutateStartDate = (value: dayjs.Dayjs | null) => setStartDate(value);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="sm">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Simple Payroll Dates Display
          </Typography>
          <DatePicker
            label="Select a start date"
            onChange={mutateStartDate}
            value={startDate}
          />
          {startDate && (
            <PayrollTable startDate={startDate.format("YYYY/MM/DD")} />
          )}
        </Box>
      </Container>
    </LocalizationProvider>
  );
}
