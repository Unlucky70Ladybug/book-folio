class AddAvatarImageToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :avatar_image, :string
  end
end
