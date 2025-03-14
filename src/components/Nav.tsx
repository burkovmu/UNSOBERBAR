import Link from 'next/link'

const Nav = () => {
  return (
    <div className="flex items-center space-x-4">
      <Link href="/menu">
        <button className="px-6 py-3 border border-[#333] rounded-full uppercase text-sm tracking-widest text-gray-500 transition-all hover:border-[#E6B980]/40 hover:text-[#E6B980]/40">
          Меню
        </button>
      </Link>
      <Link href="/admin">
        <button className="px-6 py-3 border border-[#333] rounded-full uppercase text-sm tracking-widest text-gray-500 transition-all hover:border-[#E6B980]/40 hover:text-[#E6B980]/40">
          Админ
        </button>
      </Link>
    </div>
  )
}

export default Nav 