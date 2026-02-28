export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">MD</span>
            <span className="text-sm">マネーデザイン</span>
          </div>
          <p className="text-sm">
            &copy; {new Date().getFullYear()} マネーデザイン All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
