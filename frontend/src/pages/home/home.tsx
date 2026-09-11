import { Link } from "react-router-dom";

const features = [
  {
    icon: "📚",
    title: "読んだ本を記録",
    description:
      "ISBNやキーワードで本を検索し、「読み終わった」「読書中」「気になる本」として自分の本棚に蓄積できます。",
  },
  {
    icon: "🍩",
    title: "ジャンルを可視化",
    description:
      "本棚の本をジャンルごとに集計して円グラフで表示。自分がどんなジャンルを好んで読んでいるか一目で分かります。",
  },
  {
    icon: "✍️",
    title: "著者を分析",
    description:
      "著者ごとの読書傾向をグラフで確認。グラフから著者を選ぶと、その著者の作品をまとめて振り返れます。",
  },
  {
    icon: "🧭",
    title: "好みを診断",
    description:
      "読んだ本を「お気に入り・面白い・普通・合わなかった」で評価し、自分の好みをより明確にしていけます。",
  },
  {
    icon: "🤝",
    title: "他ユーザーと比較",
    description:
      "ジャンル構成を他のユーザーと比較し、読書傾向が似ている人・異なる人を発見。次の一冊のヒントになります。",
  },
  {
    icon: "🌱",
    title: "新しい本との出会い",
    description:
      "自分では選ばなかったような本にも出会える。安心して選べる本と、興味を広げる本の両方を見つけられます。",
  },
];

const Home = () => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* ヒーロー */}
      <section className="hero bg-gradient-to-b from-primary/10 via-base-100 to-base-100 py-20 px-4">
        <div className="hero-content flex-col max-w-3xl text-center">
          <h1 className="relative inline-block text-6xl md:text-8xl font-black tracking-tight bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 bg-clip-text text-transparent drop-shadow-sm">
            BookFolio
            <span className="absolute -bottom-2 left-0 h-1.5 w-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500" />
          </h1>
          <p className="text-lg md:text-xl font-medium mt-2">
            読んだ本から、自分の好みと読書傾向が見えてくる。
          </p>
          <p className="opacity-80 mt-4 leading-relaxed">
            読んだ本を記録・蓄積し、ジャンルや著者ごとの読書傾向をグラフで可視化する読書記録サービスです。
            これまでの読書を振り返りながら、自分に合った次の一冊を見つけやすくします。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full sm:w-auto justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              新規登録
            </Link>
            <Link to="/login" className="btn btn-outline btn-primary btn-lg">
              ログイン
            </Link>
          </div>
        </div>
      </section>

      {/* 機能紹介 */}
      <section className="max-w-5xl mx-auto py-16 px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
          BookFolio でできること
        </h2>
        <p className="text-center opacity-75 mb-10">
          記録するだけで終わらせない。読書を振り返り、次につなげる。
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="card bg-base-200 border border-base-300 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="card-body">
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="card-title text-primary">{feature.title}</h3>
                <p className="opacity-80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 締めのCTA */}
      <section className="bg-primary/10 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            自分だけの本棚を作りはじめよう
          </h2>
          <p className="opacity-80 mb-8">
            読んだ本を記録するほど、あなたの読書傾向がはっきりしていきます。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup" className="btn btn-primary btn-lg">
              新規登録
            </Link>
            <Link to="/login" className="btn btn-outline btn-primary btn-lg">
              ログイン
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
