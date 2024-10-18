import { useUser } from "@clerk/clerk-react";
import { createContext, useContext, useEffect, useState } from "react";

export interface FinancialRecord {
  _id?: string;
  userId: string;
  date: Date;
  description: string;
  amount: number;
  category: string;
  paymentMethod: string;
}

interface FinancialRecordsContextType {
  records: FinancialRecord[];
  addRecord: (record: FinancialRecord) => void;
  updateRecord: (id: string, newRecord: FinancialRecord) => void;
  deleteRecord: (id: string) => void;
}

export const FinancialRecordsContext = createContext<
  FinancialRecordsContextType | undefined
>(undefined);

export const FinancialRecordsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useUser();

  const fetchRecords = async () => {
    try {
      if (user && user.id) {
        const response = await fetch(
          `https://personalfinancetracker-server-1.onrender.com/financial-records/getAllByUserID/${user.id}`
        );

        if (response.ok) {
          const data = await response.json();
          setRecords(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.id && loading) {
      fetchRecords();
    }
  }, [user, user?.id, loading]);

  const addRecord = async (record: FinancialRecord) => {
    try {
      const response = await fetch("https://personalfinancetracker-server-1.onrender.com/financial-records", {
        method: "POST",
        body: JSON.stringify(record),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const newRecord = await response.json();
        setRecords((prev) => [...prev, newRecord]);
      }
    } catch (error) {
      console.error("Failed to add record:", error);
    }
  };

  const updateRecord = async (id: string, newRecord: FinancialRecord) => {
    try {
      const response = await fetch(
        `https://personalfinancetracker-server-1.onrender.com/financial-records/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(newRecord),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const updatedRecord = await response.json();
        setRecords((prev) =>
          prev.map((record) => (record._id === id ? updatedRecord : record))
        );
      }
    } catch (error) {
      console.error("Failed to update record:", error);
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      const response = await fetch(
        `https://personalfinancetracker-server-1.onrender.com/financial-records/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setRecords((prev) => prev.filter((record) => record._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete record:", error);
    }
  };

  return (
    <FinancialRecordsContext.Provider
      value={{ records, addRecord, updateRecord, deleteRecord }}
    >
      {!loading && children}
    </FinancialRecordsContext.Provider>
  );
};

export const useFinancialRecords = () => {
  const context = useContext<FinancialRecordsContextType | undefined>(
    FinancialRecordsContext
  );

  if (!context) {
    throw new Error(
      "useFinancialRecords must be used within a FinancialRecordsProvider"
    );
  }

  return context;
};
