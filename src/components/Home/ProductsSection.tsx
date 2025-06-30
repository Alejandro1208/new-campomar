// src/components/Home/ProductsSection.tsx (CON EL NUEVO DISEÑO)

import { useState } from 'react';
import { useProducts, useCategories } from '../../hooks/useData';

export default function ProductsSection() {
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter(product => product.category_id === selectedCategory)
    : products;

  if (productsLoading || categoriesLoading) {
    return (
      <section id="productos" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6">Nuestros Productos</h2>
          <p>Cargando...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="productos" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-primary mb-6">Productos</h2>
          <div className="w-24 h-1 bg-accent mx-auto"></div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
              selectedCategory === null
                ? 'bg-primary text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* --- NUEVA CUADRÍCULA DE PRODUCTOS --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="text-center flex flex-col items-center group"
            >
              <div className="h-24 w-full flex items-center justify-center mb-4">
                <img
                  src={`https://alejandrosabater.com.ar${product.logo_image_url}`}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="h-px w-1/4 bg-gray-200 my-2"></div>
              <p className="text-gray-600 text-sm leading-relaxed mt-2">
                {product.description}
              </p>
            </div>
          ))}
        </div>
        {/* --- FIN DE LA NUEVA CUADRÍCULA --- */}

        {filteredProducts.length === 0 && !productsLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              No se encontraron productos en esta categoría.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}