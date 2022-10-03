const migrations = [
  {
    up:
      'CREATE TABLE IF NOT EXISTS site (' +
      'uri TEXT PRIMARY KEY,' +
      'active TINYINT DEFAULT 1,' +
      "created_at timestamp DEFAULT (strftime('%s', 'now'))," +
      'updated_at timestamp NULL)',
    down: 'DROP TABLE site',
  },
  {
    up:
      'CREATE TABLE IF NOT EXISTS post (' +
      'uri TEXT PRIMARY KEY,' +
      'title TEXT NOT NULL,' +
      'description TEXT NOT NULL,' +
      "created_at timestamp DEFAULT (strftime('%s', 'now'))," +
      'updated_at timestamp NULL,' +
      'site_uri TEXT NOT NULL,' +
      'FOREIGN KEY (site_uri) REFERENCES site (uri))',
    down: 'DROP TABLE post',
  },
]

module.exports = migrations
