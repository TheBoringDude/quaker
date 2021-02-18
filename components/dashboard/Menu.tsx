const Menu = () => {
  return (
    <nav className="py-4 w-5/6 mx-auto flex items-center justify-between">
      <div>
        <h1 className="text-3xl tracking-wide font-extrabold text-teal-600">
          QuaKer
        </h1>
      </div>
      <ul className="flex">
        <li className="px-8 text-lg">
          <a
            href="#"
            className="font-bold tracking-wide text-coolGray-700 hover:text-teal-500"
          >
            Forms
          </a>
        </li>
        <li className="px-8 text-lg">
          <a
            href="#"
            className="font-bold tracking-wide text-coolGray-700 hover:text-teal-500"
          >
            Stats
          </a>
        </li>
        <li className="pl-8 text-lg">
          <a
            href="/api/logout"
            className="font-bold tracking-wide text-coolGray-700 hover:text-teal-500"
          >
            Sign Out
          </a>
        </li>
      </ul>
    </nav>
  )
}

export default Menu