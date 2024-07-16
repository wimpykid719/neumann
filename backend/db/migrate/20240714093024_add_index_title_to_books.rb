class AddIndexTitleToBooks < ActiveRecord::Migration[7.1]
  def change
    add_index :books, :title, unique: true
  end
end
