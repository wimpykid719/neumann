class CreateUserAnalytics < ActiveRecord::Migration[7.1]
  def change
    create_table :user_analytics do |t|
      t.string :name, null: false, default: ''
      t.integer :count, null: false, default: 0

      t.timestamps
    end
  end
end
