const migrations = [
  {
    id: 1,
    up:
      'CREATE TABLE IF NOT EXISTS site (' +
      'id TEXT PRIMARY KEY,' +
      'uri TEXT NOT NULL,' +
      'active TINYINT DEFAULT 1,' +
      "created_at timestamp DEFAULT (strftime('%s', 'now'))," +
      'updated_at timestamp NULL)',
    down: 'DROP TABLE site',
  },
  {
    id: 2,
    up:
      'CREATE TABLE IF NOT EXISTS post (' +
      'id TEXT PRIMARY KEY,' +
      'uri TEXT NOT NULL,' +
      'title TEXT NOT NULL,' +
      'description TEXT NOT NULL,' +
      "created_at timestamp DEFAULT (strftime('%s', 'now'))," +
      'updated_at timestamp NULL,' +
      'site_uri TEXT NOT NULL,' +
      'FOREIGN KEY (site_uri) REFERENCES site (uri))',
    down: 'DROP TABLE post',
  },
  {
    id: 3,
    up: 'ALTER TABLE site ADD COLUMN title TEXT NULL',
    down: 'ALTER TABLE site DROP COLUMN title'
  },
  {
    id: 4,
    up: 'ALTER TABLE site ADD COLUMN description TEXT NULL',
    down: 'ALTER TABLE site DROP COLUMN description'
  },
  {
    id: 5,
    up: 'ALTER TABLE post ADD COLUMN content TEXT NULL',
    down: 'ALTER TABLE post DROP COLUMN content'
  }
]

module.exports = migrations
