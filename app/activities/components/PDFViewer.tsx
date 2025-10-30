'use client';
import { useEffect, useRef, useState } from 'react';

interface PDFViewerProps {
  pdfSource: string | null;
}

export default function PDFViewer({ pdfSource }: PDFViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [scale, setScale] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);

  // 🔹 Libera blobs antigos
  useEffect(() => {
    return () => {
      if (pdfSource && pdfSource.startsWith('blob:')) {
        URL.revokeObjectURL(pdfSource);
      }
    };
  }, [pdfSource]);

  // 🔹 Atualiza zoom via CSS transform dentro do iframe
  const applyZoom = (newScale: number) => {
    const iframeDoc = iframeRef.current?.contentDocument;
    if (!iframeDoc) return;
    const html = iframeDoc.documentElement;
    html.style.transformOrigin = '0 0';
    html.style.transform = `scale(${newScale})`;
  };

  useEffect(() => {
    applyZoom(scale);
  }, [scale]);

  if (!pdfSource) {
    return (
      <div className="text-center text-gray-400 p-10">
        Nenhum PDF selecionado.
      </div>
    );
  }

  return (
    <div className="relative bg-white text-white flex items-center justify-center h-[110vh] overflow-hidden">
      {/* Viewer */}
      <iframe
        ref={iframeRef}
        src={`${pdfSource}#toolbar=1&navpanes=1&scrollbar=1`}
        title="Visualizador de PDF"
        className="w-full h-full rounded-lg bg-white shadow-md"
        allowFullScreen
      />

    </div>
  );
}
