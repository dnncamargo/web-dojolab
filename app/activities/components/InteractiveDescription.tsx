"use client";

import React, { useEffect, useRef } from "react";

type InteractiveDescriptionProps = {
  htmlContent: string;
};

export default function InteractiveDescription({ htmlContent }: InteractiveDescriptionProps) {
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
          }
        </style>
      </head>
      <body>
        ${safeHtml}
        <script>
          // ResizeObserver para ajustar altura dinamicamente
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
      if (event.data?.type === "resize-iframe" && iframeRef.current) {
        iframeRef.current.style.height = `${event.data.height}px`;
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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
