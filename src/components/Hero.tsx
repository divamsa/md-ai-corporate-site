export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTMwVjBoLTEydjRoMTJ6TTI0IDI0aDEydi0ySDI0djJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 relative">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
            生成AIで
            <br />
            ビジネスを変革する
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-blue-100 max-w-2xl leading-relaxed">
            マネーデザインは、企業の生成AI導入を戦略立案からPoC開発、本番運用まで一気通貫でサポートします。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex justify-center items-center px-8 py-3 rounded-lg bg-white text-primary-700 font-semibold hover:bg-blue-50 transition shadow-lg"
            >
              無料相談を申し込む
            </a>
            <a
              href="#services"
              className="inline-flex justify-center items-center px-8 py-3 rounded-lg border-2 border-white/30 text-white font-semibold hover:bg-white/10 transition"
            >
              サービスを見る
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
