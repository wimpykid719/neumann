class ChangeDescriptionToScrapedInBooks < ActiveRecord::Migration[7.1]
  def change
    remove_column :books, :description, :text
    add_column :books, :scraped_at, :date
  end
end
