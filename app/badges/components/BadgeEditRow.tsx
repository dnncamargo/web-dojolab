// app/badges/components/BadgeEditRow.tsx
"use client";

import { useState } from "react";
import { badge } from "../../utils/types";

type BadgeEditRowProps = {
    badge: badge;
    onCancel: () => void;
    onSave: (id: string, data: Partial<badge>) => Promise<void> | void;
};

export default function BadgeEditRow({ badge, onCancel, onSave }: BadgeEditRowProps) {
    const [badgeName, setBadgeName] = useState(badge.name);
    // Mantemos o `image` para o caso de ser uma URL de texto.
    const [image, setImage] = useState(badge.imageUrl || ""); 
    // CORREÇÃO: Inicializa com valor do badge, garantindo que não é null/undefined
    const [description, setDescription] = useState(badge.description || ""); 
    const [isActive, setIsActive] = useState(badge.isActive !== undefined ? badge.isActive : true);
    
    // NOVO: Estado para arquivo e URL de pré-visualização
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState(badge.imageUrl || "");

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (selected) {
            setFile(selected);
            const url = URL.createObjectURL(selected);
            setPreviewUrl(url); // Mostra o preview do arquivo
            setImage(""); // Limpa a URL de texto, dando precedência ao arquivo
        }
    };
    
    const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setImage(url);
        setPreviewUrl(url); // Atualiza o preview com a URL digitada
        setFile(null); // Limpa o arquivo, dando precedência à URL de texto
    }

    const handleSave = () => {
        // Se um novo arquivo foi selecionado, usa seu URL temporário (como no BadgeForm)
        let finalImageUrl = image;
        if (file) {
            finalImageUrl = URL.createObjectURL(file);
        }

        onSave(badge.id, {
            name: badgeName,
            imageUrl: finalImageUrl,
            description: description,
            isActive
        });
        onCancel();
    };

    return (
        <tr className="border-t border-gray-200 bg-gray-50">
            {/* Nome */}
            <td className="px-4 py-2">
                <input
                    value={badgeName}
                    onChange={(e) => setBadgeName(e.target.value)}
                    className="border px-2 py-1 rounded w-full"
                />
            </td>

            {/* Imagem - NOVO: Com pré-visualização e upload de arquivo */}
            <td className="px-4 py-2">
                <div className="flex flex-col gap-1">
                    {/* Preview Image */}
                    {previewUrl ? (
                        <img 
                            src={previewUrl} 
                            alt="Pré-visualização da insígnia" 
                            className="h-10 w-10 object-cover rounded mb-2" 
                        />
                    ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded mb-2 flex items-center justify-center text-xs text-gray-500">
                            Sem Imagem
                        </div>
                    )}
                    {/* File Input Button */}
                    <label className="flex items-center gap-2 cursor-pointer bg-gray-200 px-3 py-1 rounded text-sm hover:bg-gray-300">
                        {file ? file.name : (previewUrl ? "Mudar Imagem" : "Selecionar Imagem")}
                        <input 
                            type="file" 
                            accept="image/*" 
                            onChange={handleFile} 
                            hidden 
                        />
                    </label>
                    {/* Input de URL para quem quiser colar um link */}
                    <input
                        type="text"
                        placeholder="Ou cole a URL da imagem"
                        value={image}
                        onChange={handleImageUrlChange}
                        className="border rounded px-2 py-1 w-full text-sm mt-1"
                    />
                </div>
            </td>

            {/* Descrição - CORRIGIDO: Usa o estado `description` */}
            <td className="px-4 py-2">
                <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                        rows={3} // Adicionado para melhor visualização
                    />
            </td>

            {/* Ativo */}
            <td className="px-4 py-2">
                <div className="flex items-center justify-start h-full">
                    <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                        title={isActive ? "Desativar Insígnia" : "Ativar Insígnia"}
                    />
                </div>
            </td>

            {/* Ações */}
            <td className="px-4 py-2 flex gap-2 justify-end">
                <button
                    onClick={handleSave}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                    Salvar
                </button>
                <button
                    onClick={onCancel}
                    className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                >
                    Cancelar
                </button>
            </td>
        </tr>
    );
}