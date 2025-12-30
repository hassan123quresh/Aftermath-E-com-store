
import { Product, PromoCode, Order, BlogPost, Customer, Review } from './types';

export const INITIAL_ANNOUNCEMENT = "FREE SHIPPING ALL OVER PAKISTAN";

export const INITIAL_PROMOS: PromoCode[] = [
  { code: 'WELCOME10', discountPercentage: 10, usageLimit: -1, usedCount: 12, isActive: true },
  { code: 'SILENCE', discountPercentage: 20, usageLimit: 50, usedCount: 45, isActive: true },
  { code: 'VIP30', discountPercentage: 30, usageLimit: 10, usedCount: 3, isActive: true },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Studio Cut Hoodie in Burnt Terra',
    price: 8499,
    costPrice: 4200, // ~50% margin
    category: 'Hoodies',
    description: "Model is 5'11, wearing size M.\n\nThe After Hours studio cut hoodie is named for the hours that are yours, wherever you spend them. A clean blank with a considered silhouette, it is made to sit right on the body, feel easy to move in and stay quiet enough for you to be the focus.\n\n*   Relaxed oversized fit with voluminous sleeves\n*   True to size\n*   500 GSM cotton fleece\n*   Soft brushed interior with a structured outer feel\n*   Ribbed cuffs and hem for a clean finish",
    images: [
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy5.jpg?v=1763585095&width=500',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy5_2.jpg?v=1763585095&width=500',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard2copy4.jpg?v=1763585095&width=500',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard3copy5_8a6af684-d339-4b6a-b182-98dc5453ae4e.jpg?v=1763585095&width=500',
      'https://res.cloudinary.com/dacyy7rkn/image/upload/f_auto,q_auto,w_500/v1766840067/The_way_something_is_packed_says_a_lot_about_how_it_was_made._When_care_goes_into_the_layers_it_wmbq5a.jpg'
    ],
    inventory: [
      { size: 'XS', stock: 5 },
      { size: 'S', stock: 15 },
      { size: 'M', stock: 20 },
      { size: 'L', stock: 10 },
      { size: 'XL', stock: 0 }
    ],
    inStock: true,
    isVisible: true,
    video: 'https://res.cloudinary.com/dacyy7rkn/video/upload/v1766844054/CanafeelingstartbeforetheproductdoesYouknowhowsomethingsalreadyfeelconsideredbef1-FPS-Videobolt.net-ezgif.com-video-cutter_jda8zx.mp4',
    galleryVideo: 'https://res.cloudinary.com/dacyy7rkn/video/upload/v1766845175/It_is_always_the_small_things_that_set_a_piece_apart._Fine_details_take_time_and_attention_and_isobwr.mp4',
  },
  {
    id: 'p6',
    name: 'Studio Cut Quarter in Cloud Dancer',
    price: 7999,
    costPrice: 3800,
    category: 'Sweatshirts',
    description: "Model is 5'2, wearing size XS.\n\nThe After Hours studio cut quarter is named for the hours that are yours, wherever you spend them. A clean blank with a considered silhouette, it is made to sit right on the body, feel easy to move in and stay quiet enough for you to be the focus.",
    images: [
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1_7a132423-3efa-4f07-bcca-69ba437b394e.jpg?v=1763591134&width=500',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy_1ca85ebc-9107-439c-9c50-f3bb58d37ecb.jpg?v=1763591134&width=500',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard3copy3_fb280b84-80e9-42ea-94a7-1fc5eb48a131.jpg?v=1763591134&width=500',
      'https://res.cloudinary.com/dacyy7rkn/image/upload/f_auto,q_auto,w_500/v1766840208/The_way_something_is_packed_says_a_lot_about_how_it_was_made._When_care_goes_into_the_layers_it_2_zkkruc.jpg'
    ],
    inventory: [
      { size: 'XS', stock: 10 },
      { size: 'S', stock: 10 },
      { size: 'M', stock: 15 },
      { size: 'L', stock: 0 }
    ],
    inStock: true,
    isVisible: true,
  },
  {
    id: 'p7',
    name: 'Studio Cut Zipper in Coal Dust',
    price: 8249,
    costPrice: 4000,
    category: 'Hoodies',
    description: "Model is 5'11, wearing size M.\n\nThe After Hours studio cut zipper is named for the hours that are yours, wherever you spend them. A clean blank with a considered silhouette, it is made to sit right on the body, feel easy to move in and stay quiet enough for you to be the focus.",
    images: [
      'https://aftermathstore.com/cdn/shop/files/AFTERMATH_ZIPPERSArtboard1copy2.jpg?v=1763332847&width=500',
      'https://aftermathstore.com/cdn/shop/files/AFTERMATH_ZIPPERSArtboard2copy2.jpg?v=1763332847&width=500',
      'https://aftermathstore.com/cdn/shop/files/AFTERMATH_ZIPPERSArtboard3copy2.jpg?v=1763332847&width=500',
      'https://aftermathstore.com/cdn/shop/files/AFTERMATH_ZIPPERSArtboard4copy2.jpg?v=1763332848&width=500'
    ],
    inventory: [
      { size: 'S', stock: 5 },
      { size: 'M', stock: 10 },
      { size: 'L', stock: 5 }
    ],
    inStock: true,
    isVisible: true,
  },
  {
    id: 'p8',
    name: 'Studio Cut Quarter in Coal Dust',
    price: 7999,
    costPrice: 3800,
    category: 'Sweatshirts',
    description: "Model is 5'2, wearing size XS.\n\nThe After Hours studio cut quarter is named for the hours that are yours, wherever you spend them. A clean blank with a considered silhouette, it is made to sit right on the body, feel easy to move in and stay quiet enough for you to be the focus.",
    images: [
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy2.jpg?v=1763591103&width=500',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy2_2.jpg?v=1763591103&width=500',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard3copy2.jpg?v=1763591103&width=500',
      'https://res.cloudinary.com/dacyy7rkn/image/upload/f_auto,q_auto,w_500/v1766840206/The_way_something_is_packed_says_a_lot_about_how_it_was_made._When_care_goes_into_the_layers_it_1_nd9qbu.jpg'
    ],
    inventory: [
      { size: 'XS', stock: 3 },
      { size: 'S', stock: 4 },
      { size: 'M', stock: 5 },
      { size: 'L', stock: 0 }
    ],
    inStock: true,
    isVisible: true,
  }
];

// --- DYNAMIC DATA GENERATOR ---
// This ensures "This Month" always has data regardless of when you run the app.

const TODAY = new Date();
const format = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return format(d);
};

export const MOCK_ORDERS: Order[] = [
  // TODAY / YESTERDAY (Active Orders)
  {
    id: 'ORD-8821',
    customerName: 'Bilal Ahmed',
    customerEmail: 'bilal.ahmed@example.com',
    customerPhone: '+92 300 9876543',
    address: 'House 45, Street 10, F-7/2',
    city: 'Islamabad',
    items: [ { ...MOCK_PRODUCTS[0], selectedSize: 'L', quantity: 1 } ],
    total: 8499,
    status: 'Pending',
    paymentMethod: 'COD',
    date: daysAgo(0),
  },
  {
    id: 'ORD-8820',
    customerName: 'Zainab Malik',
    customerEmail: 'zainab.m@example.com',
    customerPhone: '+92 333 1122334',
    address: 'Apartment 4B, Emaar Coral Towers',
    city: 'Karachi',
    items: [ 
        { ...MOCK_PRODUCTS[2], selectedSize: 'S', quantity: 1 },
        { ...MOCK_PRODUCTS[3], selectedSize: 'M', quantity: 1 }
    ],
    total: 16248,
    status: 'Confirmed',
    paymentMethod: 'BankTransfer',
    date: daysAgo(0),
  },
  {
    id: 'ORD-8819',
    customerName: 'Ahmed Khan', // VIP Customer
    customerEmail: 'ahmed@example.com',
    customerPhone: '+92 300 1234567',
    address: 'House 12, Street 4, DHA Phase 6',
    city: 'Lahore',
    items: [ { ...MOCK_PRODUCTS[1], selectedSize: 'M', quantity: 2 } ],
    total: 15998,
    status: 'Shipped',
    paymentMethod: 'COD',
    date: daysAgo(1),
  },

  // THIS WEEK (Recent Activity)
  {
    id: 'ORD-8815',
    customerName: 'Omar Farooq',
    customerEmail: 'omar.f@example.com',
    customerPhone: '+92 321 5556677',
    address: 'Plot 22, Valencia Town',
    city: 'Lahore',
    items: [ { ...MOCK_PRODUCTS[0], selectedSize: 'XL', quantity: 1 } ],
    total: 8499,
    status: 'Delivered',
    paymentMethod: 'COD',
    date: daysAgo(3),
  },
  {
    id: 'ORD-8812',
    customerName: 'Sara Ali', // Recurring
    customerEmail: 'sara@example.com',
    customerPhone: '+92 321 9876543',
    address: 'Flat 4B, Askari 11',
    city: 'Lahore',
    items: [ { ...MOCK_PRODUCTS[3], selectedSize: 'S', quantity: 1 } ],
    total: 7999,
    status: 'Delivered',
    paymentMethod: 'BankTransfer',
    date: daysAgo(5),
  },

  // LAST WEEK / THIS MONTH (Returns & Issues)
  // Intentional Return Logic: "Studio Cut Hoodie" Size M is frequently returned
  {
    id: 'ORD-8805',
    customerName: 'Hassan Raza',
    customerEmail: 'hassan.r@example.com',
    customerPhone: '+92 301 4455667',
    address: 'House 88, Model Town',
    city: 'Lahore',
    items: [ { ...MOCK_PRODUCTS[0], selectedSize: 'M', quantity: 1 } ], // Return Item
    total: 8499,
    status: 'Cancelled', // Returned
    paymentMethod: 'COD',
    date: daysAgo(12),
  },
  {
    id: 'ORD-8801',
    customerName: 'Usman Qureshi',
    customerEmail: 'usman.q@example.com',
    customerPhone: '+92 345 6677889',
    address: 'St 5, Clifton Block 4',
    city: 'Karachi',
    items: [ { ...MOCK_PRODUCTS[0], selectedSize: 'M', quantity: 1 } ], // Return Item 2
    total: 8499,
    status: 'Cancelled',
    paymentMethod: 'COD',
    date: daysAgo(15),
  },

  // LAST MONTH (Historical Data for Trends)
  {
    id: 'ORD-8750',
    customerName: 'Ahmed Khan', // Repeat Purchase
    customerEmail: 'ahmed@example.com',
    customerPhone: '+92 300 1234567',
    address: 'House 12, Street 4, DHA Phase 6',
    city: 'Lahore',
    items: [ { ...MOCK_PRODUCTS[2], selectedSize: 'L', quantity: 1 } ],
    total: 8249,
    status: 'Delivered',
    paymentMethod: 'BankTransfer',
    date: daysAgo(35),
  },
  {
    id: 'ORD-8742',
    customerName: 'Ayesha Siddiqui',
    customerEmail: 'ayesha.s@example.com',
    customerPhone: '+92 333 9988776',
    address: 'Sector G-11/3',
    city: 'Islamabad',
    items: [ { ...MOCK_PRODUCTS[1], selectedSize: 'XS', quantity: 1 } ],
    total: 7999,
    status: 'Delivered',
    paymentMethod: 'COD',
    date: daysAgo(40),
  },
  {
    id: 'ORD-8730',
    customerName: 'Fahad Mustafa',
    customerEmail: 'fahad.m@example.com',
    customerPhone: '+92 300 1122998',
    address: 'Canal Road',
    city: 'Faisalabad',
    items: [ 
        { ...MOCK_PRODUCTS[0], selectedSize: 'L', quantity: 2 },
        { ...MOCK_PRODUCTS[3], selectedSize: 'L', quantity: 1 }
    ],
    total: 24997,
    status: 'Delivered',
    paymentMethod: 'BankTransfer',
    date: daysAgo(42),
  },
];

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: 'The Architecture of Silence',
    excerpt: 'Exploring the quiet spaces between noise and how our environment shapes our internal rhythm.',
    content: "# The Architecture of Silence\n\nIn a world that shouts, silence is an architectural choice. It is not an absence, but a presence.\n\nWe often think of minimalism as a subtraction. Taking things away until nothing is left. But true minimalism is about *focus*. It is about removing the noise so that the signal can be heard.\n\n## Structure & Form\n\nJust as a building needs a strong foundation, our wardrobe needs a structure that supports our life, not complicates it.\n\n> \"The clothes are there to move with you while you read, make, reset, or simply sit.\"\n\nHere is how we breakdown the core elements of a quiet wardrobe:\n\n1.  **Texture:** The feel of the fabric against the skin.\n2.  **Silhouette:** The shape it creates in space.\n3.  **Utility:** The function it serves.\n\n![Studio Texture](https://aftermathstore.com/cdn/shop/files/blog_p_aftermathArtboard_1.jpg?v=1763682128&width=800)\n\n## The Mathematics of Calm\n\nThere is a ratio to relaxation. A balance between effort and ease. \n\n$$\n\\text{Stillness} = \\frac{\\text{Internal Rhythm}}{\\text{External Noise}}\n$$\n\nWhen we reduce the external variables (fast fashion, trends, clutter), the internal value increases.",
    coverImage: 'https://cdn.shopify.com/s/files/1/0944/5933/0923/files/blog_p_aftermathArtboard_3_600x600.jpg?v=1763682137',
    author: 'Aftermath Editorial',
    date: '2023-11-01',
    readTime: '3 min read',
    tags: ['Philosophy', 'Design', 'Slow Living'],
    isPublished: true,
  },
  {
    id: '2',
    title: 'Fabric as a Second Skin',
    excerpt: 'Why we chose 500 GSM French Terry for our Studio Collection. A deep dive into material science.',
    content: "# Fabric as a Second Skin\n\nWhy does weight matter? \n\nWhen we selected the 500 GSM French Terry for the Studio Collection, it wasn't just about durability. It was about **proprioception**—the body's ability to sense itself.\n\nA heavier fabric provides a grounding effect. It holds its shape, creating a distinct boundary between you and the world.\n\n## Material Breakdown\n\n| Property | Studio Fleece | Standard Fleece |\n| :--- | :--- | :--- |\n| **Weight** | 500 GSM | 280-320 GSM |\n| **Structure** | High | Low/Drapey |\n| **Warmth** | High | Medium |\n| **Longevity** | 5+ Years | 1-2 Years |\n\nWe don't design for a season. We design for a lifetime.",
    coverImage: 'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy5.jpg?v=1763585095&width=800',
    author: 'Production Team',
    date: '2023-11-10',
    readTime: '4 min read',
    tags: ['Materials', 'Production'],
    isPublished: true,
  }
];

export const MOCK_CUSTOMERS: Customer[] = [
  {
    id: 'CUST-001',
    name: 'Ahmed Khan',
    email: 'ahmed@example.com',
    phone: '+923001234567',
    address: 'House 12, Street 4, DHA Phase 6',
    city: 'Lahore',
    ordersCount: 8, // VIP status
    totalSpend: 125000,
    lastOrderDate: daysAgo(1),
    joinedDate: '2023-01-10',
    isDHA: true,
  },
  {
    id: 'CUST-002',
    name: 'Sara Ali',
    email: 'sara@example.com',
    phone: '+923219876543',
    address: 'Flat 4B, Askari 11',
    city: 'Lahore',
    ordersCount: 4, // Regular
    totalSpend: 32496,
    lastOrderDate: daysAgo(5),
    joinedDate: '2023-09-01',
    isDHA: false,
  },
  {
    id: 'CUST-003',
    name: 'Zainab Malik',
    email: 'zainab.m@example.com',
    phone: '+923331122334',
    address: 'Apartment 4B, Emaar',
    city: 'Karachi',
    ordersCount: 1, // New
    totalSpend: 16248,
    lastOrderDate: daysAgo(0),
    joinedDate: daysAgo(0),
    isDHA: true,
  },
  {
    id: 'CUST-004',
    name: 'Hassan Raza',
    email: 'hassan.r@example.com',
    phone: '+923014455667',
    address: 'House 88, Model Town',
    city: 'Lahore',
    ordersCount: 1, // Churned candidate if date is old, here implies recent bad experience (return)
    totalSpend: 8499,
    lastOrderDate: daysAgo(12),
    joinedDate: daysAgo(12),
    isDHA: false,
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    productId: 'p1',
    userName: 'Hassan R.',
    rating: 5,
    comment: 'The quality is unmatched. The 500 GSM fleece feels incredibly premium.',
    date: '2023-11-15'
  },
  {
    id: 'r2',
    productId: 'p1',
    userName: 'Bilal K.',
    rating: 5,
    comment: 'Perfect boxy fit. Worth every penny.',
    date: '2023-11-18'
  },
  {
    id: 'r3',
    productId: 'p1',
    userName: 'Zain A.',
    rating: 4,
    comment: 'Sleeves are a bit long but I like the aesthetic.',
    date: '2023-11-20'
  },
  {
    id: 'r4',
    productId: 'p6',
    userName: 'Sara M.',
    rating: 5,
    comment: 'The color is exactly as shown. So soft!',
    date: '2023-11-22'
  }
];
