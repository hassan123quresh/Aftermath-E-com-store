import { Product, PromoCode, Order, BlogPost, Customer } from './types';

export const INITIAL_ANNOUNCEMENT = "FREE SHIPPING ALL OVER PAKISTAN";

export const INITIAL_PROMOS: PromoCode[] = [
  { code: 'WELCOME10', discountPercentage: 10, usageLimit: -1, usedCount: 12, isActive: true },
  { code: 'SILENCE', discountPercentage: 20, usageLimit: 50, usedCount: 45, isActive: true },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Studio Cut Hoodie in Burnt Terra',
    price: 8499,
    category: 'Hoodies',
    description: "Model is 5'11, wearing size M.\n\nThe After Hours studio cut hoodie is named for the hours that are yours, wherever you spend them. A clean blank with a considered silhouette, it is made to sit right on the body, feel easy to move in and stay quiet enough for you to be the focus.\n\n*   Relaxed oversized fit with voluminous sleeves\n*   True to size\n*   500 GSM cotton fleece\n*   Soft brushed interior with a structured outer feel\n*   Ribbed cuffs and hem for a clean finish\n\n| SIZE | XS | S | M | L |\n| :--- | :---: | :---: | :---: | :---: |\n| BODY LENGTH | 25 | 26 | 27 | 28 |\n| CHEST | 27 | 28 | 29 | 30 |\n| SLEEVE | 18.5 | 19 | 19.5 | 20 |\n| SHOULDER | 27.5 | 28.5 | 29.5 | 30.5 |\n| ARM HOLE | 11.5 | 12 | 12.5 | 13 |",
    images: [
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy5.jpg?v=1763585095&width=800',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy5_2.jpg?v=1763585095&width=800',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard2copy4.jpg?v=1763585095&width=800',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard3copy5_8a6af684-d339-4b6a-b182-98dc5453ae4e.jpg?v=1763585095&width=800',
      'https://res.cloudinary.com/dacyy7rkn/image/upload/v1766840067/The_way_something_is_packed_says_a_lot_about_how_it_was_made._When_care_goes_into_the_layers_it_wmbq5a.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'p6',
    name: 'Studio Cut Quarter in Cloud Dancer',
    price: 7999,
    category: 'Sweatshirts',
    description: "Model is 5'2, wearing size XS.\n\nThe After Hours studio cut quarter is named for the hours that are yours, wherever you spend them. A clean blank with a considered silhouette, it is made to sit right on the body, feel easy to move in and stay quiet enough for you to be the focus.\n\n*   Relaxed oversized fit with voluminous sleeves\n*   True to size\n*   500 GSM cotton fleece\n*   Soft brushed interior with a structured outer feel\n*   Ribbed cuffs and hem for a clean finish",
    images: [
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1_7a132423-3efa-4f07-bcca-69ba437b394e.jpg?v=1763591134&width=800',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy_1ca85ebc-9107-439c-9c50-f3bb58d37ecb.jpg?v=1763591134&width=800',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard3copy3_fb280b84-80e9-42ea-94a7-1fc5eb48a131.jpg?v=1763591134&width=800',
      'https://res.cloudinary.com/dacyy7rkn/image/upload/v1766840208/The_way_something_is_packed_says_a_lot_about_how_it_was_made._When_care_goes_into_the_layers_it_2_zkkruc.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'p7',
    name: 'Studio Cut Zipper in Coal Dust',
    price: 8249,
    category: 'Hoodies',
    description: "Model is 5'11, wearing size M.\n\nThe After Hours studio cut zipper is named for the hours that are yours, wherever you spend them. A clean blank with a considered silhouette, it is made to sit right on the body, feel easy to move in and stay quiet enough for you to be the focus.\n\n*   Relaxed oversized fit with voluminous sleeves\n*   True to size\n*   500 GSM cotton fleece\n*   Soft brushed interior with a structured outer feel\n*   Ribbed cuffs and hem for a clean finish",
    images: [
      'https://aftermathstore.com/cdn/shop/files/AFTERMATH_ZIPPERSArtboard1copy2.jpg?v=1763332847&width=800',
      'https://aftermathstore.com/cdn/shop/files/AFTERMATH_ZIPPERSArtboard2copy2.jpg?v=1763332847&width=800',
      'https://aftermathstore.com/cdn/shop/files/AFTERMATH_ZIPPERSArtboard3copy2.jpg?v=1763332847&width=800',
      'https://aftermathstore.com/cdn/shop/files/AFTERMATH_ZIPPERSArtboard4copy2.jpg?v=1763332848&width=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    inStock: true,
  },
  {
    id: 'p8',
    name: 'Studio Cut Quarter in Coal Dust',
    price: 7999,
    category: 'Sweatshirts',
    description: "Model is 5'2, wearing size XS.\n\nThe After Hours studio cut quarter is named for the hours that are yours, wherever you spend them. A clean blank with a considered silhouette, it is made to sit right on the body, feel easy to move in and stay quiet enough for you to be the focus.\n\n*   Relaxed oversized fit with voluminous sleeves\n*   True to size\n*   500 GSM cotton fleece\n*   Soft brushed interior with a structured outer feel\n*   Ribbed cuffs and hem for a clean finish",
    images: [
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy2.jpg?v=1763591103&width=800',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard1copy2_2.jpg?v=1763591103&width=800',
      'https://aftermathstore.com/cdn/shop/files/STUDIO_CUT_AND_STUDIO_QUARTERArtboard3copy2.jpg?v=1763591103&width=800',
      'https://res.cloudinary.com/dacyy7rkn/image/upload/v1766840206/The_way_something_is_packed_says_a_lot_about_how_it_was_made._When_care_goes_into_the_layers_it_1_nd9qbu.jpg'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
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
    total: 8499,
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
      { ...MOCK_PRODUCTS[1], selectedSize: 'S', quantity: 1 },
      { ...MOCK_PRODUCTS[2], selectedSize: 'S', quantity: 2 }

    ],
    total: 24497,
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
       { ...MOCK_PRODUCTS[3], selectedSize: 'L', quantity: 1 }
    ],
    total: 7999,
    status: 'Shipped',
    paymentMethod: 'COD',
    date: '2023-10-26',
  }
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
    ordersCount: 5,
    totalSpend: 54000,
    lastOrderDate: '2023-10-15',
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
    ordersCount: 2,
    totalSpend: 24497,
    lastOrderDate: '2023-10-25',
    joinedDate: '2023-09-01',
    isDHA: false,
  },
  {
    id: 'CUST-003',
    name: 'Zainab Bibi',
    email: 'zainab@example.com',
    phone: '+923335555555',
    address: 'Sector F-7/2',
    city: 'Islamabad',
    ordersCount: 1,
    totalSpend: 7999,
    lastOrderDate: '2023-10-26',
    joinedDate: '2023-10-26',
    isDHA: false,
  }
];