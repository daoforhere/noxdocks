import React, { useState, useEffect } from 'react'
import MarketPlace from './components/MarketPlace'
import Inventory from './components/Inventory'
import './App.css'

// 初始商品列表
const initialItems = [
  {
    id: 1,
    name: "流光咒环",
    description: "一个能操控月光形成实体的魔法阵设计。传说戴上它的人能将月光编织成丝线，在午夜时分织就一件永不褪色的银袍...",
    rarity: "史诗",
    price: 28743,
    hot: true,
    publishTime: "2025-01-07T14:30:00+08:00"
  },
  {
    id: 2,
    name: "逐梦编织者",
    description: "一种能将他人梦境编入自己记忆的装置构想。但要小心，有时候他人的美梦会变成你的噩梦，而你再也无法分辨哪些记忆才是属于自己的...",
    rarity: "精良",
    price: 19584,
    hot: false,
    publishTime: "2025-01-07T15:00:00+08:00"
  },
  {
    id: 3,
    name: "海光枯林",
    description: "一种能在深海黑暗中发光的枯萎森林。每一片叶子都凝结着远古生物的磷光，在水压的挤压下永远保持着最后一刻的姿态...",
    rarity: "稀有",
    price: 32119,
    hot: true,
    publishTime: "2025-01-07T15:30:00+08:00"
  },
  {
    id: 4,
    name: "巨神遗音",
    description: "传说是巨神灭亡前留下的最后一个音节。任何听到它的生物都会陷入永恒的沉思，感受到世界诞生之初的震撼...",
    rarity: "传说",
    price: 48930,
    hot: true,
    publishTime: "2025-01-07T16:00:00+08:00"
  },
  {
    id: 5,
    name: "云海孤城",
    description: "一座漂浮在云端的城市，其能源来自雷电。城中居民从不下界，他们的皮肤已经变得透明，能看到体内流动的闪电...",
    rarity: "史诗",
    price: 40512,
    hot: true,
    publishTime: "2025-01-07T16:30:00+08:00"
  },
  {
    id: 6,
    name: "灵纹锻炉",
    description: "一个能将灵魂锻造成实体护符的奇幻装置。每个护符都带着原主人最强烈的情感，戴上它的人会不由自主地受到影响...",
    rarity: "稀有",
    price: 36710,
    hot: false,
    publishTime: "2025-01-07T17:00:00+08:00"
  },
  {
    id: 7,
    name: "时间琥珀",
    description: "能将一个瞬间封存为永恒的虚构设计。被封存的不仅是画面，还有那一刻的温度、声音、甚至是空气中的味道...",
    rarity: "精良",
    price: 23764,
    hot: false,
    publishTime: "2025-01-07T17:30:00+08:00"
  },
  {
    id: 8,
    name: "风语壁画",
    description: "一面只能被风吹动时显现的壁画。据说每种风向都会展现不同的画面，而当八风齐至时，壁画中的人物会短暂地活过来...",
    rarity: "普通",
    price: 12983,
    hot: false,
    publishTime: "2025-01-07T18:00:00+08:00"
  },
  {
    id: 9,
    name: "午夜舞影",
    description: "每到午夜出现的神秘舞会，仅限影子参加。人类只能在月光下远远观望，看着无数优雅的黑影在银色的地面上旋转...",
    rarity: "史诗",
    price: 39412,
    hot: true,
    publishTime: "2025-01-07T18:30:00+08:00"
  },
  {
    id: 10,
    name: "星尘之袍",
    description: "由星尘凝聚而成的虚拟时尚设计。穿上它的人周身会闪烁着微弱的星光，在黑暗中仿佛漫步银河之间...",
    rarity: "稀有",
    price: 29812,
    hot: true,
    publishTime: "2025-01-07T19:00:00+08:00"
  },
  {
    id: 11,
    name: "记忆拍卖行",
    description: "一种用记忆交换商品的地下市场。在这里，快乐的记忆往往能换到悲伤的财富，而痛苦的过往可能会带来意想不到的珍宝...",
    rarity: "精良",
    price: 25849,
    hot: true,
    publishTime: "2025-01-07T19:30:00+08:00"
  },
  {
    id: 12,
    name: "罪影街区",
    description: "一座被无尽欲望吞噬的都市区域。这里的建筑会随着居民的欲望扭曲变形，街道总是通向最隐秘的渴望之地...",
    rarity: "精良",
    price: 22467,
    hot: false,
    publishTime: "2025-01-07T20:00:00+08:00"
  },
  {
    id: 13,
    name: "裂空之矛",
    description: "能撕裂天空的虚拟武器。传说它的创造者是天界的叛逆之神，为了反抗天界的束缚而创造了这把神兵...",
    rarity: "传说",
    price: 45639,
    hot: true,
    publishTime: "2025-01-07T20:30:00+08:00"
  },
  {
    id: 14,
    name: "灵体融合",
    description: "试图将多种灵魂融合为一的危险实验。成功的概率极低，但如果成功，融合后的灵魂将拥有前所未有的强大力量...",
    rarity: "史诗",
    price: 38421,
    hot: true,
    publishTime: "2025-01-07T21:00:00+08:00"
  },
  {
    id: 15,
    name: "血影簿",
    description: "记录所有复仇者故事的禁书。翻开它的每一页，都会看到一个悲惨的故事和一个血腥的结局...",
    rarity: "普通",
    price: 15784,
    hot: false,
    publishTime: "2025-01-07T21:30:00+08:00"
  },
  {
    id: 16,
    name: "碎玉王权",
    description: "象征崩塌权力的虚构王座。据说它的碎片散落在世界各地，只有将碎片全部收集起来，才能重建这座王座...",
    rarity: "稀有",
    price: 26935,
    hot: false,
    publishTime: "2025-01-07T22:00:00+08:00"
  },
  {
    id: 17,
    name: "空虚圣典",
    description: "描述虚无主义极致的哲学文本。读完它的人会对世界产生深深的绝望感，但也会获得前所未有的自由...",
    rarity: "精良",
    price: 19473,
    hot: false,
    publishTime: "2025-01-07T22:30:00+08:00"
  },
  {
    id: 18,
    name: "逆光世界",
    description: "一个规则完全与现实相反的平行世界。在这里，时间是倒流的，生命是死亡的，死亡是生命的...",
    rarity: "精良",
    price: 21592,
    hot: true,
    publishTime: "2025-01-07T23:00:00+08:00"
  },
  {
    id: 19,
    name: "共生之环",
    description: "让多种意识共存的虚拟设备。使用它的人会体验到多重人格的生活，但也会面临着失去自我的风险...",
    rarity: "稀有",
    price: 34275,
    hot: true,
    publishTime: "2025-01-07T23:30:00+08:00"
  },
  {
    id: 20,
    name: "无解之谜",
    description: "一个永远无法解开的哲学难题。思考它的人会陷入深深的沉思，但也会获得前所未有的智慧...",
    rarity: "稀有",
    price: 28653,
    hot: false,
    publishTime: "2025-01-08T00:00:00+08:00"
  },
  {
    id: 21,
    name: "终极钥匙",
    description: "揭示世界本质但让人疯狂的物件。使用它的人会获得无限的知识，但也会失去理智...",
    rarity: "传说",
    price: 41732,
    hot: true,
    publishTime: "2025-01-08T00:30:00+08:00"
  },
  {
    id: 22,
    name: "命运之盘",
    description: "决定人类最终命运的轮盘。转动它的人会改变自己的命运，但也会改变世界的命运...",
    rarity: "稀有",
    price: 30847,
    hot: true,
    publishTime: "2025-01-08T01:00:00+08:00"
  },
  {
    id: 23,
    name: "烈焰玫瑰",
    description: "一种在燃烧时最为美丽的花朵。它的火焰能烧尽一切，但也能温暖一切...",
    rarity: "稀有",
    price: 33482,
    hot: true,
    publishTime: "2025-01-08T01:30:00+08:00"
  },
  {
    id: 24,
    name: "冰心机匣",
    description: "一个能将灵魂锻造成实体护符的奇幻装置。使用它的人会获得强大的力量，但也会失去自己的灵魂...",
    rarity: "稀有",
    price: 27918,
    hot: false,
    publishTime: "2025-01-08T02:00:00+08:00"
  },
  {
    id: 25,
    name: "镜像方舟",
    description: "一艘全然对称的幻想船只。乘坐它的人会体验到另一个世界，但也会失去自己...",
    rarity: "稀有",
    price: 29305,
    hot: true,
    publishTime: "2025-01-08T02:30:00+08:00"
  },
  {
    id: 26,
    name: "余辉晶球",
    description: "短暂闪耀后化为虚无的光之物件。使用它的人会获得短暂的力量，但也会失去自己的记忆...",
    rarity: "普通",
    price: 12849,
    hot: false,
    publishTime: "2025-01-08T03:00:00+08:00"
  },
  {
    id: 27,
    name: "影月盛典",
    description: "一场无光之地的秘密庆典。参加它的人会体验到另一个世界，但也会失去自己的灵魂...",
    rarity: "精良",
    price: 18293,
    hot: true,
    publishTime: "2025-01-08T03:30:00+08:00"
  },
  {
    id: 28,
    name: "亡者之廊",
    description: "一个由亡者骨骼构成的艺术展览。参观它的人会体验到死亡的美丽，但也会失去自己的生命...",
    rarity: "精良",
    price: 20471,
    hot: false,
    publishTime: "2025-01-08T04:00:00+08:00"
  },
  {
    id: 29,
    name: "触觉迷踪",
    description: "一个以感官错觉为基础的虚拟体验。体验它的人会获得前所未有的快感，但也会失去自己的感官...",
    rarity: "精良",
    price: 19452,
    hot: true,
    publishTime: "2025-01-08T04:30:00+08:00"
  },
  {
    id: 30,
    name: "时光刀锋",
    description: "能精准删除记忆片段的工具设定。使用它的人会获得前所未有的自由，但也会失去自己的记忆...",
    rarity: "精良",
    price: 24932,
    hot: false,
    publishTime: "2025-01-08T05:00:00+08:00"
  },
  {
    id: 31,
    name: "梦魇熔炉",
    description: "将恐惧凝聚为实体的装置。使用它的人会获得前所未有的力量，但也会失去自己的理智...",
    rarity: "史诗",
    price: 35724,
    hot: true,
    publishTime: "2025-01-08T05:30:00+08:00"
  },
  {
    id: 32,
    name: "心灵塑像",
    description: "一种能捕捉情感波动的动态雕塑。观赏它的人会体验到前所未有的情感，但也会失去自己的心灵...",
    rarity: "精良",
    price: 18753,
    hot: false,
    publishTime: "2025-01-08T06:00:00+08:00"
  },
  {
    id: 33,
    name: "虚拟舞台",
    description: "一场专为幻觉编排的表演。观看它的人会体验到前所未有的幻觉，但也会失去自己的现实...",
    rarity: "稀有",
    price: 28438,
    hot: true,
    publishTime: "2025-01-08T06:30:00+08:00"
  },
  {
    id: 34,
    name: "无声之域",
    description: "一个完全隔绝声音的虚拟空间。进入它的人会体验到前所未有的宁静，但也会失去自己的听觉...",
    rarity: "普通",
    price: 14372,
    hot: false,
    publishTime: "2025-01-08T07:00:00+08:00"
  },
  {
    id: 35,
    name: "星河织梦",
    description: "一台能将星空编织成梦境的机器。使用者可以在群星间漫步，感受宇宙的壮丽，但每次醒来都会失去一段珍贵的记忆作为代价...",
    rarity: "史诗",
    price: 37845,
    hot: true,
    publishTime: "2025-01-08T07:30:00+08:00"
  },
  {
    id: 36,
    name: "量子迷宫",
    description: "一个基于量子纠缠原理设计的迷宫。每个人看到的路径都不同，而且会随着观察者的心情变化。据说有人在里面找到了通往平行宇宙的门...",
    rarity: "传说",
    price: 43921,
    hot: true,
    publishTime: "2025-01-08T08:00:00+08:00"
  },
  {
    id: 37,
    name: "悖论之镜",
    description: "一面能映照出物体所有可能状态的魔镜。它会同时显示一个物体的过去、现在和未来，但凝视太久的人会开始质疑自己的存在...",
    rarity: "史诗",
    price: 39754,
    hot: false,
    publishTime: "2025-01-08T08:30:00+08:00"
  },
  {
    id: 38,
    name: "虚空画笔",
    description: "一支能在虚空中作画的神秘画笔。画出的图案会真实地存在于三维空间中，但每幅画作都会缓慢地吞噬周围的现实...",
    rarity: "稀有",
    price: 31628,
    hot: true,
    publishTime: "2025-01-08T09:00:00+08:00"
  },
  {
    id: 39,
    name: "永恒沙漏",
    description: "一个装满了永恒时间的沙漏。它能让使用者在特定时刻无限循环，但每次循环都会改变一个微小的细节，直到现实变得面目全非...",
    rarity: "传说",
    price: 46832,
    hot: true,
    publishTime: "2025-01-08T09:30:00+08:00"
  },
  {
    id: 40,
    name: "混沌音盒",
    description: "一个能演奏出情绪的音乐盒。它会根据聆听者的潜意识创作旋律，有时温柔似水，有时狂暴如雷，但每首曲子只能被同一个人听到一次...",
    rarity: "精良",
    price: 23567,
    hot: false,
    publishTime: "2025-01-08T10:00:00+08:00"
  },
  {
    id: 41,
    name: "思维织网",
    description: "一种能将多人思维连接在一起的虚拟网络。连接者能体验彼此的想法和记忆，但每次连接都会不可避免地交换一些性格特征...",
    rarity: "史诗",
    price: 38965,
    hot: true,
    publishTime: "2025-01-08T10:30:00+08:00"
  },
  {
    id: 42,
    name: "概率骰子",
    description: "一颗能影响现实概率的骰子。投掷它可以改变不可能事件发生的概率，但每次使用都会让现实变得越来越不确定...",
    rarity: "传说",
    price: 44723,
    hot: true,
    publishTime: "2025-01-08T11:00:00+08:00"
  },
  {
    id: 43,
    name: "灵魂棱镜",
    description: "一个能将灵魂分解成七种基本情感的装置。使用者可以暂时移除或强化某种情感，但长期使用会导致人格逐渐破碎...",
    rarity: "史诗",
    price: 36892,
    hot: false,
    publishTime: "2025-01-08T11:30:00+08:00"
  },
  {
    id: 44,
    name: "时光织机",
    description: "一台能编织时间线的神秘机器。操作者可以编织出不同的历史可能性，但每次改变都会在现实中留下无法修复的裂痕...",
    rarity: "传说",
    price: 47851,
    hot: true,
    publishTime: "2025-01-08T12:00:00+08:00"
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('market')
  const [crystalBalance, setCrystalBalance] = useState(() => {
    const savedBalance = localStorage.getItem('crystalBalance');
    return savedBalance ? Number(savedBalance) : 50000;
  })
  const [marketItems, setMarketItems] = useState(initialItems)
  const [inventoryItems, setInventoryItems] = useState([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  useEffect(() => {
    localStorage.setItem('crystalBalance', crystalBalance);
  }, [crystalBalance]);

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handlePurchase = (item) => {
    const currentBalance = Number(crystalBalance);
    const itemPrice = Number(item.price);

    if (currentBalance >= itemPrice) {
      setCrystalBalance(prev => {
        const newBalance = Number(prev) - itemPrice;
        return isNaN(newBalance) ? prev : newBalance;
      });
      
      setMarketItems(prev => prev.filter(i => i.id !== item.id));
      setInventoryItems(prev => [...prev, {
        ...item,
        purchaseDate: new Date().toISOString().split('T')[0],
        usable: true
      }]);
    }
  };

  const handleResell = (item) => {
    const itemPrice = Number(item.price);
    
    setCrystalBalance(prev => {
      const newBalance = Number(prev) + itemPrice;
      return isNaN(newBalance) ? prev : newBalance;
    });

    setInventoryItems(prev => prev.filter(i => i.id !== item.id));
    setMarketItems(prev => [...prev, {
      ...item,
      hot: false,
      publishTime: new Date().toISOString()
    }]);
  };

  const handleDestroy = (itemId) => {
    setInventoryItems(prev => prev.filter(item => item.id !== itemId))
  }

  const handleEdit = (itemId, newDescription, newPrice) => {
    // 找到要编辑的物品
    const itemToEdit = inventoryItems.find(item => item.id === itemId);
    if (!itemToEdit) return;

    // 确保价格是数字类型
    const finalPrice = Number(newPrice) || itemToEdit.price;
    const originalPrice = Number(itemToEdit.price) || 0;

    // 从库存中移除
    setInventoryItems(prev => prev.filter(item => item.id !== itemId));

    // 添加到货场
    setMarketItems(prev => [...prev, {
      ...itemToEdit,
      description: newDescription,
      price: finalPrice,
      hot: false,
      publishTime: new Date().toISOString()
    }]);

    // 更新余额：返还原价 + 新的售价
    setCrystalBalance(prevBalance => {
      const newBalance = Number(prevBalance) + originalPrice + finalPrice;
      return isNaN(newBalance) ? prevBalance : newBalance;
    });
  };

  const handleCreateItem = (title, description, price) => {
    // 生成新的ID（在实际应用中应该由后端生成）
    const newId = Math.max(...marketItems.map(item => item.id), 0) + 1;
    
    // 创建新物品
    const newItem = {
      id: newId,
      name: title,
      description,
      price: Number(price),
      rarity: getRarityByPrice(price),
      hot: true,
      publishTime: new Date().toISOString()
    };

    // 添加到货场
    setMarketItems(prev => [...prev, newItem]);
    
    // 发布创意时，用户获得相应的水晶奖励
    setCrystalBalance(prev => {
      const newBalance = Number(prev) + Number(price);
      return isNaN(newBalance) ? prev : newBalance;
    });
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
