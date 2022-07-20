# Non-existing route Test
GET http://localhost:8080/no-such-route

# We should get back an HTTP 1.1 404 Not Found response
HTTP/1.1 404
