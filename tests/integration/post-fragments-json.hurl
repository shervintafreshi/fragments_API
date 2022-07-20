# tests/integration/post-fragments-json.hurl
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: application/json
{
    "id": "4568",
    "evaluate": true
}

# 1. We expect to get back an HTTP 201
HTTP/1.1 201

[Captures]
url: header "location"

# 2. Try to GET the fragment we just posted by its URL
GET {{url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
Content-Type: application/json
{
    "id": "4568",
    "evaluate": true
}
