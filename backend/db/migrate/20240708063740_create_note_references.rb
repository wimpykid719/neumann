class CreateNoteReferences < ActiveRecord::Migration[7.1]
  def change
    create_table :note_references do |t|
      t.json :hashtags, null: false
      t.json :reference_objs, null: false
      t.references :book, null: false, foreign_key: true

      t.timestamps
    end
  end
end
