# frozen_string_literal: true

class User < ActiveRecord::Base
  # Bookshelfと紐づけ
  has_many :bookshelves, dependent: :destroy
  has_many :book_genres, through: :bookshelves, source: :book_genres

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  # Userモデルにアップローダーをマウント
  mount_uploader :avatar_image, AvatarImageUploader # 追記

  # フォローしているユーザーとの関係
  has_many :active_relationships, class_name: "Relationship", foreign_key: "follower_id", dependent: :destroy
  has_many :following, through: :active_relationships, source: :followed

  # フォロワーとの関係
  has_many :passive_relationships, class_name: "Relationship", foreign_key: "followed_id", dependent: :destroy
  has_many :followers, through: :passive_relationships, source: :follower

  validates :name, presence: true
  validates_integrity_of :avatar_image

  # ユーザーをフォローするメソッド
  def follow(other_user)
    active_relationships.create(followed_id: other_user.id)
  end

  # フォローを解除するメソッド
  def unfollow(other_user)
    active_relationships.find_by(followed_id: other_user.id).destroy
  end

  # すでにフォローしているかを確認するメソッド
  def following?(other_user)
    following.include?(other_user)
  end
end
