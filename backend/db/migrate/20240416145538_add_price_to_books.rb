class AddPriceToBooks < ActiveRecord::Migration[7.1]
  def change
    add_column :books, :price, :integer, null: false, default: 0
  end
end
