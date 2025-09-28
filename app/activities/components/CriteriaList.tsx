// app/activities/components/CriteriaList.tsx
import { criteria } from "../../utils/types";

type CriteriaListProps = {
  criteria: criteria[];
};

export default function CriteriaList({ criteria }: CriteriaListProps) {
  if (!criteria || criteria.length === 0) {
    return <span className="text-gray-500">Nenhum critério definido</span>;
  }

  return (
    <div className="mt-2 overflow-x-auto">
      <table className="min-w-full border border-gray-300 rounded-md bg-white">
        <thead className="bg-gray-100 text-gray-700 text-sm">
          <tr>
            <th className="px-3 py-2 border">Descrição</th>
            <th className="px-3 py-2 border">Tipo de Avaliação</th>
            <th className="px-3 py-2 border">Pontuação</th>
            <th className="px-3 py-2 border">Aplicação</th>
            <th className="px-3 py-2 border">Observações</th>
          </tr>
        </thead>
        <tbody>
          {criteria.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50 text-sm">
              <td className="px-3 py-2 border">{c.description}</td>
              <td className="px-3 py-2 border">
                {c.evaluationType === "integer" ? "Numérica" : "Sim/Não"}
              </td>
              <td className="px-3 py-2 border">
                {c.points !== undefined ? c.points : "—"}
              </td>
              <td className="px-3 py-2 border">
                {c.scoringType === "individual" ? "Individual" : "Equipe"}
              </td>
              <td className="px-3 py-2 border">
                {c.observations || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
