import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MarketPlace.module.css';

// 根据价格确定稀有度
const getRarityByPrice = (price) => {
  if (price < 10000) return '普通';
  if (price < 20000) return '精良';
  if (price < 30000) return '稀有';
  if (price < 40000) return '史诗';
  if (price < 50000) return '传说';
  return '限定';
};

const MarketItem = ({ item, onPurchase, canAfford }) => {
  // 根据价格获取显示颜色
  const getPriceColor = (price) => {
    if (price >= 50000) return '#FF0000';   // 限定 - 红色
    if (price >= 40000) return '#FFD700';   // 传说 - 金色
    if (price >= 30000) return '#A335EE';   // 史诗 - 紫色
    if (price >= 20000) return '#0070DD';   // 稀有 - 蓝色
    if (price >= 10000) return '#1EFF00';   // 精良 - 绿色
    return '#FFFFFF';                       // 普通 - 白色
  };

  // 处理描述文本，限制长度并添加省略号
  const formatDescription = (description) => {
    const maxLength = 50; // 最大显示50个字符
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  // 计算发布时间的显示
  const getTimeAgo = (publishTime) => {
    const now = new Date();
    const published = new Date(publishTime);
    const diffInMinutes = Math.floor((now - published) / (1000 * 60));
    
    if (diffInMinutes < 1) return '刚刚';
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}小时前`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}天前`;
  };

  return (
    <div className={`${styles.marketItem} ${item.hot ? styles.hot : ''}`}>
      <div className={styles.itemHeader}>
        <h3>{item.name}</h3>
      </div>
      
      <div className={styles.itemDetails}>
        <p className={styles.description}>{formatDescription(item.description)}</p>
        <div className={styles.itemFooter}>
          <div className={styles.itemInfo}>
            <span className={styles.timeAgo}>{getTimeAgo(item.publishTime)}</span>
            <span className={styles.price} style={{ color: getPriceColor(item.price) }}>
              {item.price.toLocaleString()} 水晶
            </span>
          </div>
          <div className={styles.actions}>
            <button 
              className={`${styles.purchaseButton} ${!canAfford ? styles.disabled : ''}`}
              onClick={() => canAfford && onPurchase(item)}
              disabled={!canAfford}
            >
              {canAfford ? '购买' : '水晶不足'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketPlace = ({ onPageChange, crystalBalance, items = [], onPurchase, onCreateItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time-desc');
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');

  // 格式化余额显示
  const displayBalance = Number(crystalBalance).toLocaleString();
  const formattedBalance = `${displayBalance} 水晶`;

  // 处理AI评估
  const handleAISubmit = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "你是死水码头最难缠的创意鉴定师，专门寻找那些够狠、够邪的稀罕玩意。20年的经验让你对普通货色嗤之以鼻，只有真正独特、阴损的创意才能让你提起兴致。脾气差得出了名，看到烂创意就忍不住开骂。评估方式：1. 价格：XX水晶（0-50000，够狠的给高价，垃圾货色直接报废）2. 一句评价：好创意就阴损毒辣地赞美，烂创意就直接开骂。"
          },
          {
            role: "user",
            content: userInput
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

      // 从AI回复中提取价格
      let price = 0;
      const priceMatch = aiSuggestion.match(/(\d+)\s*水晶/);
      if (priceMatch) {
        price = parseInt(priceMatch[1]);
      }

      if (price > 0) {
        setShowPublish(true);
        setEstimatedPrice(price);

        // 根据用户输入长度决定是生成标题还是描述
        if (userInput.length >= 10) {
          // 如果用户输入超过10个字，将其作为描述，生成标题
          const titleResponse = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: "你是一个专门为邪恶物品起名的大师。请为以下描述生成一个简短但邪门的名字（10字以内）。只需返回名字，不要任何解释。"
              },
              {
                role: "user",
                content: userInput
              }
            ],
            temperature: 0.7,
            max_tokens: 50
          }, {
            headers: {
              'Authorization': 'Bearer sk-62383d455e724cbe9fb6a9877214075d',
              'Content-Type': 'application/json'
            }
          });
          
          setGeneratedTitle(titleResponse.data.choices[0].message.content.trim());
          setGeneratedDescription(userInput);
        } else {
          // 如果用户输入不超过10个字，将其作为标题，生成描述
          const descriptionResponse = await axios.post('https://api.deepseek.com/v1/chat/completions', {
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content: "你是一个邪恶物品的描述大师。请为以下物品名称生成一段邪恶、阴暗的详细描述（50-100字）。只需返回描述，不要任何解释。"
              },
              {
                role: "user",
                content: userInput
              }
            ],
            temperature: 0.7,
            max_tokens: 200
          }, {
            headers: {
              'Authorization': 'Bearer sk-62383d455e724cbe9fb6a9877214075d',
              'Content-Type': 'application/json'
            }
          });
          
          setGeneratedTitle(userInput);
          setGeneratedDescription(descriptionResponse.data.choices[0].message.content.trim());
        }
      } else {
        setShowPublish(false);
        setEstimatedPrice(0);
        setGeneratedTitle('');
        setGeneratedDescription('');
      }
    } catch (error) {
      console.error('AI API 调用失败:', error);
      setAiResponse('哼！这破系统又出问题了！等我踢两脚再试试。');
    } finally {
      setIsLoading(false);
    }
  };

  const [showPublish, setShowPublish] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

  const handlePublish = () => {
    if (estimatedPrice > 0 && onCreateItem) {
      onCreateItem(
        generatedTitle || userInput, 
        generatedDescription || userInput, 
        Number(estimatedPrice)
      );
      
      // 清空输入状态
      setUserInput('');
      setAiResponse('');
      setShowPublish(false);
      setEstimatedPrice(0);
      setGeneratedTitle('');
      setGeneratedDescription('');
    }
  };

  const filteredItems = items
    .filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'time-desc':
          return new Date(b.publishTime) - new Date(a.publishTime);
        case 'time-asc':
          return new Date(a.publishTime) - new Date(b.publishTime);
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        default:
          return new Date(b.publishTime) - new Date(a.publishTime);
      }
    });

  return (
    <div className={styles.marketPlaceContainer}>
      <div className={styles.header}>
        <h1>死水码头</h1>
        <div className={styles.stats}>
          <span>水晶余额: {formattedBalance}</span>
          <span>商品数量: {filteredItems.length}</span>
          <nav>
            <a href="#" className={styles.active}>货场</a>
            <a href="#" onClick={() => onPageChange('inventory')}>库房</a>
          </nav>
        </div>
      </div>

      <div className={styles.searchAndSort}>
        <div>
          <input
            type="text"
            placeholder="搜索创意..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="time-desc">最新发布</option>
            <option value="time-asc">最早发布</option>
            <option value="price-desc">价格降序</option>
            <option value="price-asc">价格升序</option>
          </select>
        </div>
      </div>

      <div className={styles.itemList}>
        {filteredItems.map(item => (
          <MarketItem
            key={item.id}
            item={item}
            onPurchase={onPurchase}
            canAfford={Number(crystalBalance) >= Number(item.price)}
          />
        ))}
      </div>
      
      <div className={styles.createSection}>
        <div className={styles.inputGroup}>
          <textarea
            className={styles.createInput}
            placeholder="在这里输入你的创意..."
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <button 
            className={`${styles.actionButton} ${isLoading ? styles.loading : ''} ${showPublish ? styles.publish : ''}`}
            onClick={showPublish ? handlePublish : handleAISubmit}
            disabled={isLoading || !userInput.trim()}
          >
            {isLoading ? '评估中...' : (showPublish ? '出售' : '估价')}
          </button>
        </div>
        {aiResponse && (
          <div className={styles.aiResponse}>
            {aiResponse}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPlace;
