export default function Sidebar() {
  return (
    <aside className="w-64 bg-base-200 p-4">
      <nav>
        <ul className="menu">
          <li><a href="/">Главная</a></li>
          <li><a href="/notes/add">Добавить заметку</a></li>
          <li><a href="/graph">Граф</a></li>
          <li><a href="/about">О проекте</a></li>
        </ul>
      </nav>
    </aside>
  );
}