# tests/integration/lab-10-dynamodb.hurl

# 1. POST a new JSON fragment as an authorized user
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: application/json
{
    "service": "DynamoDB"
}

HTTP/1.1 201
[Captures]
fragment1_url: header "location"
fragment1_id: jsonpath "$.fragment.id" 

# 2. Try to GET the fragment we just posted by its URL
GET {{fragment1_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
jsonpath "$.fragment.id" == {{fragment1_id}}
jsonpath "$.fragment.type" == "application/json"

# 3. POST a markdown fragment to the service
POST http://localhost:8080/v1/fragments
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==
Content-Type: text/markdown
```DynamoDB is **great**```

HTTP/1.1 201
[Captures]
fragment2_url: header "location"
fragment2_id: jsonpath "$.fragment.id"

# 4. Try to GET the fragment we just posted by its URL
GET {{fragment2_url}}/info
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
jsonpath "$.fragment.id" == {{fragment2_id}}
jsonpath "$.fragment.type" == "text/markdown"

# 5. Get all the fragments for the same authorized user without expanding
GET http://localhost:8080/v1/fragments?expand=false
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" count == 2
jsonpath "$.fragments[*]" includes "{{fragment1_id}}"
jsonpath "$.fragments[*]" includes "{{fragment2_id}}"

# 6. Try to DELETE the fragment we just posted by its URL
DELETE http://localhost:8080/v1/fragments/{{fragment1_id}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200

# 7. Try to GET the fragment we just deleted by its URL
GET {{fragment1_url}}
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 404

# 8. GET all of the fragments for the same authorized user without expanding them
GET http://localhost:8080/v1/fragments?expand=false
Authorization: Basic dXNlcjFAZW1haWwuY29tOnBhc3N3b3JkMQ==

HTTP/1.1 200
[Asserts]
jsonpath "$.fragments" count == 1
jsonpath "$.fragments[0]" == {{fragment2_id}}
