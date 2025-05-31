import React, { useState } from 'react';
import { useWebsiteStore } from '../store/useWebsiteStore';

const Products: React.FC = () => {
  const { products, productCategories } = useWebsiteStore();
  const [activeCategory, setActiveCategory] = useState('1'); // Default to "All" category

  const filteredProducts = activeCategory === '1' 
    ? products 
    : products.filter(product => product.category_id === activeCategory);

  return (
    <section id="products" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-primary-500 mb-12">Our Products</h2>
        
        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {productCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                activeCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredProducts.map((product) => (
            <div 
              key={product.id}
              className="bg-white rounded-2xl shadow-custom hover:shadow-hover transition-all duration-300 p-4 flex flex-col items-center text-center"
            >
              <img 
                src={`http://localhost:3001${product.logo}`} 
                alt={product.name} 
                className="w-20 h-20 object-contain mb-4"
              />
              <h3 className="font-medium text-primary-500 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;