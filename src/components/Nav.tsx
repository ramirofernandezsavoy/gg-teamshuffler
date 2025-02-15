import Link from "next/link"

export default function Nav() {
  return (
    <nav className="h-18 w-screen bg-blue-600/30 backdrop-blur-md text-center flex items-center justify-between p-4 sticky top-0 z-10">
      <p>
        Logo
      </p>
      <ul className="flex gap-6">
        <Link href="/teams">Teams</Link>
        <Link href="/players">Players</Link>
        <Link href="/games">Games</Link>
      </ul>
    </nav>
  )
}
