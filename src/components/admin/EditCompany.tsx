import React, { useState, useEffect, ChangeEvent } from "react"; // Añade ChangeEvent
import { useWebsiteStore } from "../../store/useWebsiteStore";
import { CompanyInfo, Image as CompanyImage } from "../../types"; // Asegúrate de importar Image y renómbrala si es necesario
import { Plus, Trash, Edit, Check, X, Image as ImageIcon } from "lucide-react"; // Renombraste Image a ImageIcon
import { databaseService } from "../../services/databaseService"; // <--- IMPORTANTE: Importa el servicio

const EditCompany: React.FC = () => {
    const { companyInfo, updateCompanyInfo } = useWebsiteStore((state) => ({
        companyInfo: state.companyInfo,
        updateCompanyInfo: state.updateCompanyInfo,
    }));

    const [formData, setFormData] = useState<Partial<CompanyInfo>>(companyInfo);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [isEditingDescription, setIsEditingDescription] = useState(false);
    const [editedTitle, setEditedTitle] = useState(companyInfo.title);
    const [editedDescription, setEditedDescription] = useState(
        companyInfo.description
    );

    // Para el manejo de la nueva imagen a subir
    const [isAddingImage, setIsAddingImage] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [newImageAlt, setNewImageAlt] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    useEffect(() => {
        setFormData(companyInfo);
        setEditedTitle(companyInfo.title);
        setEditedDescription(companyInfo.description);
    }, [companyInfo]);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setSelectedFile(event.target.files[0]);
            setUploadError(null); // Limpiar errores previos
        }
    };

    const handleSaveTitle = async () => {
        if (typeof updateCompanyInfo === "function") {
            await updateCompanyInfo({ title: editedTitle });
            setIsEditingTitle(false);
        } else {
            console.error(
                "updateCompanyInfo no es una función en handleSaveTitle"
            );
        }
    };

    const handleSaveDescription = async () => {
        if (typeof updateCompanyInfo === "function") {
            await updateCompanyInfo({ description: editedDescription });
            setIsEditingDescription(false);
        } else {
            console.error(
                "updateCompanyInfo no es una función en handleSaveDescription"
            );
        }
    };

    const handleUploadAndAddImage = async () => {
        if (!selectedFile) {
            setUploadError("Por favor, selecciona un archivo de imagen.");
            return;
        }
        if (!newImageAlt.trim()) {
            setUploadError(
                "Por favor, ingresa una descripción (texto alternativo) para la imagen."
            );
            return;
        }
        if ((companyInfo.images?.length || 0) >= 4) {
            setUploadError("Ya has alcanzado el límite de 4 imágenes.");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const uploadResponse = await databaseService.uploadCompanyImageFile(
                selectedFile
            );
            // uploadResponse.filePath es algo como '/uploads/company_images/imagen-123.png'

            const newImageEntry: CompanyImage = {
                id: Date.now().toString(), // ID temporal para el frontend, o puedes usar uno del backend si lo devuelve
                src: uploadResponse.filePath, // Usamos la ruta relativa devuelta por el backend
                alt: newImageAlt,
            };

            const currentImages = companyInfo.images || [];
            const newImagesArray = [...currentImages, newImageEntry];

            if (typeof updateCompanyInfo === "function") {
                await updateCompanyInfo({ images: newImagesArray }); // Actualiza companyInfo con el nuevo array de imágenes
                // Resetear campos del formulario de imagen
                setSelectedFile(null);
                setNewImageAlt("");
                setIsAddingImage(false);
            } else {
                console.error(
                    "updateCompanyInfo no es una función en handleUploadAndAddImage"
                );
                setUploadError(
                    "Error al contactar el store para guardar la información de la imagen."
                );
            }
        } catch (error: any) {
            console.error("Error al subir la imagen:", error);
            setUploadError(
                error.message || "Ocurrió un error al subir la imagen."
            );
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = async (id: string) => {
        const currentImages = companyInfo.images || [];
        const newImages = currentImages.filter((img) => img.id !== id);
        // Aquí también podrías querer borrar el archivo del servidor, lo cual requeriría otro endpoint en el backend.
        // Por ahora, solo lo quitamos de la lista en la base de datos.
        if (typeof updateCompanyInfo === "function") {
            await updateCompanyInfo({ images: newImages });
        } else {
            console.error(
                "updateCompanyInfo no es una función en handleRemoveImage"
            );
        }
    };

    const canAddMoreImages = (companyInfo.images?.length || 0) < 4;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
                Editar Información de la Empresa
            </h1>

            <div className="bg-white rounded-2xl shadow-custom p-6">
                {/* Título (tu código existente) */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Título
                        </h2>
                        <button
                            onClick={() => setIsEditingTitle(!isEditingTitle)}
                            className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                    </div>
                    {isEditingTitle ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={editedTitle}
                                onChange={(e) => setEditedTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsEditingTitle(false)}
                                    className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleSaveTitle}
                                    className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700">{companyInfo.title}</p>
                    )}
                </div>

                {/* Descripción (tu código existente) */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Descripción
                        </h2>
                        <button
                            onClick={() =>
                                setIsEditingDescription(!isEditingDescription)
                            }
                            className="p-1 rounded-full text-blue-600 hover:bg-blue-100"
                        >
                            <Edit className="h-4 w-4" />
                        </button>
                    </div>
                    {isEditingDescription ? (
                        <div className="space-y-2">
                            <textarea
                                value={editedDescription}
                                onChange={(e) =>
                                    setEditedDescription(e.target.value)
                                }
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() =>
                                        setIsEditingDescription(false)
                                    }
                                    className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={handleSaveDescription}
                                    className="px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400"
                                >
                                    <Check className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-700">
                            {companyInfo.description}
                        </p>
                    )}
                </div>

                {/* Imágenes */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Imágenes (Máx. 4)
                        </h2>
                        <button
                            onClick={() => setIsAddingImage(true)}
                            disabled={!canAddMoreImages || isAddingImage}
                            className={`flex items-center px-3 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-400 ${
                                !canAddMoreImages || isAddingImage
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            <span>Agregar Imagen</span>
                        </button>
                    </div>

                    {!canAddMoreImages && !isAddingImage && (
                        <p className="text-sm text-yellow-600 my-2">
                            Ya has alcanzado el límite de 4 imágenes.
                        </p>
                    )}

                    {isAddingImage && canAddMoreImages && (
                        <div className="border border-gray-200 rounded-xl p-4 mb-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Seleccionar Archivo de Imagen
                                    </label>
                                    <input
                                        type="file" // <--- CAMBIO IMPORTANTE
                                        accept="image/png, image/jpeg, image/webp" // Tipos de archivo permitidos
                                        onChange={handleFileChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                    />
                                    {selectedFile && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Archivo seleccionado:{" "}
                                            {selectedFile.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Descripción (Texto Alternativo)
                                    </label>
                                    <input
                                        type="text"
                                        value={newImageAlt}
                                        onChange={(e) =>
                                            setNewImageAlt(e.target.value)
                                        }
                                        placeholder="Ej: Logo de la empresa en la oficina"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>

                                {uploadError && (
                                    <p className="text-sm text-red-600">
                                        {uploadError}
                                    </p>
                                )}

                                <div className="flex justify-end space-x-2">
                                    <button
                                        onClick={() => {
                                            setIsAddingImage(false);
                                            setUploadError(null);
                                            setSelectedFile(null);
                                            setNewImageAlt("");
                                        }}
                                        className="px-3 py-1 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleUploadAndAddImage}
                                        disabled={
                                            isUploading ||
                                            !selectedFile ||
                                            !newImageAlt.trim()
                                        }
                                        className={`px-3 py-1 rounded-lg bg-primary-500 text-white hover:bg-primary-400 ${
                                            isUploading ||
                                            !selectedFile ||
                                            !newImageAlt.trim()
                                                ? "opacity-50 cursor-not-allowed"
                                                : ""
                                        }`}
                                    >
                                        {isUploading
                                            ? "Subiendo..."
                                            : "Agregar y Guardar"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {(companyInfo.images || []).map(
                            (
                                image // Asegurar que images sea un array
                            ) => (
                                <div
                                    key={image.id}
                                    className="relative group aspect-video"
                                >
                                    <img
                                        alt={image.alt}
                                        className="w-full h-full object-cover rounded-lg shadow-md"
                                        src={`http://localhost:3001${image.src}`} // <--- OTRO atributo src (esto causa el error)
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                                        <button
                                            onClick={() =>
                                                handleRemoveImage(image.id)
                                            }
                                            className="p-2 rounded-full bg-red-600 text-white opacity-75 hover:opacity-100 focus:outline-none"
                                        >
                                            <Trash className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <p
                                        className="mt-1 text-xs text-gray-500 truncate"
                                        title={image.alt}
                                    >
                                        {image.alt}
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCompany;
