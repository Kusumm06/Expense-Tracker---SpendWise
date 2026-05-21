import { createContext, useState, useContext } from 'react';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const toggleExpenseModal = () => setIsExpenseModalOpen(prev => !prev);
  const toggleGoalModal = () => setIsGoalModalOpen(prev => !prev);
  
  // Call this function when a new item is created so dependents can refetch
  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  const value = {
    isExpenseModalOpen,
    toggleExpenseModal,
    setIsExpenseModalOpen,
    isGoalModalOpen,
    toggleGoalModal,
    setIsGoalModalOpen,
    refreshTrigger,
    triggerRefresh
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
