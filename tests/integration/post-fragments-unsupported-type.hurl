# tests/integration/post-fragments-unsupported-type.hurl
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: application/octet-stream
{
    "id": "4568",
    "evaluate": true
}

# 1. We expect to get back an HTTP 415
HTTP/1.1 415
