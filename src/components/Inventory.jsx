import React, { useState } from 'react';
import styles from './Inventory.module.css';
import axios from 'axios';

const InventoryItem = ({ item, onResell, onDestroy, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(item.description);
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  // 根据价格获取显示颜色
  const getPriceColor = (price) => {
    if (price >= 50000) return '#FF0000'; // 红色
    if (price >= 45000) return '#FFD700'; // 金色
    if (price >= 35000) return '#A335EE'; // 紫色
    if (price >= 25000) return '#0070DD'; // 蓝色
    if (price >= 15000) return '#1EFF00'; // 绿色
    return '#FFFFFF'; // 白色
  };

  // 处理描述文本，限制长度并添加省略号
  const formatDescription = (description) => {
    const maxLength = 50; // 最大显示50个字符
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  const handleAction = (action, e) => {
    e.stopPropagation();
    switch(action) {
      case 'edit':
        setIsEditing(true);
        setIsExpanded(true);
        break;
      case 'resell':
        if (window.confirm(`确定要以 ${item.price.toLocaleString()} 水晶的价格出售该创意吗？`)) {
          onResell(item);
        }
        break;
      case 'destroy':
        if (window.confirm('确定要销毁该创意吗？此操作不可逆！')) {
          onDestroy(item.id);  // 确保传递的是 item.id
        }
        break;
    }
  };

  const handleAISubmit = async () => {
    if (!editedDescription.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是死水码头最难缠的创意鉴定师，专门寻找那些够狠、够邪的稀罕玩意。20年的经验让你对普通货色嗤之以鼻，只有真正独特、阴损的创意才能让你提起兴致。脾气差得出了名，看到烂创意就忍不住开骂。

评估方式：
1. 价格：XX-XX水晶（0-50000，够狠的给高价，垃圾货色直接报废）
2. 一句评价：
   - 好创意：阴损毒辣的赞美
   - 烂创意：直接开骂（"什么垃圾东西！"、"滚出我的鉴定室！"）`
          },
          {
            role: "user",
            content: `测试创意：${editedDescription}`
          }
        ],
        temperature: 0.9,
        max_tokens: 1000
      }, {
        headers: {
          'Authorization': 'Bearer sk-62383d455e724cbe9fb6a9877214075d',
          'Content-Type': 'application/json'
        }
      });

      const aiSuggestion = response.data.choices[0].message.content;
      setAiResponse(aiSuggestion);
    } catch (error) {
      console.error('AI API 调用失败:', error);
      setAiResponse('哼！这破系统又出问题了！等我踢两脚再试试。');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = () => {
    // 解析AI回复中的价格
    const priceMatch = aiResponse.match(/(\d+)[^\d]+水晶/);
    const newPrice = priceMatch ? parseInt(priceMatch[1]) : item.price;
    
    onEdit(item.id, editedDescription, newPrice);
    setIsEditing(false);
    setAiResponse('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedDescription(item.description);
    setAiResponse('');
  };

  return (
    <div 
      className={`${styles.inventoryItem} ${isExpanded ? styles.expanded : ''}`}
      onClick={() => !isEditing && setIsExpanded(!isExpanded)}
    >
      <div className={styles.itemHeader}>
        <h3>{item.name}</h3>
      </div>
      
      <div className={styles.itemDetails}>
        {isEditing ? (
          <div className={styles.editSection}>
            <textarea
              className={styles.editInput}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              placeholder="修改创意描述..."
            />
            <div className={styles.editActions}>
              <button
                className={`${styles.actionButton} ${isLoading ? styles.loading : ''}`}
                onClick={handleAISubmit}
                disabled={isLoading}
              >
                {isLoading ? '估价中...' : '估价'}
              </button>
              {aiResponse && (
                <button
                  className={styles.actionButton}
                  onClick={handlePublish}
                >
                  发售
                </button>
              )}
              <button
                className={`${styles.actionButton} ${styles.cancelButton}`}
                onClick={handleCancel}
              >
                取消
              </button>
            </div>
            {aiResponse && (
              <div className={styles.aiResponse}>
                <p>{aiResponse}</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <p className={styles.description}>{formatDescription(item.description)}</p>
            <div className={styles.itemFooter}>
              <div className={styles.itemInfo}>
                <span className={styles.price} style={{ color: getPriceColor(item.price) }}>
                  {item.price.toLocaleString()} 水晶
                </span>
              </div>
              <div className={styles.actions}>
                <button 
                  className={styles.editButton}
                  onClick={(e) => handleAction('edit', e)}
                >
                  修改
                </button>
                <button 
                  className={styles.resellButton}
                  onClick={(e) => handleAction('resell', e)}
                >
                  出售
                </button>
                <button 
                  className={styles.destroyButton}
                  onClick={(e) => handleAction('destroy', e)}
                >
                  销毁
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const Inventory = ({ onPageChange, crystalBalance, items = Array(25).fill(null), onResell, onDestroy, onEdit }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date');

  const filteredItems = items
    .filter(item => {
      if (filter === 'usable' && !item.usable) return false;
      return item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
             item.description.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.purchaseDate) - new Date(a.purchaseDate);
      }
      if (sortBy === 'price') {
        return b.price - a.price;
      }
      return 0;
    });

  return (
    <div className={styles.inventory}>
      <div className={styles.header}>
        <div className={styles.stats}>
          <span>{crystalBalance.toLocaleString()} 水晶</span>
          <span>库存: {items.filter(item => item !== null).length}/25</span>
          <nav>
            <a href="#" onClick={() => onPageChange('market')}>货场</a>
            <a href="#" className={styles.active}>库房</a>
          </nav>
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="text"
          placeholder="搜索库存..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        
        <div className={styles.filters}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">全部物品</option>
            <option value="usable">可使用</option>
          </select>

          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="date">按购买时间</option>
            <option value="price">按价格</option>
          </select>
        </div>
      </div>

      <div className={styles.inventoryGrid}>
        {items.map((item, index) => (
          <div key={index} className={styles.inventorySlot}>
            {item ? (
              <InventoryItem
                item={item}
                onResell={() => onResell(item)}
                onEdit={() => onEdit(item)}
                onDestroy={() => onDestroy(item)}
              />
            ) : (
              <div className={styles.emptySlot}>
                <span>空槽位</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
