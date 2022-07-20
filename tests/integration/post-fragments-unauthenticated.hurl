# tests/integration/post-fragments-unauthenticated.hurl
POST http://localhost:8080/v1/fragments
Content-Type: text/plain
```This is a fragment!```

# 1. We expect to get back an HTTP 401
HTTP/1.1 401
