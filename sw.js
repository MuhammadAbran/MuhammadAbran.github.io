var CACHE_NAME = 'pwa_cache-v1';
var urlsToCache = [
   './',
   './css/bootstrap.min.css',
   './js/bootstrap.min.js',
   './j.js',
   './img/img.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
        console.log('service worker do install...');
        return cache.addAll(urlsToCache);
      })
  );
});

//activation cache
self.addEventListener('activate', function(event){
   event.waitUntil(
      caches.keys().then(function(cacheNames){
         return Promise.all(
            cacheNames.filter(function(cacheName){
               return cacheName !== CACHE_NAME;
            }).map(function(cacheName){
               return caches.delete(cacheName);
            })
         )
      })
   )
});

//fetch cache
self.addEventListener('fetch', function(event){
   var request = event.request;
   var url = new URL(request.url);

   //Memisahkan Cache File dengan Cache API
   if (url.origin === location.origin) {
      event.respondWith(
         caches.match(request).then(function(response){
            return response || fetch(request);
         })
      )
   }else {
      event.respondWith(
         caches.open('list-mahasiswa-cache-v1').then(function(cache){
            return fetch(request).then(function(liveRequest){
               cache.put(request, liveRequest.clone());
               return liveRequest;
            }).catch(function(){
               return caches.match(request).then(function(response){
                  if (response) return response;
                  return caches.match('./fallback.json');
               })
            })
         })
      )
   }

   // event.respondWith(
   //    caches.match(event.request).then(function(response){
   //       console.log(response);
   //       if (response) {
   //          return response;
   //       }
   //       return fetch(event.request);
   //    })
   // )
});

//Event Click Notification
self.addEventListener('notificationclick', function(e){
   var notification = e.notification;
   var primaryKey = notification.data.primaryKey;
   var action = e.action;
   console.log(primaryKey);

   if (action == 'close') {
      notification.close();
   }else {
      clients.openWindow('http://muhammadabran.github.io');
      notification.close();
   }
});

//register serviceWorker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('./sw.js').then(function(registration) {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
