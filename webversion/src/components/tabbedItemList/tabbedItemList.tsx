import { useState, useEffect } from 'react';
import './tabbedItemList.css';

// Generic types for the component
export interface TabConfig<T extends string> {
  key: T;
  label: string;
  icon: string;
}

export interface ItemField {
  label: string;
  value: string | undefined;
  className?: string;
}

export interface BaseItem {
  id: string;
  name: string;
  type: string;
  description: string;
  [key: string]: any; // Allow additional properties
}

export interface TabData<T extends string, I extends BaseItem> {
  tabs: TabConfig<T>[];
  items: Record<T, I[]>;
  getItemFields: (item: I) => ItemField[];
  getItemBadge?: (item: I) => { value: string; className?: string } | null;
  getActionButtons?: (item: I, tabKey: T) => {
    label: string;
    onClick: () => void;
    className?: string;
    show?: boolean;
  }[];
  noSelectionIcon?: React.ReactNode;
  getNoSelectionMessage?: (tabKey: T) => string;
  onAddItem?: (tabKey: T) => void;
  onUpdateDescription?: (itemId: string, tabKey: T, newDescription: string) => void;
  showMenu?: boolean; // Control whether to show the "..." menu
}

interface TabbedItemListProps<T extends string, I extends BaseItem> {
  title: string;
  titleIcon?: React.ReactNode;
  tabData: TabData<T, I>;
  defaultTab?: T;
  containerClassName?: string;
  colorScheme?: 'purple' | 'orange'; // For different color themes
}

function TabbedItemList<T extends string, I extends BaseItem>({
  title,
  titleIcon,
  tabData,
  defaultTab,
  containerClassName = '',
  colorScheme = 'purple'
}: TabbedItemListProps<T, I>) {
  const [activeTab, setActiveTab] = useState<T>(defaultTab || tabData.tabs[0].key);
  const [selectedItem, setSelectedItem] = useState<I | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openMenuId]);

  const getCurrentItems = () => tabData.items[activeTab] || [];
  
  const getTabTitle = () => {
    const currentTab = tabData.tabs.find(tab => tab.key === activeTab);
    return currentTab?.label || '';
  };

  // Force re-render when items change
  const currentItems = getCurrentItems();

  const handleTabChange = (newTab: T) => {
    setActiveTab(newTab);
    setSelectedItem(null);
    setOpenMenuId(null);
  };

  const toggleMenu = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === itemId ? null : itemId);
  };

  const defaultNoSelectionIcon = (
    <svg 
      width="64" 
      height="64" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
    </svg>
  );

  return (
    <div className={`tabbed-item-list ${containerClassName} theme-${colorScheme}`}>
      <div className="til-header">
        {titleIcon && <div className="til-title-icon">{titleIcon}</div>}
        <h2 className="til-title">{title}</h2>
        
        {/* Tabs Navigation */}
        <div className="til-tabs-container">
          {tabData.tabs.map(tab => (
            <button
              key={tab.key}
              className={`til-tab-button ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.key)}
            >
              <span className="til-tab-icon">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="til-layout">
        {/* Items List */}
        <div className="til-list">
          <div className="til-list-header">
            <h3>{getTabTitle()}</h3>
          </div>
          {currentItems.map(item => {
            const badge = tabData.getItemBadge?.(item);
            const actionButtons = tabData.getActionButtons?.(item, activeTab) || [];
            const hasActions = actionButtons.length > 0;
            const showMenu = tabData.showMenu !== false; // Default to true if not specified
            
            return (
              <div 
                key={item.id} 
                className={`til-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="til-item-header">
                  <div className="til-item-name-type">
                    <span className="til-item-name">{item.name}</span>
                    <span className="til-item-type">{item.type}</span>
                  </div>
                  <div className="til-item-actions">
                    {badge && (
                      <span className={`til-item-badge ${badge.className || ''}`}>
                        {badge.value}
                      </span>
                    )}
                    {hasActions && showMenu && (
                      <div className="item-menu-container">
                        <button 
                          className="item-menu-btn"
                          onClick={(e) => toggleMenu(item.id, e)}
                        >
                          ⋮
                        </button>
                        {openMenuId === item.id && (
                          <div className="item-menu-dropdown">
                            {actionButtons
                              .filter(button => button.show !== false)
                              .map((button, index) => (
                                <button 
                                  key={index}
                                  className={`menu-option ${button.className || ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    button.onClick();
                                    setOpenMenuId(null);
                                  }}
                                >
                                  {button.label}
                                </button>
                              ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Add Item Button */}
          {tabData.onAddItem && (
            <div 
              className="til-item til-add-item"
              onClick={() => tabData.onAddItem?.(activeTab)}
            >
              <div className="til-item-header">
                <div className="til-item-name-type">
                  <span className="til-add-item-icon">+</span>
                  <span className="til-item-name til-add-item-text">
                    Adicionar {getTabTitle()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="til-details">
          {selectedItem ? (
            <>
              <div className="til-details-header">
                <h2>{selectedItem.name}</h2>
                <span className="til-details-type">{selectedItem.type}</span>
              </div>
              
              {/* Dynamic stats based on item fields */}
              {tabData.getItemFields(selectedItem).length > 0 && (
                <div className="til-details-stats">
                  {tabData.getItemFields(selectedItem).map((field, index) => (
                    field.value && (
                      <div key={index} className={`til-stat-row ${field.className || ''}`}>
                        <strong>{field.label}:</strong>
                        <span>{field.value}</span>
                      </div>
                    )
                  ))}
                </div>
              )}

              <div className="til-details-description">
                <h3>Descrição</h3>
                {tabData.onUpdateDescription ? (
                  <textarea
                    value={selectedItem.description}
                    onChange={(e) => tabData.onUpdateDescription?.(selectedItem.id, activeTab, e.target.value)}
                    className="til-description-textarea"
                    placeholder="Descrição..."
                    rows={4}
                  />
                ) : (
                  <p>{selectedItem.description}</p>
                )}
              </div>

              {/* Action buttons */}
              {tabData.getActionButtons && (
                <div className="til-details-actions">
                  {tabData.getActionButtons(selectedItem, activeTab)
                    .filter(button => button.show !== false)
                    .map((button, index) => (
                      <button 
                        key={index}
                        className={`til-action-btn ${button.className || ''}`}
                        onClick={button.onClick}
                      >
                        {button.label}
                      </button>
                    ))}
                </div>
              )}
            </>
          ) : (
            <div className="til-no-selection">
              {tabData.noSelectionIcon || defaultNoSelectionIcon}
              <p>
                {tabData.getNoSelectionMessage 
                  ? tabData.getNoSelectionMessage(activeTab)
                  : `Selecione um item para ver os detalhes`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TabbedItemList;

