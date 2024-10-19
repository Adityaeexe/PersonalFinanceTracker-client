import { useUser } from "@clerk/clerk-react";
import { FinancialRecordForm } from "./financial-record-form";
import { FinancialRecordList } from "./financial-record-list";
import "./financial-record.css";
import { useFinancialRecords } from "../../contexts/financial-record-context";
import { useMemo } from "react";

export const Dashboard = () => {
  const { user, isLoaded } = useUser();
  const { records } = useFinancialRecords();

  const totalMonthly = useMemo(() => {
    let totalAmount = 0;
    records.forEach((record) => {
      totalAmount += record.amount;
    });

    return totalAmount;
  }, [records]);

  if (!isLoaded) {
    return (
      <div style={{
        backgroundColor: 'black',
        color: 'white',
        fontSize: '1.875rem', // equivalent to text-3xl
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <h1>Welcome {user?.firstName}! Here Are Your Finances:</h1>
      <FinancialRecordForm />
      <div>Total Monthly: ${totalMonthly}</div>
      <FinancialRecordList />
    </div>
  );
};