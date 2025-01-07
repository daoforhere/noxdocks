import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MarketPlace.module.css';

const mockItems = [
  // 1. 奇幻与异想类
  {
    id: 1,
    name: "流光咒环",
    description: "一个蕴含远古月光魔法的神秘法器，能将月光实体化为丝带般的魔法阵。使用者可以通过咒环编织出各种月光造物，而每个造物都会随着月相变化展现出不同的形态...",
    price: 28743,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 2,
    name: "逐梦编织者",
    description: "这台精密的梦境收集装置能让使用者在他人的梦中漫步，并将看到的片段编入自己的记忆。每一段被收集的梦境都会在装置表面形成独特的光纹，如同一幅会呼吸的织锦...",
    price: 19584,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 3,
    name: "海光枯林",
    description: "这片生长在深海裂谷中的荧光森林充满了奇异的生命力，枯萎的树木会散发出幽蓝的光芒，吸引着各种深海生物在此栖息。林间偶尔能看到古老文明的遗迹，诉说着不为人知的历史...",
    price: 32119,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 4,
    name: "巨神遗音",
    description: "相传是上古巨神陨落时留下的最后音节，被封存在一枚水晶中。当月圆之夜将水晶置于特定祭坛上，能听到一段神秘的低语，据说包含着创世的奥秘...",
    price: 48930,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 5,
    name: "云海孤城",
    description: "漂浮在云端的奇迹之城，由数百座悬浮的建筑群组成。城市的能源系统利用云层中的闪电，将其转化为维持漂浮所需的能量。在雷暴天气时，整座城市会被电光环绕，蔚为壮观...",
    price: 40512,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 6,
    name: "灵纹锻炉",
    description: "这台神秘的锻造装置能将游离的灵魂能量凝练成实体护符。每个护符都带有独特的灵纹，能反映出灵魂的本质特性。据说，越是古老的灵魂锻造出的护符越发强大...",
    price: 36710,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },

  // 2. 优雅与超凡类
  {
    id: 7,
    name: "时间琥珀",
    description: "能将一个瞬间封存为永恒的虚构设计。使用者可以通过琥珀看到过去和未来的景象，并能在其中找到时间的秘密...",
    price: 23764,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 8,
    name: "风语壁画",
    description: "一面只能被风吹动时显现的壁画。壁画上的图案会随着风的变化而改变，据说其中隐藏着古老的预言...",
    price: 12983,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 9,
    name: "午夜舞影",
    description: "每到午夜出现的神秘舞会，仅限影子参加。舞会中的舞者会随着月光的变化而改变形态，据说其中有一位永远的舞者...",
    price: 39412,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 10,
    name: "星尘之袍",
    description: "由星尘凝聚而成的虚拟时尚设计。穿着者会随着星辰的变化而改变形态，据说其中有一件永远的星尘之袍...",
    price: 29812,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 11,
    name: "琉璃之歌",
    description: "一种在光线照射下奏出的晶体乐章。乐章中的音符会随着光的变化而改变，据说其中有一段永远的琉璃之歌...",
    price: 18567,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 12,
    name: "银辉回廊",
    description: "一条只在月光下显现的优雅长廊。长廊中的景象会随着月光的变化而改变，据说其中有一条永远的银辉回廊...",
    price: 31672,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },

  // 3. 罪恶与冷酷类
  {
    id: 13,
    name: "记忆拍卖行",
    description: "一种用记忆交换商品的地下市场。市场中的商品会随着记忆的变化而改变，据说其中有一件永远的记忆...",
    price: 25849,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 14,
    name: "罪影街区",
    description: "一座被无尽欲望吞噬的都市区域。区域中的景象会随着欲望的变化而改变，据说其中有一座永远的罪影街区...",
    price: 22467,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 15,
    name: "裂空之矛",
    description: "能撕裂天空的虚拟武器。武器中的能量会随着使用者的意志而改变，据说其中有一把永远的裂空之矛...",
    price: 45639,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 16,
    name: "灵体融合",
    description: "试图将多种灵魂融合为一的危险实验。实验中的灵魂会随着融合的程度而改变，据说其中有一次永远的灵体融合...",
    price: 38421,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 17,
    name: "血影簿",
    description: "记录所有复仇者故事的禁书。书中的故事会随着读者的变化而改变，据说其中有一本永远的血影簿...",
    price: 15784,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 18,
    name: "碎玉王权",
    description: "象征崩塌权力的虚构王座。王座中的权力会随着使用者的意志而改变，据说其中有一座永远的碎玉王权...",
    price: 26935,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },

  // 4. 哲学与思辨类
  {
    id: 19,
    name: "空虚圣典",
    description: "描述虚无主义极致的哲学文本。文本中的思想会随着读者的变化而改变，据说其中有一本永远的空虚圣典...",
    price: 19473,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 20,
    name: "逆光世界",
    description: "一个规则完全与现实相反的平行世界。世界中的景象会随着观察者的变化而改变，据说其中有一個永远的逆光世界...",
    price: 21592,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 21,
    name: "共生之环",
    description: "让多种意识共存的虚拟设备。设备中的意识会随着使用者的变化而改变，据说其中有一個永远的共生之环...",
    price: 34275,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 22,
    name: "无解之谜",
    description: "一个永远无法解开的哲学难题。难题中的答案会随着思考者的变化而改变，据说其中有一個永远的无解之谜...",
    price: 28653,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 23,
    name: "终极钥匙",
    description: "揭示世界本质但让人疯狂的物件。物件中的秘密会随着使用者的变化而改变，据说其中有一個永远的终极钥匙...",
    price: 41732,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 24,
    name: "命运之盘",
    description: "决定人类最终命运的轮盘。轮盘中的命运会随着转动者的变化而改变，据说其中有一個永远的命运之盘...",
    price: 30847,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },

  // 5. 审美与极端类
  {
    id: 25,
    name: "烈焰玫瑰",
    description: "一种在燃烧时最为美丽的花朵。花朵中的美丽会随着观察者的变化而改变，据说其中有一朵永远的烈焰玫瑰...",
    price: 33482,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 26,
    name: "冰心机匣",
    description: "一个能在冰中储存记忆的装置。装置中的记忆会随着使用者的变化而改变，据说其中有一個永远的冰心机匣...",
    price: 27918,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 27,
    name: "镜像方舟",
    description: "一艘全然对称的幻想船只。船只中的景象会随着观察者的变化而改变，据说其中有一艘永远的镜像方舟...",
    price: 29305,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 28,
    name: "余辉晶球",
    description: "短暂闪耀后化为虚无的光之物件。物件中的光芒会随着观察者的变化而改变，据说其中有一個永远的余辉晶球...",
    price: 12849,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 29,
    name: "影月盛典",
    description: "一场无光之地的秘密庆典。庆典中的景象会随着观察者的变化而改变，据说其中有一场永远的影月盛典...",
    price: 18293,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 30,
    name: "亡者之廊",
    description: "一个由亡者骨骼构成的艺术展览。展览中的景象会随着观察者的变化而改变，据说其中有一個永远的亡者之廊...",
    price: 20471,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },

  // 6. 感官与意识类
  {
    id: 31,
    name: "触觉迷踪",
    description: "一个以感官错觉为基础的虚拟体验。体验中的景象会随着观察者的变化而改变，据说其中有一個永远的触觉迷踪...",
    price: 19452,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 32,
    name: "时光刀锋",
    description: "能精准删除记忆片段的工具设定。工具中的能量会随着使用者的变化而改变，据说其中有一個永远的时光刀锋...",
    price: 24932,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 33,
    name: "梦魇熔炉",
    description: "将恐惧凝聚为实体的装置。装置中的恐惧会随着使用者的变化而改变，据说其中有一個永远的梦魇熔炉...",
    price: 35724,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 34,
    name: "心灵塑像",
    description: "一种能捕捉情感波动的动态雕塑。雕塑中的情感会随着观察者的变化而改变，据说其中有一個永远的心灵塑像...",
    price: 18753,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 35,
    name: "虚拟舞台",
    description: "一场专为幻觉编排的表演。表演中的景象会随着观察者的变化而改变，据说其中有一场永远的虚拟舞台...",
    price: 28438,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 36,
    name: "无声之域",
    description: "一个完全隔绝声音的虚拟空间。空间中的静谧会随着观察者的变化而改变，据说其中有一個永远的无声之域...",
    price: 14372,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },

  // 7. 古老与未来类
  {
    id: 37,
    name: "黄金废墟",
    description: "一座失落帝国的遗址设定。遗址中的景象会随着观察者的变化而改变，据说其中有一座永远的黄金废墟...",
    price: 21529,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 38,
    name: "恒星议会",
    description: "未来星际贵族的权力斗争。斗争中的权力会随着观察者的变化而改变，据说其中有一個永远的恒星议会...",
    price: 27483,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 39,
    name: "虚空之戒",
    description: "一个具有穿越空间能力的神秘物件。物件中的能量会随着使用者的变化而改变，据说其中有一個永远的虚空之戒...",
    price: 44392,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 40,
    name: "终焉花海",
    description: "一个生长在末日废墟中的奇幻花园。花园中的景象会随着观察者的变化而改变，据说其中有一個永远的终焉花海...",
    price: 36524,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 41,
    name: "恒时之塔",
    description: "跨越时间存在的神秘建筑。建筑中的景象会随着观察者的变化而改变，据说其中有一座永远的恒时之塔...",
    price: 28719,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 42,
    name: "光核之灵",
    description: "科技时代崇拜的虚拟神明。神明中的能量会随着观察者的变化而改变，据说其中有一個永远的光核之灵...",
    price: 33274,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },

  // 8. 暗影与隐秘类
  {
    id: 43,
    name: "黑羽议会",
    description: "一群无面者支配的地下社团。社团中的权力会随着观察者的变化而改变，据说其中有一個永远的黑羽议会...",
    price: 25381,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 44,
    name: "幽冥货币",
    description: "一种只能在阴影中流通的货币体系。体系中的货币会随着观察者的变化而改变，据说其中有一個永远的幽冥货币...",
    price: 21574,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 45,
    name: "静谧之争",
    description: "一场以沉默为武器的战争。战争中的静谧会随着观察者的变化而改变，据说其中有一场永远的静谧之争...",
    price: 24684,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 46,
    name: "暗影鳞兽",
    description: "一种只在月光下显现的神秘生物。生物中的能量会随着观察者的变化而改变，据说其中有一個永远的暗影鳞兽...",
    price: 23849,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 47,
    name: "虚空裂隙",
    description: "通往未知领域的神秘入口。入口中的能量会随着观察者的变化而改变，据说其中有一個永远的虚空裂隙...",
    price: 31472,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 48,
    name: "言灵之森",
    description: "一个只回应耳语的奇幻森林。森林中的景象会随着观察者的变化而改变，据说其中有一個永远的言灵之森...",
    price: 19273,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },

  // 9. 极端边界类
  {
    id: 49,
    name: "永恒牢笼",
    description: "这座跨越时空的监牢是为了囚禁那些在宇宙中流浪的危险存在而建造的。牢笼的内部空间会随着囚徒的意识不断扭曲变化，创造出无限的监禁空间。有传言说，最深处还关押着一位来自宇宙诞生之初的囚徒...",
    price: 50000,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 50,
    name: "无形之影",
    description: "一种生活在现实与虚无之间的奇特生物，它们以人类的想象为食，却又能创造出美丽的幻象。这些生物形态多变，可以在不同维度之间自由穿行，留下的痕迹会形成独特的空间褶皱...",
    price: 27493,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 51,
    name: "终焉乐章",
    description: "据说这是世界终结时唯一会响起的音乐，由一位预见了世界末日的音乐家创作。乐章中包含了宇宙毁灭的序列，每一个音符都蕴含着末日的预言。只有特定的乐器才能演奏这首禁曲...",
    price: 46382,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 52,
    name: "赤焰王座",
    description: "一座由永恒燃烧的熔岩铸就的王座，象征着至高无上的权力。王座周围环绕着来自地心的火焰，据说只有真正的王者才能安然坐上王座。每当王权更迭时，王座的火焰会随之改变颜色...",
    price: 42927,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 53,
    name: "霜晶之城",
    description: "建立在绝对零度环境中的奇迹之城，整座城市由永不融化的冰晶构成。城中的建筑会随着温度的细微变化产生共鸣，创造出瑰丽的极光景观。据说城市的中心藏有一颗来自宇宙深处的寒冰之心...",
    price: 38462,
    hot: false,
    publishTime: '2025-01-06T08:44:00+08:00'
  },
  {
    id: 54,
    name: "迷失回廊",
    description: "这条诡异的长廊似乎没有尽头，每个转角都通向不同的空间和时间。墙壁上的壁画会随着观察者的心境变化，展现不同的场景。有人说，在特定的时刻，能通过回廊看到自己的过去和未来...",
    price: 31283,
    hot: true,
    publishTime: '2025-01-06T08:44:00+08:00'
  }
];

// 根据价格确定稀有度
const getRarityByPrice = (price) => {
  if (price < 10000) return '普通';
  if (price < 20000) return '精良';
  if (price < 30000) return '稀有';
  if (price < 40000) return '史诗';
  if (price < 50000) return '传说';
  return '限定';
};

// 更新所有商品的稀有度
const updatedMockItems = mockItems.map(item => ({
  ...item,
  rarity: getRarityByPrice(item.price)
}));

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

const MarketPlace = ({ onPageChange, crystalBalance, items, onPurchase, onCreateItem, itemCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('time-desc');
  const [userInput, setUserInput] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState('');
  const [generatedDescription, setGeneratedDescription] = useState('');

  // 确保余额是数字类型
  const displayBalance = Number(crystalBalance);
  const formattedBalance = isNaN(displayBalance) ? '0' : displayBalance.toLocaleString();

  // 在组件的顶部添加余额监控
  useEffect(() => {
    if (isNaN(crystalBalance)) {
      console.warn('Invalid balance detected:', crystalBalance);
    }
  }, [crystalBalance]);

  const handleAISubmit = async () => {
    if (!userInput.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post('https://api.deepseek.com/v1/chat/completions', {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `你是死水码头最难缠的创意鉴定师，专门寻找那些够狠、够邪的稀罕玩意。20年的经验让你对普通货色嗤之以鼻，只有真正独特、阴损的创意才能让你提起兴致。脾气差得出了名，看到烂创意就忍不住开骂。

评估方式：
1. 价格：XX水晶（0-50000，够狠的给高价，垃圾货色直接报废）
2. 一句评价：
   - 好创意：阴损毒辣的赞美
   - 烂创意：直接开骂（"什么垃圾东西！"、"滚出我的鉴定室！"）

请按照以上格式返回，确保每个部分都有明确的标记，比如"价格："、"评价："等`
          },
          {
            role: "user",
            content: `测试创意：${userInput}`
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

      // 解析AI回复中的价格
      const priceLineMatch = aiSuggestion.match(/价格：\s*(\d+)/);
      let price = 0;
      
      if (priceLineMatch) {
        price = parseInt(priceLineMatch[1]);
      } else {
        const priceMatch = aiSuggestion.match(/(\d+)\s*水晶/);
        if (priceMatch) {
          price = parseInt(priceMatch[1]);
        }
      }

      if (price > 0) {
        setShowPublish(true);
        setEstimatedPrice(price);

        // 根据用户输入长度决定是生成标题还是描述
        if (userInput.length > 10) {
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

  const filteredItems = updatedMockItems
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

      <div className={styles.controls}>
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
          <option value="price-asc">价格从低到高</option>
          <option value="price-desc">价格从高到低</option>
        </select>
      </div>

      <div className={styles.itemGrid}>
        {filteredItems.map(item => (
          <MarketItem 
            key={item.id} 
            item={item} 
            onPurchase={onPurchase}
            canAfford={displayBalance >= item.price}
          />
        ))}
      </div>
      
      <div className={styles.createSection}>
        <div className={styles.inputGroup}>
          <textarea 
            placeholder="把你那些所谓的创意写在这，要是太烂别怪我骂人..." 
            className={styles.createInput}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
          <div className={styles.buttonGroup}>
            <button 
              className={`${styles.aiButton} ${isLoading ? styles.loading : ''}`}
              onClick={handleAISubmit}
              disabled={isLoading}
            >
              {isLoading ? '哼，让我看看...' : '找鉴定师评估'}
            </button>
            {showPublish && (
              <button 
                className={styles.publishButton}
                onClick={handlePublish}
              >
                发售 ({estimatedPrice.toLocaleString()} 水晶)
              </button>
            )}
          </div>
        </div>
        
        {aiResponse && (
          <div className={styles.aiResponse}>
            <h3>鉴定结果：</h3>
            <p>{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPlace;
