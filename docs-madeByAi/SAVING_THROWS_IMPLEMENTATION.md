# Implementação dos Testes de Resistência

## Visão Geral

Este documento descreve a implementação dos testes de resistência (Vontade, Reflexos e Fortitude) no sistema de perícias do TTRPG App.

## Testes de Resistência Adicionados

### 1. Vontade
- **Atributo Base**: Sabedoria
- **Uso**: Resistir a efeitos mentais, ilusões, possessões e magias que afetam a mente
- **Exemplos**: Resistir a encantamentos, ilusões, medo, confusão

### 2. Reflexos
- **Atributo Base**: Destreza
- **Uso**: Resistir a efeitos que requerem agilidade e velocidade de reação
- **Exemplos**: Esquivar de explosões, resistir a efeitos de área, escapar de armadilhas

### 3. Fortitude
- **Atributo Base**: Constituição
- **Uso**: Resistir a efeitos físicos, venenos, doenças e fadiga
- **Exemplos**: Resistir a venenos, doenças, efeitos de fadiga, dano ambiental

## Implementação Técnica

### 1. Script SQL
O arquivo `add_saving_throws_skills.sql` contém o script para adicionar os testes de resistência a todos os personagens existentes.

### 2. Interface Visual
- Os testes de resistência são destacados com um estilo visual especial
- Badge "Teste de Resistência" para identificação
- Cores azuis para diferenciação das outras perícias

### 3. Funcionalidades
- Cálculo automático baseado no atributo correspondente
- Possibilidade de treinamento (bônus de treinamento)
- Suporte a modificadores temporários
- Edição completa como outras perícias

## Como Usar

### Para Jogadores
1. Acesse a página "Perícias" do seu personagem
2. Os testes de resistência aparecerão destacados em azul
3. Você pode editar cada teste clicando em "Editar"
4. Configure se o teste está treinado e ajuste os bônus

### Para Mestres
1. Os testes de resistência são criados automaticamente para novos personagens
2. Use o script SQL para adicionar aos personagens existentes
3. Os testes seguem as mesmas regras das outras perícias
4. **Novos personagens**: Os testes são criados automaticamente durante a criação

## Cálculo dos Testes

```
Total = Atributo + Metade do Nível + Bônus de Treinamento + Outros
```

- **Atributo**: Valor do atributo base (Sabedoria, Destreza ou Constituição)
- **Metade do Nível**: Nível do personagem ÷ 2 (arredondado para baixo)
- **Bônus de Treinamento**: +5 se treinado
- **Outros**: Modificadores de equipamentos, magias, etc.

## Exemplo de Uso

### Teste de Vontade
- **Situação**: Um mago lança "Confusão" no personagem
- **Teste**: 1d20 + Vontade vs CD do mago
- **Resultado**: Se passar, o personagem não fica confuso

### Teste de Reflexos
- **Situação**: Uma armadilha dispara dardos envenenados
- **Teste**: 1d20 + Reflexos vs CD da armadilha
- **Resultado**: Se passar, o personagem se esquiva dos dardos

### Teste de Fortitude
- **Situação**: O personagem bebe uma poção envenenada
- **Teste**: 1d20 + Fortitude vs CD do veneno
- **Resultado**: Se passar, o personagem resiste aos efeitos do veneno

## Arquivos Modificados

1. `add_saving_throws_skills.sql` - Script para adicionar os testes
2. `webversion/src/pages/proficiencies/proficiencies.tsx` - Lógica da interface
3. `webversion/src/pages/proficiencies/proficiencies.css` - Estilos visuais

## Próximos Passos

1. Execute o script SQL no banco de dados
2. Teste a interface com personagens existentes
3. Verifique se os cálculos estão corretos
4. Documente qualquer problema encontrado

## Notas Importantes

- Os testes de resistência são perícias especiais que não podem ser usadas sem treinamento
- Eles são essenciais para a mecânica de combate e roleplay
- A implementação segue as regras padrão do Tormenta20
- Todos os personagens recebem os três testes automaticamente
