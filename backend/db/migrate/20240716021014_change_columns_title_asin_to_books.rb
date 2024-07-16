class ChangeColumnsTitleAsinToBooks < ActiveRecord::Migration[7.1]
  def change
    remove_index :books, column: :title, unique: true

    add_index :books, :title
    add_column :books, :asin, :string, null: false, default: ''
    add_index :books, :asin, unique: true
  end
end
