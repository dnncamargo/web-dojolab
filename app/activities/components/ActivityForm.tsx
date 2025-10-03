import { activity } from "@/app/utils/types"
import { useState } from "react"
import ActivityFormExpanded from "./ActivityFormExpanded"

type ActivityFormProps = {
  onAdd: (activity: Omit<activity, "id">) => Promise<void>
}

export default function ActivityForm({ onAdd }: ActivityFormProps) {
  const [expanded, setExpanded] = useState(false)
  const [title, setTitle] = useState("")

  const handleExpand = () => {
    if (title.trim()) setExpanded(true)
  }

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6">
      {!expanded ? (
        <div className="flex items-center gap-2">
          <input
            required
            type="text"
            placeholder="Título da atividade"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-2 flex-1 placeholder-black"
          />
          <button
            onClick={handleExpand}
            disabled={!title.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            Nova Atividade
          </button>
        </div>
      ) : (
        <ActivityFormExpanded
          initialTitle={title}
          onAdd={onAdd}
          onCancel={() => {
            setExpanded(false)
            setTitle("")
          }}
        />
      )}
    </div>
  )
}
