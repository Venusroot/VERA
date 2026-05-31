/**
 * BANCO DE DADOS DE PRODUTOS - VERA
 * Estrutura centralizada de dados para o marketplace
 * Preparado para futura integração com backend
 */

const PRODUCTS_DATABASE = [
  {
    id: 'product-001',
    title: 'Solitário Eclat',
    price: 12500,
    priceFormatted: 'R$ 12.500',
    description: 'Uma peça criada para eternizar momentos únicos com acabamento refinado em ouro 18k.',
    category: 'noivado',
    metal: 'ouro-amarelo',
    images: ['assets/images/anel_01.jpg', 'assets/images/anel_02.jpg', 'assets/images/anel_03.jpg'],
    rating: 4.8,
    reviews: 24
  },
  {
    id: 'product-002',
    title: 'Aliança Infinita',
    price: 8900,
    priceFormatted: 'R$ 8.900',
    description: 'Aliança em ouro branco com design minimalista e sofisticado. Perfeita para casamentos contemporâneos.',
    category: 'casamento',
    metal: 'ouro-branco',
    images: ['assets/images/anel_04.jpg', 'assets/images/anel_05.jpg', 'assets/images/anel_06.jpg'],
    rating: 4.9,
    reviews: 18
  },
  {
    id: 'product-003',
    title: 'Anel Diamante Premium',
    price: 15800,
    priceFormatted: 'R$ 15.800',
    description: 'Anel com diamante certificado em ouro rosé. Elegância que transcende o tempo.',
    category: 'noivado',
    metal: 'ouro-rose',
    images: ['assets/images/anel_07.jpg', 'assets/images/anel_08.jpg'],
    rating: 5.0,
    reviews: 32
  },
  {
    id: 'product-004',
    title: 'Aliança Namoro Premium',
    price: 3500,
    priceFormatted: 'R$ 3.500',
    description: 'Aliança elegante em ouro amarelo para momentos especiais. Gravação personalizada disponível.',
    category: 'namoro',
    metal: 'ouro-amarelo',
    images: ['assets/images/anel_09.jpg', 'assets/images/anel_10.jpg'],
    rating: 4.7,
    reviews: 15
  },
  {
    id: 'product-005',
    title: 'Anel Platina Classico',
    price: 18900,
    priceFormatted: 'R$ 18.900',
    description: 'Anel em platina 950 com acabamento espelhado. Exclusividade e durabilidade garantidas.',
    category: 'noivado',
    metal: 'platina',
    images: ['assets/images/anel_01.jpg', 'assets/images/anel_03.jpg'],
    rating: 4.6,
    reviews: 22
  },
  {
    id: 'product-006',
    title: 'Aliança Casamento Ouro Rosa',
    price: 7200,
    priceFormatted: 'R$ 7.200',
    description: 'Aliança em ouro rosé 18k com acabamento polido. Símbolo perfeito de união e amor.',
    category: 'casamento',
    metal: 'ouro-rose',
    images: ['assets/images/anel_05.jpg', 'assets/images/anel_06.jpg'],
    rating: 4.8,
    reviews: 19
  },
  {
    id: 'product-007',
    title: 'Crystal Necklace',
    price: 1490,
    priceFormatted: 'R$ 1.490',
    description: 'Luxo contemporâneo em pendente. Acabamento em ouro com cristais Swarovski.',
    category: 'namoro',
    metal: 'ouro-amarelo',
    images: ['assets/images/anel_06.jpg', 'assets/images/anel_07.jpg'],
    rating: 4.5,
    reviews: 8
  },
  {
    id: 'product-008',
    title: 'Anel Noivado Branco',
    price: 13200,
    priceFormatted: 'R$ 13.200',
    description: 'Anel de noivado em ouro branco com diamante natural. Certificado de autenticidade incluído.',
    category: 'noivado',
    metal: 'ouro-branco',
    images: ['assets/images/anel_02.jpg', 'assets/images/anel_04.jpg'],
    rating: 4.9,
    reviews: 28
  },
  {
    id: 'product-009',
    title: 'Aliança Elegância',
    price: 5600,
    priceFormatted: 'R$ 5.600',
    description: 'Aliança em ouro amarelo com friso fosco. Design moderno para casais contemporâneos.',
    category: 'casamento',
    metal: 'ouro-amarelo',
    images: ['assets/images/anel_08.jpg', 'assets/images/anel_09.jpg'],
    rating: 4.6,
    reviews: 12
  },
  {
    id: 'product-010',
    title: 'Anel Solitário Brilho',
    price: 9800,
    priceFormatted: 'R$ 9.800',
    description: 'Anel solitário em ouro rosé com diamante VS1. Brilho inesquecível.',
    category: 'noivado',
    metal: 'ouro-rose',
    images: ['assets/images/anel_10.jpg', 'assets/images/anel_01.jpg'],
    rating: 4.7,
    reviews: 16
  }
];

/**
 * Obtém um produto pelo ID
 * @param {string} productId - ID do produto
 * @returns {object|null} Objeto do produto ou null
 */
function getProductById(productId) {
  return PRODUCTS_DATABASE.find(product => product.id === productId) || null;
}

/**
 * Obtém todos os produtos
 * @returns {array} Array de produtos
 */
function getAllProducts() {
  return PRODUCTS_DATABASE;
}

/**
 * Filtra produtos por categoria
 * @param {string} category - Categoria a filtrar
 * @returns {array} Array de produtos filtrados
 */
function getProductsByCategory(category) {
  return PRODUCTS_DATABASE.filter(product => product.category === category);
}

/**
 * Filtra produtos por metal
 * @param {string} metal - Metal a filtrar
 * @returns {array} Array de produtos filtrados
 */
function getProductsByMetal(metal) {
  return PRODUCTS_DATABASE.filter(product => product.metal === metal);
}

/**
 * Busca produtos por nome/descrição
 * @param {string} query - Termo de busca
 * @returns {array} Array de produtos correspondentes
 */
function searchProducts(query) {
  const lowerQuery = query.toLowerCase();
  return PRODUCTS_DATABASE.filter(product =>
    product.title.toLowerCase().includes(lowerQuery) ||
    product.description.toLowerCase().includes(lowerQuery)
  );
}
