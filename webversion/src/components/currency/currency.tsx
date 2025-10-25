import { useState } from 'react';
import type { Transaction, CreateTransactionData } from '../../types/transaction';
import { TransactionCategoryLabels, formatCurrency } from '../../types/transaction';
import './currency.css';

interface CurrencyProps {
  transactions?: Transaction[];
  onAddTransaction?: (data: CreateTransactionData) => Promise<void>;
  onDeleteTransaction?: (transactionId: string) => Promise<void>;
  characterId?: string;
}

const Currency = ({ 
  transactions = [],
  onAddTransaction,
  onDeleteTransaction,
  characterId
}: CurrencyProps) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showTransaction, setShowTransaction] = useState(false);
  
  // Estado do formulário de transação
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [transactionCategory, setTransactionCategory] = useState<string>('other');
  const [transactionGold, setTransactionGold] = useState(0);
  const [transactionSilver, setTransactionSilver] = useState(0);
  const [transactionBronze, setTransactionBronze] = useState(0);
  const [transactionDescription, setTransactionDescription] = useState('');

  // Calcular totais da carteira baseado nas transações
  const calculateWalletTotals = () => {
    let walletGold = 0;
    let walletSilver = 0;
    let walletBronze = 0;

    transactions.forEach(t => {
      const multiplier = t.type === 'income' ? 1 : -1;
      walletGold += t.amount_gold * multiplier;
      walletSilver += t.amount_silver * multiplier;
      walletBronze += t.amount_bronze * multiplier;
    });

    return { walletGold, walletSilver, walletBronze };
  };

  const { walletGold, walletSilver, walletBronze } = calculateWalletTotals();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSubmitTransaction = async () => {
    if (!characterId || !onAddTransaction) return;
    
    // Validar
    if (transactionGold === 0 && transactionSilver === 0 && transactionBronze === 0) {
      alert('Por favor, informe pelo menos um valor de moeda.');
      return;
    }
    
    if (!transactionDescription.trim()) {
      alert('Por favor, informe uma descrição.');
      return;
    }

    console.log('💰 Registrando transação...');
    
    try {
      await onAddTransaction({
        character_id: characterId,
        type: transactionType,
        category: transactionCategory as any,
        amount_gold: transactionGold,
        amount_silver: transactionSilver,
        amount_bronze: transactionBronze,
        description: transactionDescription,
      });
      
      console.log('✅ Transação registrada com sucesso!');
      
      // Limpar formulário
      setTransactionGold(0);
      setTransactionSilver(0);
      setTransactionBronze(0);
      setTransactionDescription('');
      setShowTransaction(false);
    } catch (err) {
      console.error('❌ Erro ao registrar transação:', err);
      alert('Erro ao registrar transação. Verifique o console.');
    }
  };

  const handleDeleteTransactionClick = async (transactionId: string) => {
    if (!onDeleteTransaction) return;
    
    if (!confirm('Tem certeza que deseja excluir esta transação? As moedas serão revertidas.')) {
      return;
    }

    console.log('🗑️ Excluindo transação:', transactionId);
    
    try {
      await onDeleteTransaction(transactionId);
      console.log('✅ Transação excluída!');
    } catch (err) {
      console.error('❌ Erro ao excluir transação:', err);
      alert('Erro ao excluir transação. Verifique o console.');
    }
  };

  const getCategoriesForType = () => {
    if (transactionType === 'income') {
      return [
        { value: 'loot', label: 'Saque/Pilhagem' },
        { value: 'reward', label: 'Recompensa' },
        { value: 'sale', label: 'Venda' },
        { value: 'other', label: 'Outro' },
      ];
    } else {
      return [
        { value: 'purchase', label: 'Compra' },
        { value: 'service', label: 'Serviço' },
        { value: 'other', label: 'Outro' },
      ];
    }
  };

  return (
    <div className="currency-widget">
      <div className="currency-container">
        <div className="currency-header">
          <h3 className="currency-title">Carteira</h3>
          <div className="currency-actions">
            <button 
              className="action-button primary"
              onClick={() => setShowTransaction(!showTransaction)}
              title="Adicionar Transação"
            >
              ➕ Registrar
            </button>
            <button 
              className="action-button"
              onClick={() => setShowHistory(!showHistory)}
              title="Ver Histórico"
            >
              {showHistory ? '✕' : '📋'}
            </button>
          </div>
        </div>

        <div className="currency-balance">
          <div className="balance-item">
            <span className="balance-icon">🥇</span>
            <div className="balance-info">
              <span className="balance-label">Ouro</span>
              <span className="balance-value">{walletGold}</span>
            </div>
          </div>

          <div className="balance-item">
            <span className="balance-icon">🥈</span>
            <div className="balance-info">
              <span className="balance-label">Prata</span>
              <span className="balance-value">{walletSilver}</span>
            </div>
          </div>

          <div className="balance-item">
            <span className="balance-icon">🥉</span>
            <div className="balance-info">
              <span className="balance-label">Bronze</span>
              <span className="balance-value">{walletBronze}</span>
            </div>
          </div>
        </div>

        {showTransaction && (
          <div className="transaction-form">
            <div className="section-header">
              <h4>📝 Nova Transação</h4>
            </div>
            <div className="form-content">
              <div className="form-group">
                <label>Tipo de Transação</label>
                <div className="transaction-type-buttons">
                  <button 
                    type="button"
                    className={`type-btn income ${transactionType === 'income' ? 'active' : ''}`}
                    onClick={() => {
                      setTransactionType('income');
                      setTransactionCategory('other');
                    }}
                  >
                    💰 Receita
                  </button>
                  <button 
                    type="button"
                    className={`type-btn expense ${transactionType === 'expense' ? 'active' : ''}`}
                    onClick={() => {
                      setTransactionType('expense');
                      setTransactionCategory('other');
                    }}
                  >
                    💸 Despesa
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Categoria</label>
                <select 
                  className="form-input"
                  value={transactionCategory}
                  onChange={(e) => setTransactionCategory(e.target.value)}
                >
                  {getCategoriesForType().map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Moedas</label>
                <div className="currency-inputs">
                  <div className="currency-input-item">
                    <span className="currency-input-icon">🥇</span>
                    <div className="currency-input-wrapper">
                      <label className="currency-input-label">Ouro</label>
                      <input 
                        type="number" 
                        className="form-input currency-amount" 
                        placeholder="0"
                        min="0"
                        value={transactionGold}
                        onChange={(e) => setTransactionGold(Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="currency-input-item">
                    <span className="currency-input-icon">🥈</span>
                    <div className="currency-input-wrapper">
                      <label className="currency-input-label">Prata</label>
                      <input 
                        type="number" 
                        className="form-input currency-amount" 
                        placeholder="0"
                        min="0"
                        value={transactionSilver}
                        onChange={(e) => setTransactionSilver(Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="currency-input-item">
                    <span className="currency-input-icon">🥉</span>
                    <div className="currency-input-wrapper">
                      <label className="currency-input-label">Bronze</label>
                      <input 
                        type="number" 
                        className="form-input currency-amount" 
                        placeholder="0"
                        min="0"
                        value={transactionBronze}
                        onChange={(e) => setTransactionBronze(Number(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label>Descrição *</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ex: Recompensa de quest"
                  value={transactionDescription}
                  onChange={(e) => setTransactionDescription(e.target.value)}
                />
              </div>

              <button 
                type="button"
                className="submit-transaction-btn"
                onClick={handleSubmitTransaction}
              >
                ✓ Registrar Transação
              </button>
            </div>
          </div>
        )}

        {showHistory && (
          <div className="transaction-history">
            <div className="section-header">
              <h4>📋 Transações Recentes</h4>
            </div>
            <div className="history-list">
              {transactions.length > 0 ? (
                transactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className={`transaction-item ${transaction.type}`}
                  >
                    <div className="transaction-content">
                      <div className="transaction-info">
                        <div className="transaction-header-row">
                          <span className={`transaction-type-badge ${transaction.type}`}>
                            {transaction.type === 'income' ? '💰 Receita' : '💸 Despesa'}
                          </span>
                          <span className="transaction-category">
                            {TransactionCategoryLabels[transaction.category]}
                          </span>
                        </div>
                        <span className="transaction-description">
                          {transaction.description}
                        </span>
                        <span className="transaction-date">
                          {formatDate(transaction.created_at)}
                        </span>
                      </div>
                      <div className="transaction-amount-wrapper">
                        <span className={`transaction-amount ${transaction.type}`}>
                          {transaction.type === 'income' ? '+' : '-'}
                          {formatCurrency(
                            transaction.amount_gold,
                            transaction.amount_silver,
                            transaction.amount_bronze
                          )}
                        </span>
                        {onDeleteTransaction && (
                          <button
                            className="transaction-delete-mini-btn"
                            onClick={() => handleDeleteTransactionClick(transaction.id)}
                            title="Excluir transação"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-history">
                  <span>Nenhuma transação registrada</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Currency;

