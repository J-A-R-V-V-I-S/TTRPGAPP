import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, CreateTransactionData } from '../types/transaction';
import { useUser } from './UserContext';
import { loadItems, insertItem, deleteItem } from '../utils/supabaseOperations';
import { validateCharacterId, executeWithLogging } from '../utils/errorHandler';

interface TransactionContextType {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;

  // Transaction management
  addTransaction: (data: CreateTransactionData) => Promise<void>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  refreshTransactions: () => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider = ({ children }: TransactionProviderProps) => {
  const { selectedCharacterId } = useUser();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load transactions from database
  const loadTransactions = useCallback(async (characterId: string) => {
    setLoading(true);
    setError(null);

    try {
      const loadedTransactions = await loadItems<Transaction>(
        'transactions',
        characterId,
        undefined,
        [{ column: 'created_at', ascending: false }]
      );

      setTransactions(loadedTransactions);
    } catch (err) {
      setError('Erro ao carregar transações');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-load transactions when selectedCharacterId changes
  useEffect(() => {
    if (selectedCharacterId) {
      loadTransactions(selectedCharacterId);
    } else {
      setTransactions([]);
    }
  }, [selectedCharacterId, loadTransactions]);

  // Refresh transactions
  const refreshTransactions = useCallback(async () => {
    if (selectedCharacterId) {
      await loadTransactions(selectedCharacterId);
    }
  }, [selectedCharacterId, loadTransactions]);

  // Add transaction
  const addTransaction = async (data: CreateTransactionData) => {
    validateCharacterId(selectedCharacterId, 'addTransaction');

    await executeWithLogging(
      async () => {
        await insertItem('transactions', data, 'Transação adicionada com sucesso!');
        await refreshTransactions();
      },
      'adicionar transação'
    );
  };

  // Delete transaction
  const deleteTransaction = async (transactionId: string) => {
    validateCharacterId(selectedCharacterId, 'deleteTransaction');

    await executeWithLogging(
      async () => {
        await deleteItem('transactions', transactionId, selectedCharacterId, 'Transação deletada com sucesso!');
        await refreshTransactions();
      },
      'deletar transação'
    );
  };

  const value = {
    transactions,
    loading,
    error,
    addTransaction,
    deleteTransaction,
    refreshTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};
