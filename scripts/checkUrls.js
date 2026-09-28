// Check all YouTube video IDs against the oEmbed API.
// 200 = valid and embeddable, 401/403 = valid but embedding blocked, 404 = dead.

const VIDEOS = {
  singleParadiddle: '-imiZIrGwXE',
  singleParadiddleDiddle: '0z58p1nd4PQ',
  subdivisionCounting: 'vuk_oC5niP8',
  heelToe: 'xHqkxHaQ-bI',
  syncKickWorkout: 'vKq9xk0dUxM',
  polyrhythmVsPolymeter: '08hmJd1BVKk',
  jayPostonesOddTime: 'w83rbm4JBo0',
  jayPostonesMeshuggah: 'xi2X3KiL7gM',
  bleedMeshuggah: 'QCBr1ws2JYo',
  oddTimeGrooves: 'mvHa9mokz_I',
  dannyCarey: '-Emut0-LYJE',
  bassDrumSpeed: 'tWJGx7YbauQ',
  esteparioStart: 'YxHnzqeoER4',
  polyrhythmBible: '95Sdpqu3Hno',
  introBlastBeats: 'kEHfAgW7EsA',
  blastBeatVariation: 'dCxvG5g5wok',
  derekRoddyBlast: '2A8psfS7-vA',
  kolliasBassOdyssey: 'bxX1UFf1Q3o',
  gravityBlast: 'TPwP03ZUJOc',
}

async function check(id, ytId) {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${ytId}&format=json`
  try {
    const res = await fetch(url)
    if (res.status === 200) return { id, ytId, status: 'ok' }
    if (res.status === 401 || res.status === 403) return { id, ytId, status: 'embedding-blocked' }
    if (res.status === 404) return { id, ytId, status: 'dead' }
    return { id, ytId, status: `http-${res.status}` }
  } catch (e) {
    return { id, ytId, status: 'error', error: e.message }
  }
}

const results = await Promise.all(
  Object.entries(VIDEOS).map(([id, ytId]) => check(id, ytId))
)

const ok = results.filter(r => r.status === 'ok')
const blocked = results.filter(r => r.status === 'embedding-blocked')
const dead = results.filter(r => r.status === 'dead')
const errors = results.filter(r => r.status === 'error' || r.status.startsWith('http-'))

console.log('\n=== YouTube URL check ===\n')
console.log(`OK (embeddable):          ${ok.length}`)
ok.forEach(r => console.log(`  + ${r.id}  (${r.ytId})`))

if (blocked.length) {
  console.log(`\nEmbedding blocked (auto-fallback covers these): ${blocked.length}`)
  blocked.forEach(r => console.log(`  ! ${r.id}  (${r.ytId})`))
}

if (dead.length) {
  console.log(`\nDEAD — needs replacing:   ${dead.length}`)
  dead.forEach(r => console.log(`  x ${r.id}  https://www.youtube.com/watch?v=${r.ytId}`))
}

if (errors.length) {
  console.log(`\nErrors:                   ${errors.length}`)
  errors.forEach(r => console.log(`  ? ${r.id}  ${r.status}  ${r.error || ''}`))
}

if (!dead.length && !errors.length) {
  console.log('\nAll 19 YouTube URLs are alive.')
}
