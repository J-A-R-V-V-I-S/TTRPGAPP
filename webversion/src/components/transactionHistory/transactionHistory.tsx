import { useState } from 'react';
import { Modal, TransactionForm } from '../modal';
import type { TransactionFormData } from '../modal';
import type { Transaction } from '../../types/transaction';
import { TransactionTypeLabels, TransactionCategoryLabels, formatCurrency } from '../../types/transaction';
import './transactionHistory.css';

interface TransactionHistoryProps {
  transactions?: Transaction[];
  onAddTransaction?: (data: TransactionFormData) => void;
  onDeleteTransaction?: (transactionId: string) => void;
}

const TransactionHistory = ({ 
  transactions = [], 
  onAddTransaction,
  onDeleteTransaction 
}: TransactionHistoryProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all');

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleSubmit = (data: TransactionFormData) => {
    if (onAddTransaction) {
      onAddTransaction(data);
    }
    setIsAddModalOpen(false);
  };

  const handleDelete = (transactionId: string) => {
    if (onDeleteTransaction && confirm('Tem certeza que deseja excluir esta transação?')) {
      onDeleteTransaction(transactionId);
    }
  };

  // Filtrar transações
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  // Calcular total
  const calculateTotal = () => {
    let totalGold = 0;
    let totalSilver = 0;
    let totalBronze = 0;

    filteredTransactions.forEach(t => {
      const multiplier = t.type === 'income' ? 1 : -1;
      totalGold += t.amount_gold * multiplier;
      totalSilver += t.amount_silver * multiplier;
      totalBronze += t.amount_bronze * multiplier;
    });

    return { totalGold, totalSilver, totalBronze };
  };

  const { totalGold, totalSilver, totalBronze } = calculateTotal();

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="transaction-history-widget">
      <div className="transaction-history-container">
        <div className="transaction-history-header">
          <h2 className="transaction-history-title">Histórico de Transações</h2>
          
          <div className="transaction-history-actions">
            <div className="transaction-filter">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                Todas
              </button>
              <button
                className={`filter-btn filter-income ${filter === 'income' ? 'active' : ''}`}
                onClick={() => setFilter('income')}
              >
                Recebimentos
              </button>
              <button
                className={`filter-btn filter-expense ${filter === 'expense' ? 'active' : ''}`}
                onClick={() => setFilter('expense')}
              >
                Gastos
              </button>
            </div>
            
            <button className="add-transaction-btn" onClick={handleAddClick}>
              <span className="btn-icon">+</span>
              Nova Transação
            </button>
          </div>
        </div>

        {/* Resumo */}
        <div className="transaction-summary">
          <div className="summary-item">
            <span className="summary-label">Total (Filtro Atual):</span>
            <span className={`summary-value ${totalGold + totalSilver + totalBronze >= 0 ? 'positive' : 'negative'}`}>
              {formatCurrency(totalGold, totalSilver, totalBronze)}
            </span>
          </div>
        </div>

        {/* Lista de Transações */}
        <div className="transaction-list">
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma transação encontrada.</p>
              <p>Clique em "Nova Transação" para adicionar a primeira!</p>
            </div>
          ) : (
            filteredTransactions.map(transaction => (
              <div 
                key={transaction.id} 
                className={`transaction-item ${transaction.type}`}
              >
                <div className="transaction-main">
                  <div className="transaction-info">
                    <div className="transaction-header-row">
                      <span className={`transaction-type-badge ${transaction.type}`}>
                        {TransactionTypeLabels[transaction.type]}
                      </span>
                      <span className="transaction-category">
                        {TransactionCategoryLabels[transaction.category]}
                      </span>
                    </div>
                    <p className="transaction-description">{transaction.description}</p>
                    <span className="transaction-date">{formatDate(transaction.created_at)}</span>
                  </div>
                  
                  <div className="transaction-amount-section">
                    <div className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}
                      {formatCurrency(
                        transaction.amount_gold,
                        transaction.amount_silver,
                        transaction.amount_bronze
                      )}
                    </div>
                    
                    {onDeleteTransaction && (
                      <button
                        className="transaction-delete-btn"
                        onClick={() => handleDelete(transaction.id)}
                        title="Excluir transação"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={handleModalClose}
        title="Nova Transação"
        size="medium"
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default TransactionHistory;

