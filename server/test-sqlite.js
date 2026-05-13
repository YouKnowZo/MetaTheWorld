try {
  const Database = require('better-sqlite3')
  const db = new Database(':memory:')
  console.log('better-sqlite3 is working!')
} catch (e) {
  console.error('better-sqlite3 failed:', e)
}
