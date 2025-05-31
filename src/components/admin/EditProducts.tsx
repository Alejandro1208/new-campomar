import React, { useState, useEffect, ChangeEvent } from 'react';
import { useWebsiteStore } from '../../store/useWebsiteStore';
import { Product, ProductCategory } // Asegúrate que Image no se importe aquí si no se usa directamente
from '../../types';
import { Plus, Trash, Edit, X } from 'lucide-react';
import { databaseService } from '../../services/databaseService';

// Definición del tipo para los datos del formulario de producto
interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  logo: string; // Almacenará la RUTA del archivo del logo devuelta por el backend
  category_id: string;
}

const EditProducts: React.FC = () => {
  const { products, productCategories, addProduct, updateProduct, removeProduct } = useWebsiteStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFormData, setProductFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    logo: '', // Inicialmente vacío o con la ruta existente si se edita
    category_id: '',
  });

  const [selectedLogoFile, setSelectedLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null); // Para la vista previa local
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Cargar datos del producto en el formulario cuando se edita
  useEffect(() => {
    if (editingProduct) {
      setProductFormData({
        id: editingProduct.id,
        name: editingProduct.name,
        description: editingProduct.description,
        logo: editingProduct.logo, // Esta será la ruta guardada, ej. /uploads/product_logos/logo.png
        category_id: editingProduct.category_id,
      });
      // Mostrar el logo actual si existe
      if (editingProduct.logo) {
        setLogoPreview(`http://localhost:3001${editingProduct.logo}`);
      } else {
        setLogoPreview(null);
      }
    } else {
      // Resetear formulario para nuevo producto
      setProductFormData({
        name: '',
        description: '',
        logo: '',
        category_id: productCategories.length > 0 ? productCategories[0].id : '', // Default a la primera categoría
      });
      setLogoPreview(null);
    }
    setSelectedLogoFile(null); // Siempre limpiar el archivo seleccionado al abrir/cambiar modal
    setUploadError(null);
  }, [editingProduct, isModalOpen, productCategories]);


  const handleFormChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductFormData({ ...productFormData, [e.target.name]: e.target.value });
  };

  const handleLogoFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedLogoFile(file);
      setUploadError(null);
      // Crear una URL local para la vista previa inmediata
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      // No es necesario limpiar productFormData.logo aquí, se actualizará al subir y guardar.
    } else {
      setSelectedLogoFile(null);
      // Si se deselecciona un archivo, y estamos editando, restaurar la vista previa al logo existente
      if (editingProduct && editingProduct.logo) {
        setLogoPreview(`http://localhost:3001${editingProduct.logo}`);
      } else {
        setLogoPreview(null);
      }
    }
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.category_id) {
      alert("Nombre y categoría son obligatorios.");
      return;
    }

    let logoPathToSave = productFormData.logo; // Usar logo existente o el que ya se subió y está en productFormData

    // Si se seleccionó un *nuevo* archivo, subirlo ahora
    if (selectedLogoFile) {
      setIsUploadingLogo(true);
      setUploadError(null);
      try {
        const uploadResponse = await databaseService.uploadProductLogoFile(selectedLogoFile);
        logoPathToSave = uploadResponse.filePath; // Actualizar con la ruta del archivo recién subido
      } catch (error: any) {
        console.error("Error al subir el logo:", error);
        setUploadError(error.message || "Error al subir el logo.");
        setIsUploadingLogo(false);
        return; // Detener el guardado del producto si la subida del logo falla
      } finally {
        setIsUploadingLogo(false);
      }
    }

    const finalDataToSend: ProductFormData = {
      ...productFormData,
      logo: logoPathToSave, // Este es el string de la ruta que se guarda en la BD
    };
    
    // Quitar el id si es un producto nuevo para que Omit<Product, 'id'> funcione
    const productPayload = editingProduct ? finalDataToSend as Product : { name: finalDataToSend.name, description: finalDataToSend.description, logo: finalDataToSend.logo, category_id: finalDataToSend.category_id } as Omit<Product, 'id'>;


    try {
      if (editingProduct && editingProduct.id) {
        await updateProduct(editingProduct.id, productPayload as Product);
      } else {
        await addProduct(productPayload as Omit<Product, 'id'>);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      alert("Error al guardar el producto. Revisa la consola para más detalles.");
    }
  };
  
  const openModalToEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const openModalToAdd = () => {
    setEditingProduct(null); // Asegura que no estamos editando
    // Resetea el formulario aquí también, similar a como lo haces en useEffect si es necesario
    setProductFormData({
        name: '',
        description: '',
        logo: '',
        category_id: productCategories.length > 0 ? productCategories[0].id : '',
    });
    setLogoPreview(null);
    setSelectedLogoFile(null);
    setUploadError(null);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Administrar Productos</h1>
        <button
          onClick={openModalToAdd}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
        >
          <Plus size={18} className="mr-2" /> Añadir Producto
        </button>
      </div>

      {/* Tabla de Productos */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Logo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {product.logo && (
                    <img 
                        src={`http://localhost:3001${product.logo}`} 
                        alt={product.name} 
                        className="h-10 w-10 object-contain rounded" 
                    />
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">{product.description}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {productCategories.find(cat => cat.id === product.category_id)?.name || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button onClick={() => openModalToEdit(product)} className="text-indigo-600 hover:text-indigo-900"><Edit size={18}/></button>
                  <button onClick={async () => {
                                if (window.confirm(`¿Seguro que quieres eliminar ${product.name}?`)) {
                                    await removeProduct(product.id);
                                }
                            }} className="text-red-600 hover:text-red-900"><Trash size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para Añadir/Editar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 transition-opacity flex justify-center items-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg transform transition-all">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                    {editingProduct ? 'Editar Producto' : 'Añadir Nuevo Producto'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
            </div>
            <form onSubmit={handleSubmitProduct} className="space-y-4">
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">Nombre del Producto</label>
                <input type="text" name="name" id="productName" value={productFormData.name} onChange={handleFormChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label htmlFor="productDescription" className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea name="description" id="productDescription" value={productFormData.description} onChange={handleFormChange} rows={3} className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>
              <div>
                <label htmlFor="productcategory_id" className="block text-sm font-medium text-gray-700">Categoría</label>
                <select name="category_id" id="productcategory_id" value={productFormData.category_id} onChange={handleFormChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                  <option value="" disabled>-- Selecciona Categoría --</option>
                  {productCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="productLogoFile" className="block text-sm font-medium text-gray-700">Logo del Producto</label>
                <input 
                  type="file" 
                  id="productLogoFile" 
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleLogoFileChange}
                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {logoPreview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">Vista previa del nuevo logo:</p>
                    <img src={logoPreview} alt="Vista previa" className="mt-1 h-24 w-24 object-contain border p-1 rounded"/>
                  </div>
                )}
                {!selectedLogoFile && editingProduct?.logo && !logoPreview && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">Logo actual:</p>
                    <img src={`http://localhost:3001${editingProduct.logo}`} alt="Logo actual" className="mt-1 h-24 w-24 object-contain border p-1 rounded"/>
                  </div>
                )}
                {uploadError && <p className="text-xs text-red-500 mt-2">{uploadError}</p>}
              </div>
              <div className="pt-2 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50">Cancelar</button>
                <button type="submit" disabled={isUploadingLogo} className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 ${isUploadingLogo ? 'cursor-not-allowed' : ''}`}>
                  {isUploadingLogo ? 'Guardando...' : (editingProduct ? 'Actualizar Producto' : 'Crear Producto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProducts;