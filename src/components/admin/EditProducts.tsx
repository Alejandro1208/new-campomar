import React, { useState } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Product, ProductCategory } from '../../types';
import { Plus, Trash, Edit, Check, X, FileImage, Tag } from 'lucide-react';

const EditProducts: React.FC = () => {
  const { products, productCategories, addProduct, removeProduct, updateProduct, addProductCategory, removeProductCategory } = useWebsiteStore();
  
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    logo: '',
    description: '',
    categoryId: '2', // Default to first category
  });
  
  const [newCategory, setNewCategory] = useState<Partial<ProductCategory>>({
    name: '',
  });

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.logo && newProduct.description && newProduct.categoryId) {
      addProduct({
        id: Date.now().toString(),
        name: newProduct.name,
        logo: newProduct.logo,
        description: newProduct.description,
        categoryId: newProduct.categoryId,
      });
      setNewProduct({
        name: '',
        logo: '',
        description: '',
        categoryId: '2',
      });
      setIsAddingProduct(false);
    }
  };

  const handleUpdateProduct = () => {
    if (editingProduct && editingProduct.name && editingProduct.logo && editingProduct.description) {
      updateProduct(editingProduct.id, editingProduct);
      setEditingProduct(null);
    }
  };

  const handleAddCategory = () => {
    if (newCategory.name) {
      addProductCategory({
        id: Date.now().toString(),
        name: newCategory.name,
      });
      setNewCategory({ name: '' });
      setIsAddingCategory(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Products</h1>
      
      {/* Categories Management */}
      <div className="bg-white rounded-2xl shadow-custom p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Categories</h2>
          <button
            onClick={() => setIsAddingCategory(true)}
            className="flex items-center px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-400 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Category</span>
          </button>
        </div>
        
        {isAddingCategory ? (
          <div className="p-4 border border-gray-200 rounded-lg mb-4">
            <div className="mb-3">
              <label className="block text-gray-700 mb-1">Category Name</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingCategory(false)}
                className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400 transition-colors duration-200"
              >
                Add
              </button>
            </div>
          </div>
        ) : null}
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {productCategories.slice(1).map((category) => (
            <div key={category.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-primary-500" />
                <span>{category.name}</span>
              </div>
              <button
                onClick={() => removeProductCategory(category.id)}
                className="text-red-500 hover:text-red-700 transition-colors duration-200"
              >
                <Trash className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Products Management */}
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Products</h2>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="flex items-center px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-400 transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-1" />
            <span>Add Product</span>
          </button>
        </div>
        
        {isAddingProduct ? (
          <div className="p-4 border border-gray-200 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-1">Product Name</label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  value={newProduct.logo}
                  onChange={(e) => setNewProduct({ ...newProduct, logo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                  value={newProduct.categoryId}
                  onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {productCategories.slice(1).map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsAddingProduct(false)}
                className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400 transition-colors duration-200"
              >
                Add Product
              </button>
            </div>
          </div>
        ) : null}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border border-gray-200 rounded-xl p-4">
              {editingProduct?.id === product.id ? (
                <>
                  <div className="grid grid-cols-1 gap-3 mb-3">
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm">Name</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm">Logo URL</label>
                      <input
                        type="text"
                        value={editingProduct.logo}
                        onChange={(e) => setEditingProduct({ ...editingProduct, logo: e.target.value })}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm">Category</label>
                      <select
                        value={editingProduct.categoryId}
                        onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        {productCategories.slice(1).map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 mb-1 text-sm">Description</label>
                      <input
                        type="text"
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        className="w-full px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="p-1 rounded-full text-gray-500 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleUpdateProduct}
                      className="p-1 rounded-full text-green-600 hover:bg-green-100 transition-colors duration-200"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <img src={product.logo} alt={product.name} className="w-10 h-10 object-contain mr-3" />
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-gray-600">{productCategories.find(c => c.id === product.categoryId)?.name}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => setEditingProduct(product)}
                        className="p-1 rounded-full text-blue-600 hover:bg-blue-100 transition-colors duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeProduct(product.id)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-100 transition-colors duration-200"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600">{product.description}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EditProducts;