// app/utils/parseCsv.ts
// Função para capitalizar cada palavra
export function capitalizeName(name: string): string {
  return name
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Lê o arquivo CSV de alunos e retorna a lista formatada
 */
export function parseStudentsCsv(file: File): Promise<{ name: string }[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

        const students = lines.map((line) => {
          const [name] = line.split(",");
          return { name: capitalizeName(name.trim()) };
        });

        resolve(students);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
