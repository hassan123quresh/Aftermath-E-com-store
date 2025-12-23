import { Product, PromoCode, Order } from './types';

export const INITIAL_ANNOUNCEMENT = "FREE SHIPPING ALL OVER PAKISTAN";

export const INITIAL_PROMOS: PromoCode[] = [
  { code: 'WELCOME10', discountPercentage: 10, usageLimit: -1, usedCount: 12, isActive: true },
  { code: 'SILENCE', discountPercentage: 20, usageLimit: 50, usedCount: 45, isActive: true },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'The Obsidian Coat',
    price: 45000,
    category: 'Outerwear',
    description: "## Construction\n\nA tailored silhouette cut from heavyweight Japanese wool. Designed to create a boundary between the self and the noise of the world.\n\n*   100% Virgin Wool\n*   Hidden placket\n*   Structured shoulder\n\n## Philosophy\n\nArmor for the modern ascetic. Wear it to disappear in plain sight.",
    images: [
      'https://picsum.photos/800/1000?random=1',
      'https://picsum.photos/800/1000?random=11',
      'https://picsum.photos/800/1000?random=12'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
  },
  {
    id: 'p2',
    name: 'Structure Trousers',
    price: 18500,
    category: 'Bottoms',
    description: "## Form\n\nWide-leg trousers with deep pleats. The fabric flows with movement but stands still in repose.\n\n*   High-twist cotton drill\n*   Extended waistband\n*   Raw hem capability",
    images: [
      'https://picsum.photos/800/1000?random=2',
      'https://picsum.photos/800/1000?random=22'
    ],
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
  {
    id: 'p3',
    name: 'Silence Knit',
    price: 22000,
    category: 'Knitwear',
    description: "## Texture\n\nA dense, dry-touch merino knit. Seamless construction eliminates friction. \n\nIntended to be worn directly against the skin.",
    images: [
      'https://picsum.photos/800/1000?random=3',
      'https://picsum.photos/800/1000?random=33'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    inStock: true,
  },
  {
    id: 'p4',
    name: 'Void Shirt',
    price: 12500,
    category: 'Tops',
    description: "## Essential\n\nCrisp poplin. Oversized fit. A blank canvas for the day.",
    images: [
      'https://picsum.photos/800/1000?random=4',
      'https://picsum.photos/800/1000?random=44'
    ],
    sizes: ['S', 'M', 'L'],
    inStock: true,
  },
    {
    id: 'p5',
    name: 'Canvas Tote',
    price: 8500,
    category: 'Accessories',
    description: "## Utility\n\nHeavy canvas. Reinforced handles. Carries the weight of necessity.",
    images: [
      'https://picsum.photos/800/1000?random=5',
      'https://picsum.photos/800/1000?random=55'
    ],
    sizes: ['One Size'],
    inStock: true,
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-7721',
    customerName: 'Ahmed Khan',
    customerEmail: 'ahmed@example.com',
    customerPhone: '+92 300 1234567',
    address: 'House 12, Street 4, DHA Phase 6',
    city: 'Lahore',
    items: [
      { ...MOCK_PRODUCTS[0], selectedSize: 'M', quantity: 1 }
    ],
    total: 45000,
    status: 'Delivered',
    paymentMethod: 'BankTransfer',
    date: '2023-10-15',
  },
  {
    id: 'ORD-7722',
    customerName: 'Sara Ali',
    customerEmail: 'sara@example.com',
    customerPhone: '+92 321 9876543',
    address: 'Flat 4B, Askari 11',
    city: 'Lahore',
    items: [
      { ...MOCK_PRODUCTS[2], selectedSize: 'S', quantity: 1 },
      { ...MOCK_PRODUCTS[3], selectedSize: 'S', quantity: 2 }

    ],
    total: 47000,
    status: 'Pending',
    paymentMethod: 'COD',
    date: '2023-10-25',
  },
   {
    id: 'ORD-7723',
    customerName: 'Zainab Bibi',
    customerEmail: 'zainab@example.com',
    customerPhone: '+92 333 5555555',
    address: 'Sector F-7/2',
    city: 'Islamabad',
    items: [
       { ...MOCK_PRODUCTS[1], selectedSize: 'L', quantity: 1 }
    ],
    total: 18500,
    status: 'Shipped',
    paymentMethod: 'COD',
    date: '2023-10-26',
  }
];