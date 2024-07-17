class ChangeScoreFloatToDecimal < ActiveRecord::Migration[7.1]
  def up
    change_column :books, :score, :decimal, precision: 17, scale: 16
  end

  def down
    change_column :books, :score, :float
  end
end
