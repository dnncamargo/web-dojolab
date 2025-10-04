// app/utils/tiptap.d.ts
import "@tiptap/react";

declare module "@tiptap/react" {
  interface EditorOptions {
    /**
     * Impede o SSR de renderizar imediatamente (necessário em Next.js)
     */
    immediatelyRender?: boolean;
  }
}
