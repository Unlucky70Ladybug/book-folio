# frozen_string_literal: true

class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  # Userモデルにアップローダーをマウント
  mount_uploader :avatar_image, AvatarImageUploader # 追記

  validates :name, presence: true
  validates_integrity_of :avatar_image
end
