// Tipos de transação
export type TransactionType = 'income' | 'expense';

// Categorias de transação
export type TransactionCategory = 
  | 'loot'      // Saque/pilhagem
  | 'reward'    // Recompensa
  | 'purchase'  // Compra
  | 'sale'      // Venda
  | 'service'   // Serviço (ex: hotel, reparos)
  | 'other';    // Outro

export interface Transaction {
  id: string;
  character_id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount_gold: number;
  amount_silver: number;
  amount_bronze: number;
  description: string;
  related_item_id?: string;
  created_at: string;
}

// Para criar nova transação (sem id e created_at)
export interface CreateTransactionData {
  character_id: string;
  type: TransactionType;
  category: TransactionCategory;
  amount_gold: number;
  amount_silver: number;
  amount_bronze: number;
  description: string;
  related_item_id?: string;
}

// Labels em português para exibição
export const TransactionTypeLabels: Record<TransactionType, string> = {
  income: 'Recebimento',
  expense: 'Gasto',
};

export const TransactionCategoryLabels: Record<TransactionCategory, string> = {
  loot: 'Saque/Pilhagem',
  reward: 'Recompensa',
  purchase: 'Compra',
  sale: 'Venda',
  service: 'Serviço',
  other: 'Outro',
};

// Helper para formatar moeda
export const formatCurrency = (gold: number, silver: number, bronze: number): string => {
  const parts: string[] = [];
  if (gold > 0) parts.push(`${gold} PO`);
  if (silver > 0) parts.push(`${silver} PP`);
  if (bronze > 0) parts.push(`${bronze} PC`);
  return parts.length > 0 ? parts.join(', ') : '0 PC';
};

// Helper para calcular total em bronze (para comparações)
export const calculateTotalInBronze = (gold: number, silver: number, bronze: number): number => {
  return (gold * 100) + (silver * 10) + bronze;
};

