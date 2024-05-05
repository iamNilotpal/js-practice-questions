1. XSS attack mitigation

Use "Content-Security-Policy" header to control the loading of assets like
scripts, fonts or images.

a. Allow only your scripts - headers.set("Content-Security-Policy", "default-src
'self';") b. Allow specific scripts - headers.set("Content-Security-Policy",
"script-src 'self' 'unsafe-inline' https://unsecure.com")
