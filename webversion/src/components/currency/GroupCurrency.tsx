import { useState } from 'react';
import './currency.css';

interface GroupCurrencyProps {
  groupId: string;
  gold: number;
  silver: number;
  bronze: number;
  onUpdateCurrency?: (gold: number, silver: number, bronze: number) => Promise<void>;
}

const GroupCurrency = ({
  gold = 0,
  silver = 0,
  bronze = 0,
  onUpdateCurrency
}: GroupCurrencyProps) => {
  const [showTransaction, setShowTransaction] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  // Estado do formulário de transação
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [transactionCategory, setTransactionCategory] = useState<string>('other');
  const [transactionGold, setTransactionGold] = useState(0);
  const [transactionSilver, setTransactionSilver] = useState(0);
  const [transactionBronze, setTransactionBronze] = useState(0);
  const [transactionDescription, setTransactionDescription] = useState('');

  const handleSubmitTransaction = async () => {
    if (!onUpdateCurrency) return;
    
    // Validar
    if (transactionGold === 0 && transactionSilver === 0 && transactionBronze === 0) {
      alert('Por favor, informe pelo menos um valor de moeda.');
      return;
    }
    
    if (!transactionDescription.trim()) {
      alert('Por favor, informe uma descrição.');
      return;
    }

    console.log('💰 Registrando transação do grupo...');
    
    try {
      const multiplier = transactionType === 'income' ? 1 : -1;
      const newGold = gold + (transactionGold * multiplier);
      const newSilver = silver + (transactionSilver * multiplier);
      const newBronze = bronze + (transactionBronze * multiplier);

      // Verificar se não ficou negativo
      if (newGold < 0 || newSilver < 0 || newBronze < 0) {
        alert('Saldo insuficiente para esta transação.');
        return;
      }

      await onUpdateCurrency(newGold, newSilver, newBronze);
      
      console.log('✅ Transação do grupo registrada com sucesso!');
      
      // Limpar formulário
      setTransactionGold(0);
      setTransactionSilver(0);
      setTransactionBronze(0);
      setTransactionDescription('');
      setShowTransaction(false);
    } catch (err) {
      console.error('❌ Erro ao registrar transação do grupo:', err);
      alert('Erro ao registrar transação. Verifique o console.');
    }
  };

  const getCategoriesForType = () => {
    if (transactionType === 'income') {
      return [
        { value: 'loot', label: 'Saque/Pilhagem' },
        { value: 'reward', label: 'Recompensa' },
        { value: 'sale', label: 'Venda' },
        { value: 'donation', label: 'Doação' },
        { value: 'other', label: 'Outro' },
      ];
    } else {
      return [
        { value: 'purchase', label: 'Compra' },
        { value: 'service', label: 'Serviço' },
        { value: 'equipment', label: 'Equipamento' },
        { value: 'supplies', label: 'Suprimentos' },
        { value: 'other', label: 'Outro' },
      ];
    }
  };

  return (
    <div className="currency-widget">
      <div className="currency-container">
        <div className="currency-header">
          <h3 className="currency-title">Carteira do Grupo</h3>
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
              <span className="balance-value">{gold}</span>
            </div>
          </div>

          <div className="balance-item">
            <span className="balance-icon">🥈</span>
            <div className="balance-info">
              <span className="balance-label">Prata</span>
              <span className="balance-value">{silver}</span>
            </div>
          </div>

          <div className="balance-item">
            <span className="balance-icon">🥉</span>
            <div className="balance-info">
              <span className="balance-label">Bronze</span>
              <span className="balance-value">{bronze}</span>
            </div>
          </div>
        </div>

        {showTransaction && (
          <div className="transaction-form">
            <div className="section-header">
              <h4>📝 Nova Transação do Grupo</h4>
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
                  placeholder="Ex: Recompensa de quest, Compra de equipamentos"
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
              <h4>📋 Histórico do Grupo</h4>
            </div>
            <div className="history-list">
              <div className="empty-history">
                <span>Histórico de transações em desenvolvimento</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupCurrency;
