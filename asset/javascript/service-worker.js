importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
    console.log(`Yay! Workbox is loaded 🎉`);

    importScripts(
        '/asset/javascript/precache-manifest.js',
    );
    workbox.core.skipWaiting();

    workbox.core.clientsClaim();

    /**
     * The workboxSW.precacheAndRoute() method efficiently caches and responds to
     * requests for URLs in the manifest.
     * See https://goo.gl/S9QRab
     */
    self.__precacheManifest = [].concat(self.__precacheManifest || []);
    workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

    workbox.routing.registerRoute(
        // Cache HTML files.
        /\.html$/,
        // Use cache but update in the background.
        new workbox.strategies.StaleWhileRevalidate({
            // Use a custom cache name.
            cacheName: 'html-cache',
        })
    );

    workbox.routing.registerRoute(
        // Cache CSS files.
        /\.css$/,
        // Use cache but update in the background.
        new workbox.strategies.StaleWhileRevalidate({
            // Use a custom cache name.
            cacheName: 'css-cache',
        })
    );

    workbox.routing.registerRoute(
        // Cache font files.
        /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        // Use cache but update in the background.
        new workbox.strategies.StaleWhileRevalidate({
            // Use a custom cache name.
            cacheName: 'font-cache',
        })
    );

    workbox.routing.registerRoute(
        // Cache JS files.
        /\.js$/,
        // Use cache but update in the background.
        new workbox.strategies.StaleWhileRevalidate({
            // Use a custom cache name.
            cacheName: 'js-cache',
        })
    );

    workbox.routing.registerRoute(
        // Cache image files.
        /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
        // Use the cache if it's available.
        new workbox.strategies.CacheFirst({
            // Use a custom cache name.
            cacheName: 'image-cache',
            plugins: [
                new workbox.expiration.Plugin({
                    // Cache only 20 images.
                    maxEntries: 20,
                    // Cache for a maximum of a week.
                    maxAgeSeconds: 7 * 24 * 60 * 60,
                })
            ],
        })
    );

    workbox.routing.registerRoute(
        // Cache video files.
        /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        // Use the cache if it's available.
        new workbox.strategies.CacheFirst({
            // Use a custom cache name.
            cacheName: 'video-cache',
            plugins: [
                new workbox.expiration.Plugin({
                    // Cache only 20 images.
                    maxEntries: 20,
                    // Cache for a maximum of a week.
                    maxAgeSeconds: 7 * 24 * 60 * 60,
                })
            ],
        })
    );
} else {
    console.log(`Boo! Workbox didn't load 😬`);
}
