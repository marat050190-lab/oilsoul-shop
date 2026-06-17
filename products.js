const products = [
  {
    id: 2,
    title: "Golden Trophy",
    description: "Golden trophy — symbol of victory in TG gifts style",
    ton: 99, emoji: "🏆", image: 'IMG_7129.JPG', images: ['IMG_7129.JPG', 'IMG_7125.HEIC'], status: 'ready'
  },
  {
    id: 3,
    title: "Homemade Cake",
    description: "Homemade cake — one of the first Telegram gifts",
    ton: 99, emoji: "🎂", image: 'Cake.png', images: null, status: 'ready'
  },
  {
    id: 4,
    title: "Red Heart",
    description: "Symbol of love — oil painting",
    ton: 99, emoji: "❤️", image: 'Heart.png', images: null, status: 'ready'
  },
  {
    id: 5,
    title: "Star",
    description: "Golden star — symbol of Telegram Stars",
    ton: 99, emoji: "⭐", image: 'Star.png', images: null, status: 'ready'
  },
  {
    id: 6,
    title: "Heart Bow",
    description: "Heart with bow — tender oil painting",
    ton: 99, emoji: "🎀", image: 'Heart%20Bow.png', images: null, status: 'ready'
  },
  {
    id: 7,
    title: "Gift Box",
    description: "Gift box — classic Telegram gift in oil",
    ton: 99, emoji: "🎁", image: 'Gift%20Box.png', images: null, status: 'ready'
  },
  {
    id: 8,
    title: "Red Rose",
    description: "Red rose — romantic oil painting",
    ton: 99, emoji: "🌹", image: 'Red%20Rose.png', images: null, status: 'ready'
  },
  {
    id: 9,
    title: "Flower Bouquet",
    description: "Flower bouquet — colourful oil painting",
    ton: 99, emoji: "💐", image: 'Flower%20Bouquet.png', images: null, status: 'ready'
  },
  {
    id: 10,
    title: "Diamond Ring",
    description: "Diamond ring — elegant oil painting",
    ton: 99, emoji: "💍", image: 'Diamond%20Ring.png', images: null, status: 'ready'
  },
  {
    id: 11,
    title: "Blue Diamond",
    description: "Blue diamond — rare Telegram gift in oil",
    ton: 99, emoji: "💎", image: 'Blue%20Diamond.png', images: null, status: 'ready'
  },
  {
    id: 12,
    title: "Plush Bear",
    description: "Plush bear — cosy Telegram gift in oil",
    ton: 99, emoji: "🧸", image: 'images/Plush%20Bear.png', images: null, status: 'ready'
  },
  {
    id: 13,
    title: "Champagne",
    description: "Champagne — celebration in oil painting",
    ton: 99, emoji: "🍾", image: 'images/Champagne.png', images: null, status: 'ready'
  },
  {
    id: 14,
    title: "Ice Cream",
    description: "Ice cream — sweet Telegram gift in oil",
    ton: 99, emoji: "🍦", image: 'images/Ice%20Cream.png', images: null, status: 'ready'
  },
  {
    id: 15,
    title: "Brick",
    description: "Brick — iconic Telegram gift in oil",
    ton: 99, emoji: "🧱", image: 'images/Brick.png', images: null, status: 'ready'
  },
  {
    id: 16,
    title: "Cigar",
    description: "Cigar — classic Telegram gift in oil",
    ton: 99, emoji: "🚬", image: 'images/Cigar.png', images: null, status: 'ready'
  },
  {
    id: 17,
    title: "Crescent Mosque",
    description: "Crescent Mosque — spiritual Telegram gift in oil",
    ton: 99, emoji: "🕌", image: 'images/Crescent%20Mosque.png', images: null, status: 'ready'
  },
  {
    id: 18,
    title: "Magic Lamp",
    description: "Magic lamp — mystical Telegram gift in oil",
    ton: 99, emoji: "🪔", image: 'images/Magic%20Lamp.png', images: null, status: 'ready'
  },
  {
    id: 19,
    title: "Khabib Papakha",
    description: "Khabib Papakha — legendary Telegram gift in oil",
    ton: 99, emoji: "🎩", image: 'images/Khabib%20Papakha.png', images: null, status: 'ready'
  },
  {
    id: 20,
    title: "Moon Pendant",
    description: "Moon pendant — elegant Telegram gift in oil",
    ton: 99, emoji: "🌙", image: 'images/Moon%20Pendant.png', images: null, status: 'ready'
  },
  {
    id: 21,
    title: "Mighty Arm",
    description: "Mighty arm — powerful Telegram gift in oil",
    ton: 99, emoji: "💪", image: 'images/Mighty%20Arm.png', images: null, status: 'ready'
  },
  {
    id: 22,
    title: "B-Day Calendar",
    description: "Birthday calendar — festive Telegram gift in oil",
    ton: 99, emoji: "📅", image: 'images/B-Day%20Calendar.png', images: null, status: 'ready'
  },
  {
    id: 23,
    title: "Signet Ring",
    description: "Signet ring — noble Telegram gift in oil",
    ton: 99, emoji: "💍", image: 'images/Signet%20Ring.png', images: null, status: 'ready'
  },
  {
    id: 24,
    title: "Rocket",
    description: "Rocket — iconic Telegram gift in oil",
    ton: 99, emoji: "🚀", image: 'images/Rocket.png', images: null, status: 'ready'
  }
];

const TON_WALLET = "UQB1gcgRoxQ88K6uEHr31G6j4F9_29olrnAXCozRp029Xzom";
