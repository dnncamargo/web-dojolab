'use client';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

interface PDFViewerProps {
  pdfSource: string | null;
}

export default function PDFViewer({ pdfSource }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.1);
  const [showPad, setShowPad] = useState<boolean>(false);
  const [pageInput, setPageInput] = useState<string>('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function goToPage(p: number) {
    if (!numPages) return;
    const page = Math.max(1, Math.min(numPages, p));
    setPageNumber(page);
    if (containerRef.current) containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function nextPage() {
    if (pageNumber < (numPages || 1)) goToPage(pageNumber + 1);
  }

  function prevPage() {
    if (pageNumber > 1) goToPage(pageNumber - 1);
  }

  function firstPage() {
    goToPage(1);
  }

  function lastPage() {
    if (numPages) goToPage(numPages);
  }

  function zoomIn() {
    setScale((prev) => Math.min(prev + 0.2, 3));
  }

  function zoomOut() {
    setScale((prev) => Math.max(prev - 0.2, 0.6));
  }

  function handlePadInput(value: string) {
    if (value === 'C') setPageInput('');
    else if (value === '←') setPageInput((prev) => prev.slice(0, -1));
    else if (value === 'Go') {
      const page = parseInt(pageInput);
      if (!isNaN(page)) goToPage(page);
      setShowPad(false);
      setPageInput('');
    } else {
      setPageInput((prev) => (prev + value).slice(0, 3)); // até 3 dígitos
    }
  }

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url,
    ).toString();
  }, []);

  // Efeito para revogar o Blob URL do arquivo local quando o componente é desmontado
  useEffect(() => {
    return () => {
      // Se for um Blob URL (começa com 'blob:'), revogue-o para liberar memória.
      if (pdfSource && pdfSource.startsWith('blob:')) {
        URL.revokeObjectURL(pdfSource);
        console.log(`Blob URL revogado: ${pdfSource}`);
      }
    };
  }, [pdfSource]); // Dependência de pdfSource, embora seja mais importante no unmount

  if (!pdfSource) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Nenhum PDF selecionado.</div>;
  }

  return (
    <div className="relative flex items-center justify-center h-screen bg-neutral-950 text-white select-none">
      {/* Contêiner com rolagem automática */}
      <div
        ref={containerRef}
        className="overflow-auto max-h-screen w-full flex justify-center items-start scroll-smooth"
      >
        <Document
          file={pdfSource}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex justify-center items-center py-6"
          loading={<p>Carregando PDF...</p>}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={<p>Carregando página...</p>}
          />
        </Document>
      </div>

      {/* Botão lateral esquerdo */}
      <button
        onClick={prevPage}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white text-2xl p-3 rounded-lg"
      >
        ◀
      </button>

      {/* Botão lateral direito */}
      <button
        onClick={nextPage}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white text-2xl p-3 rounded-lg"
      >
        ▶
      </button>

      {/* Controles inferiores */}
      <div className="absolute bottom-3 left-3 flex flex-col gap-2 bg-white/10 px-3 py-2 rounded-lg text-sm backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span>Página {pageNumber} de {numPages}</span>
          <button
            onClick={() => setShowPad((prev) => !prev)}
            className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md"
          >
            #
          </button>
        </div>

        {/* Mini teclado numérico */}
        {showPad && (
          <div className="grid grid-cols-3 gap-1 bg-black/50 p-2 rounded-lg">
            {['1','2','3','4','5','6','7','8','9','←','0','Go'].map((key) => (
              <button
                key={key}
                onClick={() => handlePadInput(key)}
                className="bg-white/10 hover:bg-white/20 py-1 rounded text-white"
              >
                {key}
              </button>
            ))}
          </div>
        )}

        {/* Controles de página e zoom */}
        <div className="flex gap-2">
          <button onClick={firstPage} className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md">
            ⏮
          </button>
          <button onClick={lastPage} className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md">
            ⏭
          </button>
          <button onClick={zoomOut} className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md">
            ➖
          </button>
          <button onClick={zoomIn} className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded-md">
            ➕
          </button>
        </div>
      </div>
    </div>
  );
}
