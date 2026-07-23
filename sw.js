const CACHE='travel-2026-v10'
const ENTRY='/travel/europe-travel-2026.html'
const APP_ICONS=['google-maps.png','ns.png','9292.png','db-navigator.png','mvv.png','oebb.png','asfinag.png','wienmobil.png','google-translate.png','deepl.png','global-blue.ico','splitwise.png'].map(file=>`/travel/app-icons/${file}`)

async function precache(){
  const cache=await caches.open(CACHE)
  const response=await fetch(ENTRY,{cache:'reload'})
  if(!response.ok)throw new Error(`Unable to cache app shell: ${response.status}`)
  const html=await response.clone().text()
  const buildAssets=[...html.matchAll(/(?:src|href)="(\/travel\/assets\/index-[^"]+\.(?:js|css))"/g)].map(match=>match[1])
  await cache.put(ENTRY,response)
  await cache.addAll(['/travel/favicon.svg','/travel/manifest.webmanifest','/travel/leaflet/leaflet.min.css','/travel/leaflet/leaflet.min.js',...APP_ICONS,...buildAssets])
}

self.addEventListener('install',event=>event.waitUntil(precache().then(()=>self.skipWaiting())))
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())))
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return
  const url=new URL(event.request.url)
  if(url.origin!==location.origin)return

  if(event.request.mode==='navigate'||url.pathname===ENTRY){
    event.respondWith(fetch(event.request).then(response=>{
      if(response.ok)caches.open(CACHE).then(cache=>cache.put(ENTRY,response.clone()))
      return response
    }).catch(()=>caches.match(ENTRY)))
    return
  }

  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(response=>{
    if(response.ok)caches.open(CACHE).then(cache=>cache.put(event.request,response.clone()))
    return response
  })))
})
