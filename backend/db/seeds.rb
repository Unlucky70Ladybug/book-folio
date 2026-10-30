# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Userモデルにデータ登録する
users = Array.new(10) do |i|
  User.find_or_create_by!(email: "user_#{i}@example.com") do |user|
    password = SecureRandom.alphanumeric(32)
    user.name = "ユーザー#{i}"
    user.email = "user_#{i}@example.com"
    user.password = password
    user.password_confirmation = password
    user.confirmed_at = Time.current
  end
end

# Bookモデルにデータ登録する
# genres の先頭は、Bookshelfへ割り当てるときの基準ジャンルとして扱う
book_seeds = [
  { isbn: "9784062758574", title: "十角館の殺人　＜新装改訂版＞", author: "綾辻 行人", item_url: "https://books.rakuten.co.jp/rb/4932495/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/8574/9784062758574_1_2.jpg?_ex=200x200", genres: [ "ミステリー・サスペンス" ] },
  { isbn: "9784065358542", title: "方舟", author: "夕木 春央", item_url: "https://books.rakuten.co.jp/rb/17907792/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/8542/9784065358542_1_3.jpg?_ex=200x200", genres: [ "ミステリー・サスペンス" ] },
  { isbn: "9784062938532", title: "その可能性はすでに考えた", author: "井上 真偽", item_url: "https://books.rakuten.co.jp/rb/15315997/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/8532/9784062938532_1_17.jpg?_ex=200x200", genres: [ "ミステリー・サスペンス" ] },
  { isbn: "9784167110123", title: "容疑者Xの献身", author: "東野 圭吾", item_url: "https://books.rakuten.co.jp/rb/5813590/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0123/9784167110123_1_33.jpg?_ex=200x200", genres: [ "ミステリー・サスペンス" ] },
  { isbn: "9784167733018", title: "葉桜の季節に君を想うということ", author: "歌野 晶午", item_url: "https://books.rakuten.co.jp/rb/4388876/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3018/9784167733018.jpg?_ex=200x200", genres: [ "ミステリー・サスペンス" ] },
  { isbn: "9784065412282", title: "13階段　新装版", author: "高野 和明", item_url: "https://books.rakuten.co.jp/rb/18395326/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2282/9784065412282_1_2.jpg?_ex=200x200", genres: [ "ミステリー・サスペンス" ] },
  { isbn: "9784152100719", title: "プロジェクト・ヘイル・メアリー 下", author: "アンディ・ウィアー/小野田　和子", item_url: "https://books.rakuten.co.jp/rb/16919894/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0719/9784152100719_1_19.jpg?_ex=200x200", genres: [ "SF" ] },
  { isbn: "9784152100702", title: "プロジェクト・ヘイル・メアリー 上", author: "アンディ・ウィアー/小野田　和子", item_url: "https://books.rakuten.co.jp/rb/16919896/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0702/9784152100702_1_19.jpg?_ex=200x200", genres: [ "SF" ] },
  { isbn: "9784150123093", title: "夏への扉〔新版〕", author: "ロバート・A・ハインライン/福島　正実", item_url: "https://books.rakuten.co.jp/rb/16490956/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3093/9784150123093_1_3.jpg?_ex=200x200", genres: [ "SF" ] },
  { isbn: "9784150415556", title: "アルジャーノンに花束を〔新装版〕", author: "ダニエル・キイス/小尾　芙佐", item_url: "https://books.rakuten.co.jp/rb/18578439/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5556/9784150415556_1_5.jpg?_ex=200x200", genres: [ "SF" ] },
  { isbn: "9784150102296", title: "アンドロイドは電気羊の夢を見るか？", author: "フィリップ・K・ディック/浅倉　久志", item_url: "https://books.rakuten.co.jp/rb/3648/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2296/9784150102296_1_3.jpg?_ex=200x200", genres: [ "SF" ] },
  { isbn: "9784001146189", title: "地底旅行", author: "ジュール・ヴェルヌ/平岡 敦", item_url: "https://books.rakuten.co.jp/rb/15665819/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/6189/9784001146189_1_3.jpg?_ex=200x200", genres: [ "SF" ] },
  { isbn: "9784150117481", title: "月は無慈悲な夜の女王", author: "ロバート・A・ハインライン/矢野　徹", item_url: "https://books.rakuten.co.jp/rb/6391354/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7481/9784150117481_1_2.jpg?_ex=200x200", genres: [ "SF" ] },
  { isbn: "9784488663315", title: "星を継ぐもの【新版】", author: "ジェイムズ・P・ホーガン/池 央耿", item_url: "https://books.rakuten.co.jp/rb/17525105/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3315/9784488663315_1_2.jpg?_ex=200x200", genres: [ "SF", "ミステリー・サスペンス" ] },
  { isbn: "9784863895201", title: "ハリー・ポッターと賢者の石＜新装版＞", author: "J．K．ローリング/松岡 佑子/佐竹 美保", item_url: "https://books.rakuten.co.jp/rb/16053896/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5201/9784863895201_1_3.jpg?_ex=200x200", genres: [ "ファンタジー" ] },
  { isbn: "9784794607362", title: "ナルニア国ものがたり　ライオンと魔女", author: "C.S.ルイス", item_url: "https://books.rakuten.co.jp/rb/17275072/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7362/9784794607362_1_2.jpg?_ex=200x200", genres: [ "ファンタジー" ] },
  { isbn: "9784001140583", title: "ホビットの冒険　上", author: "J．R．R．トールキン/瀬田　貞二", item_url: "https://books.rakuten.co.jp/rb/1181109/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0583/9784001140583.jpg?_ex=200x200", genres: [ "ファンタジー" ] },
  { isbn: "9784101302720", title: "精霊の守り人", author: "上橋 菜穂子", item_url: "https://books.rakuten.co.jp/rb/4343379/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2720/9784101302720.jpg?_ex=200x200", genres: [ "ファンタジー" ] },
  { isbn: "9784041054895", title: "鹿の王 1", author: "上橋　菜穂子", item_url: "https://books.rakuten.co.jp/rb/14993357/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4895/9784041054895_1_26.jpg?_ex=200x200", genres: [ "ファンタジー" ] },
  { isbn: "9784041979051", title: "天使の囀り", author: "貴志　祐介/酒井　和男", item_url: "https://books.rakuten.co.jp/rb/1212279/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/9051/9784041979051_1_26.jpg?_ex=200x200", genres: [ "ホラー" ] },
  { isbn: "9784047375840", title: "近畿地方のある場所について", author: "背筋", item_url: "https://books.rakuten.co.jp/rb/17494782/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5840/9784047375840_1_29.jpg?_ex=200x200", genres: [ "ホラー" ] },
  { isbn: "9784864109826", title: "変な家2　〜11の間取り図〜", author: "雨穴", item_url: "https://books.rakuten.co.jp/rb/17678006/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/9826/9784864109826_1_6.jpg?_ex=200x200", genres: [ "ホラー" ] },
  { isbn: "9784041880012", title: "リング", author: "鈴木　光司", item_url: "https://books.rakuten.co.jp/rb/590223/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0012/9784041880012_1_14.jpg?_ex=200x200", genres: [ "ホラー" ] },
  { isbn: "9784101240299", title: "残穢", author: "小野 不由美", item_url: "https://books.rakuten.co.jp/rb/13307040/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0299/9784101240299.jpg?_ex=200x200", genres: [ "ホラー" ] },
  { isbn: "9784344419681", title: "植物図鑑", author: "有川浩", item_url: "https://books.rakuten.co.jp/rb/12160480/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/9681/9784344419681.jpg?_ex=200x200", genres: [ "恋愛" ] },
  { isbn: "9784800226105", title: "ぼくは明日、昨日のきみとデートする", author: "七月隆文", item_url: "https://books.rakuten.co.jp/rb/12849123/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/6105/9784800226105.jpg?_ex=200x200", genres: [ "恋愛" ] },
  { isbn: "9784065281499", title: "汝、星のごとく", author: "凪良 ゆう", item_url: "https://books.rakuten.co.jp/rb/17202261/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/1499/9784065281499_1_5.jpg?_ex=200x200", genres: [ "恋愛" ] },
  { isbn: "9784286184920", title: "余命10年", author: "小坂流加", item_url: "https://books.rakuten.co.jp/rb/14941485/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4920/9784286184920.jpg?_ex=200x200", genres: [ "恋愛" ] },
  { isbn: "9784087455489", title: "桜のような僕の恋人", author: "宇山 佳佑", item_url: "https://books.rakuten.co.jp/rb/14652389/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5489/9784087455489_1_2.jpg?_ex=200x200", genres: [ "恋愛" ] },
  { isbn: "9784101234175", title: "夜のピクニック", author: "恩田 陸", item_url: "https://books.rakuten.co.jp/rb/4099707/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4175/9784101234175.jpg?_ex=200x200", genres: [ "青春" ] },
  { isbn: "9784043878024", title: "夜は短し歩けよ乙女", author: "森見　登美彦", item_url: "https://books.rakuten.co.jp/rb/5940339/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/8024/9784043878024_1_25.jpg?_ex=200x200", genres: [ "青春" ] },
  { isbn: "9784167903619", title: "ぼくは勉強ができない", author: "山田 詠美", item_url: "https://books.rakuten.co.jp/rb/13204406/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/3619/9784167903619.jpg?_ex=200x200", genres: [ "青春" ] },
  { isbn: "9784774766584", title: "鬼しぶ", author: "辻堂 魁", item_url: "https://books.rakuten.co.jp/rb/18278488/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/6584/9784774766584_1_4.jpg?_ex=200x200", genres: [ "時代小説" ] },
  { isbn: "9784774766133", title: "闇の用心棒【一】（第1巻）", author: "鳥羽 亮", item_url: "https://books.rakuten.co.jp/rb/18074602/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/6133/9784774766133_1_4.jpg?_ex=200x200", genres: [ "時代小説" ] },
  { isbn: "9784774766300", title: "素浪人稼業【一】", author: "藤井 邦夫", item_url: "https://books.rakuten.co.jp/rb/18155759/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/6300/9784774766300_1_5.jpg?_ex=200x200", genres: [ "時代小説" ] },
  { isbn: "9784834000825", title: "ぐりとぐら", author: "中川李枝子/大村百合子", item_url: "https://books.rakuten.co.jp/rb/119896/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0825/9784834000825.jpg?_ex=200x200", genres: [ "絵本・児童書" ] },
  { isbn: "9784834016291", title: "そらまめくんのベッド", author: "なかやみわ", item_url: "https://books.rakuten.co.jp/rb/1094963/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/6291/9784834016291.jpg?_ex=200x200", genres: [ "絵本・児童書" ] },
  { isbn: "9784834000436", title: "三びきのやぎのがらがらどん", author: "マーシャ・ブラウン/せたていじ", item_url: "https://books.rakuten.co.jp/rb/120297/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0436/9784834000436.jpg?_ex=200x200", genres: [ "絵本・児童書" ] },
  { isbn: "9784478121115", title: "経済は地理から学べ!【全面改訂版】", author: "宮路　秀作", item_url: "https://books.rakuten.co.jp/rb/18158374/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/1115/9784478121115_1_2.jpg?_ex=200x200", genres: [ "ビジネス・経済" ] },
  { isbn: "9784150504489", title: "マネーの進化史", author: "ニーアル・ファーガソン/仙名　紀", item_url: "https://books.rakuten.co.jp/rb/13449132/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4489/9784150504489.jpg?_ex=200x200", genres: [ "ビジネス・経済" ] },
  { isbn: "9784480687982", title: "景気ってなんだろう", author: "岩田規久男", item_url: "https://books.rakuten.co.jp/rb/5870433/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7982/9784480687982.jpg?_ex=200x200", genres: [ "ビジネス・経済" ] },
  { isbn: "9784478025819", title: "嫌われる勇気", author: "岸見　一郎/古賀　史健", item_url: "https://books.rakuten.co.jp/rb/12570589/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5819/9784478025819.jpg?_ex=200x200", genres: [ "自己啓発" ] },
  { isbn: "9784594030193", title: "チーズはどこへ消えた?", author: "スペンサー・ジョンソン/門田　美鈴", item_url: "https://books.rakuten.co.jp/rb/1208687/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/0193/9784594030193.jpg?_ex=200x200", genres: [ "自己啓発" ] },
  { isbn: "9784866512419", title: "夢をかなえるゾウ1", author: "水野敬也", item_url: "https://books.rakuten.co.jp/rb/16354625/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2419/9784866512419_1_2.jpg?_ex=200x200", genres: [ "自己啓発" ] },
  { isbn: "9784815627058", title: "図解入門TCP/IP 第2版", author: "みやた ひろし", item_url: "https://books.rakuten.co.jp/rb/18048499/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/7058/9784815627058_1_9.jpg?_ex=200x200", genres: [ "科学・テクノロジー" ] },
  { isbn: "9784297145712", title: "［改訂新版］プロになるためのWeb技術入門", author: "小森 裕介", item_url: "https://books.rakuten.co.jp/rb/18020396/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/5712/9784297145712_1_23.jpg?_ex=200x200", genres: [ "科学・テクノロジー" ] },
  { isbn: "9784297124373", title: "プロを目指す人のためのRuby入門［改訂2版］　言語仕様からテスト駆動開発・デバッグ技法まで", author: "伊藤 淳一", item_url: "https://books.rakuten.co.jp/rb/16908719/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/4373/9784297124373_1_5.jpg?_ex=200x200", genres: [ "科学・テクノロジー" ] },
  { isbn: "9784774142043", title: "Webを支える技術", author: "山本陽平", item_url: "https://books.rakuten.co.jp/rb/6385779/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/2043/9784774142043.jpg?_ex=200x200", genres: [ "科学・テクノロジー" ] },
  { isbn: "9784274226298", title: "達人プログラマー（第2版）", author: "Andrew Hunt/David Thomas/村上雅章", item_url: "https://books.rakuten.co.jp/rb/16481114/", large_image_url: "https://thumbnail.image.rakuten.co.jp/@0_mall/book/cabinet/6298/9784274226298.jpg?_ex=200x200", genres: [ "科学・テクノロジー" ] }
]

book_seeds.each do |attrs|
  Book.find_or_create_by!(isbn: attrs[:isbn]) do |book|
    book.assign_attributes(attrs.except(:genres))
    book.fetched_at = Time.current
  end
end

# Genreモデルにデータ登録する
[
  "ミステリー・サスペンス", "SF", "ファンタジー", "ホラー", "恋愛", "青春",
  "時代小説", "ヒューマンドラマ", "絵本・児童書", "エッセイ",
  "ノンフィクション・ドキュメンタリー", "ビジネス・経済", "自己啓発",
  "科学・テクノロジー", "歴史・社会", "哲学・思想", "その他",
  "画集・写真集", "美術・デザイン", "料理・レシピ", "ファッション・美容",
  "教育・学習", "語学・外国語", "健康・医療・福祉", "宗教・神話", "検定・資格"
].each do |genre_name|
  Genre.find_or_create_by!(name: genre_name)
end

# Bookshelf・BookGenreモデルにデータ登録する
# ユーザーごとの { ジャンル => 冊数 }（1人10冊）。先頭4人は偏りなし、残り6人は偏りあり
genre_counts_by_user = [
  { "ミステリー・サスペンス" => 2, "SF" => 2, "ファンタジー" => 1, "ホラー" => 1, "恋愛" => 1, "青春" => 1, "ビジネス・経済" => 1, "科学・テクノロジー" => 1 },
  { "SF" => 1, "ファンタジー" => 2, "恋愛" => 2, "青春" => 1, "時代小説" => 1, "絵本・児童書" => 1, "自己啓発" => 1, "科学・テクノロジー" => 1 },
  { "ミステリー・サスペンス" => 1, "ホラー" => 2, "恋愛" => 1, "時代小説" => 2, "絵本・児童書" => 2, "ビジネス・経済" => 1, "自己啓発" => 1 },
  { "ミステリー・サスペンス" => 1, "SF" => 1, "ファンタジー" => 1, "ホラー" => 1, "青春" => 1, "時代小説" => 1, "絵本・児童書" => 1, "ビジネス・経済" => 1, "自己啓発" => 1, "科学・テクノロジー" => 1 },
  { "ミステリー・サスペンス" => 6, "ホラー" => 3, "SF" => 1 },
  { "SF" => 8, "ミステリー・サスペンス" => 1, "ファンタジー" => 1 },
  { "ファンタジー" => 5, "絵本・児童書" => 2, "青春" => 2, "恋愛" => 1 },
  { "ホラー" => 5, "ミステリー・サスペンス" => 3, "時代小説" => 2 },
  { "恋愛" => 5, "青春" => 3, "自己啓発" => 2 },
  { "科学・テクノロジー" => 5, "ビジネス・経済" => 3, "自己啓発" => 2 }
]

# 1人分の読書状況と評価（10冊分）
reading_patterns = [
  { reading_status: :finished, preference_rating: :favorite },
  { reading_status: :finished, preference_rating: :favorite },
  { reading_status: :finished, preference_rating: :interesting },
  { reading_status: :finished, preference_rating: :interesting },
  { reading_status: :finished, preference_rating: :normal },
  { reading_status: :finished, preference_rating: :not_for_me },
  { reading_status: :finished, preference_rating: :unrated },
  { reading_status: :reading, preference_rating: :unrated },
  { reading_status: :reading, preference_rating: :unrated },
  { reading_status: :interested, preference_rating: :unrated }
]

# 本を先頭のジャンルごとに分類する
# 例： { "ミステリー・サスペンス" => [十角館の殺人, 方舟, ...], "SF" => [...], ... }
book_queues = book_seeds.group_by { |attrs| attrs[:genres].first }

users.each_with_index do |user, user_index|
  # このユーザーの本棚に入れる本を、ジャンルごとに指定の冊数ずつ集める
  user_books = []
  genre_counts_by_user[user_index].each do |genre_name, count|
    book_title_list = book_queues[genre_name]
    # 列の先頭から指定の冊数を取り出す
    picked_books = book_title_list.shift(count)
    # 取り出した本を列の末尾に戻し、次のユーザーには続きの本を割り当てる
    book_title_list.concat(picked_books)
    user_books.concat(picked_books)
  end

  user_books.each_with_index do |attrs, book_index|
    book = Book.find_by!(isbn: attrs[:isbn])
    # 本棚に登録する。読書状況と評価は、本の順番に対応するパターンを使う
    bookshelf = Bookshelf.find_or_create_by!(user: user, book: book) do |new_bookshelf|
      new_bookshelf.assign_attributes(reading_patterns[book_index])
    end

    # 本棚にジャンルを紐づける（複数ジャンルの本はすべてのジャンルを登録する）
    attrs[:genres].each do |genre_name|
      BookGenre.find_or_create_by!(bookshelf: bookshelf, genre: Genre.find_by!(name: genre_name))
    end
  end
end
