import { criteria } from "@/app/utils/types"
import { v4 as uuidv4 } from 'uuid';

type CriteriaEditorProps = {
  criteria: criteria[]
  onChange: (c: criteria[]) => void
}

export default function CriteriaEditor({ criteria, onChange }: CriteriaEditorProps) {
  const toggleEvaluation = (id: string) => {
    onChange(
      criteria.map((c) =>
        c.id === id
          ? {
              ...c,
              evaluationType: c.evaluationType === "integer" ? "boolean" : "integer",
            }
          : c
      )
    )
  }

  const toggleScoring = (id: string) => {
    onChange(
      criteria.map((c) =>
        c.id === id
          ? {
              ...c,
              scoringType: c.scoringType === "individual" ? "team" : "individual",
            }
          : c
      )
    )
  }

  const handleRemove = (id: string) => {
    if(criteria.length > 1)
      onChange(criteria.filter((c) => c.id !== id))
    else
      alert('A atividade deve ter pelo menos 1 critério')
  }

  const addCriteria = () => {
    onChange([
      ...criteria,
      {
        id: uuidv4(),
        description: "",
        evaluationType: "integer",
        scoringType: "individual",
      },
    ])
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">Critérios de Avaliação</label>
      {criteria.map((c) => (
        <div key={c.id} className="flex items-center gap-2">
          <input
            required
            type="text"
            placeholder="Nome do critério"
            value={c.description}
            onChange={(e) =>
              onChange(
                criteria.map((item) =>
                  item.id === c.id ? { ...item, description: e.target.value } : item
                )
              )
            }
            className="flex-1 border p-2 rounded-md"
          />
          <button
            type="button"
            onClick={() => toggleEvaluation(c.id)}
            className="px-2 py-1 mr-1 bg-blue-200 rounded-md"
          >
            {c.evaluationType === "integer" ? "Inteiro" : "Booleano"}
          </button>
          <button
            type="button"
            onClick={() => toggleScoring(c.id)}
            className="px-2 py-1 m-1 bg-purple-200 rounded-md"
          >
            {c.scoringType === "individual" ? "Individual" : "Equipe"}
          </button>
          <button
            type="button"
            onClick={() => handleRemove(c.id)}
            className="px-2 py-1 ml-1 bg-red-300 rounded-md"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addCriteria}
        className="mt-2 px-3 py-1 bg-green-200 rounded-md"
      >
        + Adicionar Critério
      </button>
    </div>
  )
}
