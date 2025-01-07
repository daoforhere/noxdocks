import React, { useState } from 'react'
import MarketPlace from './components/MarketPlace'
import Inventory from './components/Inventory'
import './App.css'

// 初始商品列表
const initialItems = [
  {
    id: 1,
    name: "混沌之眼",
    description: "从深渊中获取的神秘器官，能看穿他人的灵魂，但每次使用都会消耗使用者的一部分理智...",
    rarity: "传说",
    price: 49800,
    hot: true,
    publishTime: "2025-01-06T05:00:00+08:00"
  },
  {
    id: 2,
    name: "影子收割者",
    description: "一把能够切割并收集他人影子的诡异长镰，被收割的影子将永远成为持有者的奴仆...",
    rarity: "稀有",
    price: 35000,
    hot: true,
    publishTime: "2025-01-06T05:30:00+08:00"
  },
  {
    id: 3,
    name: "记忆窃取指环",
    description: "戴上它能够窃取他人的记忆，但同时也会丢失自己的一段记忆作为代价...",
    rarity: "史诗",
    price: 42000,
    hot: true,
    publishTime: "2025-01-06T06:00:00+08:00"
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('market')
  const [crystalBalance, setCrystalBalance] = useState(50000)
  const [marketItems, setMarketItems] = useState(initialItems)
  const [inventoryItems, setInventoryItems] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePurchase = (item) => {
    if (crystalBalance >= item.price) {
      setCrystalBalance(prev => prev - item.price)
      setMarketItems(prev => prev.filter(i => i.id !== item.id))
      setInventoryItems(prev => [...prev, {
        ...item,
        purchaseDate: new Date().toISOString().split('T')[0],
        usable: true
      }])
    }
  }

  const handleResell = (item) => {
    // 原价出售，移回货场
    setCrystalBalance(prev => prev + item.price)
    setInventoryItems(prev => prev.filter(i => i.id !== item.id))
    setMarketItems(prev => [...prev, {
      ...item,
      hot: false, // 二手创意不再是热门
      publishTime: new Date().toISOString() // 添加新的发布时间
    }])
  }

  const handleDestroy = (itemId) => {
    setInventoryItems(prev => prev.filter(item => item.id !== itemId))
  }

  const handleEdit = (itemId, newDescription, newPrice) => {
    // 找到要编辑的物品
    const itemToEdit = inventoryItems.find(item => item.id === itemId);
    if (!itemToEdit) return;

    // 从库存中移除
    setInventoryItems(prev => prev.filter(item => item.id !== itemId));

    // 添加到货场
    setMarketItems(prev => [...prev, {
      ...itemToEdit,
      description: newDescription,
      price: newPrice,
      hot: false, // 编辑后的创意不再是热门
      publishTime: new Date().toISOString() // 添加新的发布时间
    }]);

    // 返还原价到余额
    setCrystalBalance(prev => prev + itemToEdit.price);
  };

  const handleCreateItem = (title, description, price) => {
    // 生成新的ID（在实际应用中应该由后端生成）
    const newId = Math.max(...marketItems.map(item => item.id), 0) + 1;
    
    // 创建新物品
    const newItem = {
      id: newId,
      name: title,  // 使用AI生成的标题
      description,  // 使用AI生成的描述
      price,
      rarity: getRarityByPrice(price),  // 根据价格确定稀有度
      hot: true,  // 新创意默认为热门
      publishTime: new Date().toISOString()
    };

    // 添加到货场
    setMarketItems(prev => [...prev, newItem]);
    
    // 发布创意时，用户获得相应的水晶奖励
    setCrystalBalance(prev => prev + price);
  };

  // 根据价格确定稀有度
  const getRarityByPrice = (price) => {
    if (price >= 45000) return '传说';
    if (price >= 35000) return '史诗';
    if (price >= 25000) return '稀有';
    return '普通';
  };

  return (
    <div className="app">
      {currentPage === 'market' ? (
        <MarketPlace 
          onPageChange={handlePageChange} 
          crystalBalance={crystalBalance}
          items={marketItems}
          onPurchase={handlePurchase}
          onCreateItem={handleCreateItem}
        />
      ) : (
        <Inventory 
          onPageChange={handlePageChange}
          crystalBalance={crystalBalance}
          items={inventoryItems}
          onResell={handleResell}
          onDestroy={handleDestroy}
          onEdit={handleEdit}
        />
      )}
    </div>
  )
}

export default App
