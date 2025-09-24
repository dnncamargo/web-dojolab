import Link from "next/link";

export default function MenuPage() {
    return (
        <nav className="bg-white shadow rounded-lg p-4 mb-6 flex gap-4 text-black">
            <Link href="/students" className="font-semibold hover:underline">
                Alunos
            </Link>
            <Link href="/classes" className="font-semibold hover:underline">
                Turmas
            </Link>
            <Link href="/teams" className="font-semibold hover:underline">
                Equipes
            </Link>
        </nav>
    );
}

