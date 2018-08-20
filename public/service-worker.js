importScripts('workbox-sw.prod.v2.1.3.js');
importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

const workboxSW = new self.WorkboxSW();

workboxSW.router.registerRoute(
  /.*(?:googleapis|gstatic)\.com.*$/,
  workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'google-fonts',
    cacheExpiration: {
      maxEntries: 3,
      maxAgeSeconds: 60 * 60 * 24 * 30
    }
  })
);

workboxSW.router.registerRoute(
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
  workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'material-css'
  })
);

workboxSW.router.registerRoute(
  /.*(?:firebasestorage\.googleapis)\.com.*$/,
  workboxSW.strategies.staleWhileRevalidate({
    cacheName: 'post-images'
  })
);

workboxSW.router.registerRoute(
  'https://kiyamuda-pwa.firebaseio.com/posts.json',
  function(args) {
    return fetch(args.event.request).then(function(res) {
      var clonedRes = res.clone();
      clearAllData('posts')
        .then(function() {
          return clonedRes.json();
        })
        .then(function(data) {
          for (var key in data) {
            writeData('posts', data[key]);
          }
        });
      return res;
    });
  }
);

workboxSW.router.registerRoute(
  function(routeData) {
    return routeData.event.request.headers.get('accept').includes('text/html');
  },
  function(args) {
    return caches.match(args.event.request).then(function(response) {
      if (response) {
        return response;
      } else {
        return fetch(args.event.request)
          .then(function(res) {
            return caches.open('dynamic').then(function(cache) {
              cache.put(args.event.request.url, res.clone());
              return res;
            });
          })
          .catch(function(err) {
            return caches.match('/offline.html').then(function(res) {
              return res;
            });
          });
      }
    });
  }
);

workboxSW.precache([
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "6085e4c74d120d9f0bb6b056a468201c"
  },
  {
    "url": "manifest.json",
    "revision": "b691a07722cd75c7b5f095f80a803eb9"
  },
  {
    "url": "offline.html",
    "revision": "4a06566232779212dc09c95c2b9f0da1"
  },
  {
    "url": "src/css/app.css",
    "revision": "a5e824c131b444b152772109bd336652"
  },
  {
    "url": "src/css/feed.css",
    "revision": "26993a182831663e8c5b9a011848856c"
  },
  {
    "url": "src/css/help.css",
    "revision": "81922f16d60bd845fd801a889e6acbd7"
  },
  {
    "url": "src/images/main-image-1.jpg",
    "revision": "5c66d091b0dc200e8e89e56c589821fb"
  },
  {
    "url": "src/images/main-image-lg-1.jpg",
    "revision": "31b19bffae4ea13ca0f2178ddb639403"
  },
  {
    "url": "src/images/main-image-lg.jpg",
    "revision": "45d9d5345371a137e827ec376db3f1af"
  },
  {
    "url": "src/images/main-image-sm-1.jpg",
    "revision": "c6bb733c2f39c60e3c139f814d2d14bb"
  },
  {
    "url": "src/images/main-image-sm.jpg",
    "revision": "e130ed63bc78d19a2c6c0896bc911d93"
  },
  {
    "url": "src/images/main-image.jpg",
    "revision": "18ba4e45a9ded1ac5ccf1ff855317c13"
  },
  {
    "url": "src/images/sf-boat-1.jpg",
    "revision": "0f282d64b0fb306daf12050e812d6a19"
  },
  {
    "url": "src/images/sf-boat.jpg",
    "revision": "cf8a67435f5c0226d43403c7542b891b"
  },
  {
    "url": "src/js/app.min.js",
    "revision": "bb529fbe89f337625abf6f21f18d30c1"
  },
  {
    "url": "src/js/feed.min.js",
    "revision": "c693865b04f9bde5659aab2ce6bf0d35"
  },
  {
    "url": "src/js/fetch.min.js",
    "revision": "f044946c220164eed257b4e2fcb39234"
  },
  {
    "url": "src/js/idb.min.js",
    "revision": "88ae80318659221e372dd0d1da3ecf9a"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "e68511951f1285c5cbf4aa510e8a2faf"
  },
  {
    "url": "src/js/promise.min.js",
    "revision": "3468ef1e50a211ea36c24d4abd41062b"
  },
  {
    "url": "src/js/utility.min.js",
    "revision": "1a6f778b7fdc505b8b7acf8595c2422a"
  }
]);

self.addEventListener('sync', function(event) {
  console.log('[Service Worker] Background syncing', event);
  if (event.tag === 'sync-new-posts') {
    console.log('[Service Worker] Syncing new Posts');
    event.waitUntil(
      readAllData('sync-posts').then(function(data) {
        for (var dt of data) {
          var postData = new FormData();
          postData.append('id', dt.id);
          postData.append('title', dt.title);
          postData.append('location', dt.location);
          postData.append('rawLocationLat', dt.rawLocation.lat);
          postData.append('rawLocationLng', dt.rawLocation.lng);
          postData.append('file', dt.picture, dt.id + '.png');

          fetch(
            'https://us-central1-kiyamuda-pwa.cloudfunctions.net/storePostData',
            {
              method: 'POST',
              body: postData
            }
          )
            .then(function(res) {
              console.log('Sent data', res);
              if (res.ok) {
                res.json().then(function(resData) {
                  deleteItemFromData('sync-posts', resData.id);
                });
              }
            })
            .catch(function(err) {
              console.log('Error while sending data', err);
            });
        }
      })
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  var action = event.action;

  console.log(notification);

  if (action === 'confirm') {
    console.log('Confirm was chosen');
    notification.close();
  } else {
    console.log(action);
    event.waitUntil(
      clients.matchAll().then(function(clis) {
        var client = clis.find(function(c) {
          return c.visibilityState === 'visible';
        });

        if (client !== undefined) {
          client.navigate(notification.data.url);
          client.focus();
        } else {
          clients.openWindow(notification.data.url);
        }
        notification.close();
      })
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  console.log('Notification was closed', event);
});

self.addEventListener('push', function(event) {
  console.log('Push Notification received', event);

  var data = {
    title: 'New!',
    content: 'Something new happened!',
    openUrl: '/'
  };

  if (event.data) {
    data = JSON.parse(event.data.text());
  }

  var options = {
    body: data.content,
    icon: '/src/images/icons/app-icon-96x96.png',
    badge: '/src/images/icons/app-icon-96x96.png',
    data: {
      url: data.openUrl
    }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});
