class CreateProviders < ActiveRecord::Migration[7.1]
  def change
    create_table :providers do |t|
      t.belongs_to :user, foreign_key: true
      t.integer :kind, null: false, default: 0
      t.string :uid, null: false, default: ''

      t.timestamps
    end

    add_index :providers, :uid, unique: true
  end
end
