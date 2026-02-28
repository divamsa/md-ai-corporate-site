export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary-700">MD</span>
            <span className="text-sm font-medium text-slate-600 hidden sm:block">
              マネーデザイン
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#services" className="hover:text-primary-600 transition">
              サービス
            </a>
            <a href="#contact" className="hover:text-primary-600 transition">
              お問い合わせ
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}
