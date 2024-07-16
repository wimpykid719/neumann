class CreateBooks < ActiveRecord::Migration[7.1]
  def change
    create_table :books do |t|
      t.string :title, null: false, default: ''
      t.text :img_url
      t.text :description
      t.float :score, null: false, default: 0
      t.integer :page, null: false, default: 0
      t.date :launched
      t.string :author, null: false, default: ''
      t.string :publisher, null: false, default: ''
      t.text :associate_url

      t.timestamps
    end
  end
end
