'use client';

import React, { useState, useCallback, ChangeEvent } from 'react';

// Define o tipo da prop que será enviada para a página principal ou para o viewer
type PdfSource = string | null;

interface PDFInputProps {
  // Função para lidar com a seleção/inserção e enviar o source para o pai
  onSourceSelect: (source: PdfSource) => void;
  // Propriedade para fechar o componente de input (opcional, para controle de modal/dropdown)
  onClose?: () => void; 
}

// Componente modificado para usar 'export default function'
export default function PDFInput({ onSourceSelect, onClose }: PDFInputProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [inputType, setInputType] = useState<'url' | 'file'>('url'); // Controla o modo de input

  // Manipulador para alterações no campo de texto (URL)
  const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  // Manipulador para seleção de arquivo local
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      // Cria um URL de objeto temporário para o arquivo local
      const localPdfUrl = URL.createObjectURL(file);
      
      // Envia o URL local para o componente pai/viewer
      onSourceSelect(localPdfUrl);
      console.log(localPdfUrl)
      
      // Limpa o estado e fecha o input (se houver função de fechar)
      setInputValue('');
      if (onClose) onClose();
      
      // Nota: Você precisará revogar este URL (URL.revokeObjectURL(localPdfUrl))
      // quando o componente que o usa (PDFViewer) for desmontado, para evitar vazamento de memória.
    } else if (file) {
        alert('Por favor, selecione um arquivo PDF.');
    }
  };

  // Manipulador para envio do formulário (URL)
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (inputValue.trim()) {
      // Assume que o inputValue é um URL válido.
      onSourceSelect(inputValue.trim());
      setInputValue('');
      if (onClose) onClose();
    } else {
      alert('Por favor, insira um link da web válido.');
    }
  };

  // Alterne entre os modos de input
  const toggleInputType = () => {
    setInputType(prev => (prev === 'url' ? 'file' : 'url'));
    setInputValue(''); // Limpa o valor ao alternar
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
      <h3>Selecione um PDF</h3>
      
      <button onClick={toggleInputType} style={{ marginBottom: '15px', padding: '8px 15px' }}>
        {inputType === 'url' ? 'Usar Arquivo Local' : 'Usar Link da Web'}
      </button>

      {inputType === 'url' ? (
        <form onSubmit={handleSubmit}>
          <input
            type="url"
            value={inputValue}
            onChange={handleUrlChange}
            placeholder="Insira o link da web do PDF (ex: https://.../doc.pdf)"
            required
            style={{ width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ padding: '10px 15px', width: '100%', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>
            Carregar Link PDF
          </button>
        </form>
      ) : (
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          style={{ padding: '10px' }}
        />
      )}
    </div>
  );
}