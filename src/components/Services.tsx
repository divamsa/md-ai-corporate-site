const services = [
  {
    title: "AI戦略コンサルティング",
    description:
      "貴社のビジネス課題を分析し、生成AIの最適な活用戦略を策定します。ROI試算からロードマップ作成まで支援します。",
    icon: "💡",
  },
  {
    title: "PoC開発・検証",
    description:
      "短期間でプロトタイプを構築し、AIソリューションの実現可能性と効果を検証します。",
    icon: "🔬",
  },
  {
    title: "本番システム開発",
    description:
      "検証済みのAIソリューションを本番環境に実装。セキュリティ、スケーラビリティを考慮した堅牢なシステムを構築します。",
    icon: "🚀",
  },
  {
    title: "運用・保守サポート",
    description:
      "導入後の継続的な改善、モデルの再学習、パフォーマンスモニタリングまでトータルにサポートします。",
    icon: "🛡️",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            サービス
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            戦略から運用まで、生成AI導入のあらゆるフェーズをカバーします
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="group p-8 rounded-2xl border border-slate-200 hover:border-primary-300 hover:shadow-lg transition-all duration-300"
            >
              <span className="text-4xl" role="img" aria-label={service.title}>
                {service.icon}
              </span>
              <h3 className="mt-4 text-xl font-semibold text-slate-900 group-hover:text-primary-700 transition">
                {service.title}
              </h3>
              <p className="mt-3 text-slate-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
