"use client";

import React, { useEffect, useRef } from "react";

type InteractiveDescriptionProps = {
  htmlContent: string;
  onOpenSummary?: (title: string) => void; // Prop para disparar o modal no seu painel pai
};

export default function InteractiveDescription({ htmlContent, onOpenSummary }: InteractiveDescriptionProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Função segura para carregar HTML no iframe
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Corrige todos os links <a> para abrirem em nova aba
    const safeHtml = htmlContent.replace(
      /<a\s+([^>]*href=['"][^'"]+['"][^>]*)>/gi,
      '<a $1 target="_blank" rel="noopener noreferrer">'
    );

    // Cria um documento HTML completo para o iframe
const html = `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          html, body {
            margin: 0;
            padding: 0;
            overflow-x: hidden;
            font-family: system-ui, sans-serif;
            -webkit-tap-highlight-color: transparent; /* Remove o flash de toque do Chrome antigo */
          }
          /* FIX CHROME 81 TOUCH: Força o navegador a entender o título como uma área clicável/interativa */
          .title {
            cursor: pointer !important;
          }
        </style>
      </head>
      <body>
        ${safeHtml}
        <script>
          // Intercepta interações usando 'click' (atendido perfeitamente pelo PointerEvents do Chrome 81)
          document.addEventListener("click", function(e) {
            // 1. Verificação de Links Externos
            const a = e.target.closest("a[href]");
            if (a && a.href) {
              e.preventDefault();
              window.parent.postMessage({ type: "open-external-link", url: a.href }, "*");
              return;
            }

            // 2. Verificação de Clique nos Títulos (para abrir o sumário/modal)
            const titleEl = e.target.closest(".title");
            if (titleEl) {
              e.preventDefault();
              // Envia o texto do título ou você pode customizar o payload aqui
              window.parent.postMessage({ 
                type: "open-summary-modal", 
                title: titleEl.innerText.trim() 
              }, "*");
            }
          });

          // ResizeObserver para ajuste de altura dinâmico
          const observer = new ResizeObserver(() => {
            const height = document.body.scrollHeight;
            window.parent.postMessage({ type: "resize-iframe", height }, "*");
          });
          observer.observe(document.body);
          window.parent.postMessage({ type: "resize-iframe", height: document.body.scrollHeight }, "*");
        </script>
      </body>
      </html>
    `;

    //const blob = new Blob([html], { type: "text/html" });
    //const url = URL.createObjectURL(blob);
    //iframe.src = url;
    iframe.srcdoc = html;

    // Limpeza ao desmontar
    //return () => URL.revokeObjectURL(url);
    return () => {};
  }, [htmlContent]);

  // Ouve a altura enviada do iframe e ajusta dinamicamente
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Ajuste de tamanho
      if (event.data?.type === "resize-iframe" && iframeRef.current) {
        iframeRef.current.style.height = `${event.data.height}px`;
      }
      // Links externos
      if (event.data?.type === "open-external-link" && event.data.url) {
        window.open(event.data.url, "_blank", "noopener,noreferrer");
      }

      // NOVO: Captura a intenção de abrir o modal vinda de dentro do iframe
      if (event.data?.type === "open-summary-modal") {
        if (onOpenSummary) {
          onOpenSummary(event.data.title);
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onOpenSummary]);

  return (
    <iframe
      ref={iframeRef}
      className="w-full border-0 mb-8 bg-white transition-all duration-300"
      sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      title="Atividade Interativa"
    />
  );
}
