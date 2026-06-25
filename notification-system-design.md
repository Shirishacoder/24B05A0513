# Stage 1

## Notification System API Design

### Core Actions

1. Create Notification
2. Get Notifications
3. Get Notification By ID
4. Mark Notification As Read
5. Mark All Notifications As Read
6. Delete Notification

---

### REST APIs

#### Create Notification

POST /api/notifications

Request:

```json
{
  "studentId": 1042,
  "type": "Placement",
  "title": "CSX Corporation Hiring",
  "message": "Hiring drive scheduled on 25th June"
}
```

Response:

```json
{
  "notificationId": "uuid",
  "status": "created"
}
```

---

#### Get Notifications

GET /api/notifications?page=1&limit=10

Response:

```json
{
  "notifications": [],
  "total": 100
}
```

---

#### Get Notification By ID

GET /api/notifications/{id}

Response:

```json
{
  "id": "uuid",
  "studentId": 1042,
  "type": "Placement",
  "title": "CSX Corporation Hiring",
  "message": "Hiring drive scheduled on 25th June",
  "isRead": false,
  "createdAt": "2026-06-25T10:00:00Z"
}
```

---

#### Mark Notification As Read

PATCH /api/notifications/{id}/read

Response:

```json
{
  "message": "Notification marked as read"
}
```

---

#### Mark All Notifications As Read

PATCH /api/notifications/read-all

Response:

```json
{
  "message": "All notifications marked as read"
}
```

---

#### Delete Notification

DELETE /api/notifications/{id}

Response:

```json
{
  "message": "Notification deleted successfully"
}
```

---

### JSON Schema

```json
{
  "id": "uuid",
  "studentId": 1042,
  "type": "Placement",
  "title": "Notification Title",
  "message": "Notification Message",
  "isRead": false,
  "createdAt": "timestamp"
}
```

---

### Headers

#### Request Headers

Authorization: Bearer Token

Content-Type: application/json

#### Response Headers

Content-Type: application/json

---

### Status Codes

- 200 Success
- 201 Created
- 400 Bad Request
- 401 Unauthorized
- 404 Not Found
- 500 Internal Server Error

---

### Notification Types

- Placement
- Event
- Result

---

### Security

- JWT based authentication
- Role based access control
- Input validation on all endpoints

---

### Real-Time Notifications

Technology: WebSocket (Socket.IO)

Flow:

1. Notification is created by an authorized service.
2. Notification is stored in the database.
3. Event is published to WebSocket server.
4. Connected students receive the notification instantly.
5. Unread notification count is updated in real time.

---

### Scalability Considerations

- Pagination for notification listing.
- Database indexing on studentId and createdAt.
- Caching frequently accessed notifications.
- Asynchronous processing for bulk notification delivery.
- Separate notification service for better scalability.

---

### Architecture

Client → API Server → Database

```
             ↓

    WebSocket Server

             ↓

   Connected Students
```

# Stage 2

## Database Choice

I would choose PostgreSQL as the primary database because notifications have a well-defined structure and require efficient querying, filtering, sorting, and indexing.

### Potential Problems with Increasing Data Volume

1. Slow notification retrieval.
2. Increased database storage requirements.
3. Higher query latency.
4. Increased load during peak placement seasons.
5. Difficulty handling real-time notification delivery.

### Database Schema

#### Students Table

| Column     | Type         |
| ---------- | ------------ |
| student_id | BIGINT       |
| name       | VARCHAR(100) |
| email      | VARCHAR(100) |

#### Notifications Table

| Column     | Type         |
| ---------- | ------------ |
| id         | UUID         |
| student_id | BIGINT       |
| type       | VARCHAR(20)  |
| title      | VARCHAR(255) |
| message    | TEXT         |
| is_read    | BOOLEAN      |
| created_at | TIMESTAMP    |

### Indexes

```sql
CREATE INDEX idx_student_notifications
ON notifications(student_id);

CREATE INDEX idx_notification_created
ON notifications(created_at);
```

### REST APIs

#### Create Notification

POST /api/notifications

#### Get Notifications

GET /api/notifications?page=1&limit=10

#### Get Unread Notifications

GET /api/notifications/unread

#### Mark Notification Read

PATCH /api/notifications/{id}/read

#### Delete Notification

DELETE /api/notifications/{id}

### SQL vs NoSQL

#### SQL Advantages

- ACID compliance
- Strong consistency
- Better support for joins
- Structured schema

#### NoSQL Advantages

- Horizontal scaling
- Flexible schema
- High write throughput

For this notification system, PostgreSQL is preferred because notification data is structured and relationships between students and notifications are important.

### Scalability Strategy

1. Database indexing.
2. Pagination.
3. Read replicas.
4. Caching frequently accessed notifications.
5. Partitioning notifications by date.

# Stage 3

## Query Optimization

### Existing Query

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
AND is_read = false
ORDER BY created_at DESC;
```

### Problems

1. Full table scan when notifications grow.
2. Slow filtering on student_id.
3. Sorting overhead on created_at.
4. Increased response time with large datasets.

### Optimization Strategy

Create a composite index:

```sql
CREATE INDEX idx_notification_query
ON notifications(student_id, is_read, created_at DESC);
```

### Why Composite Index?

The query filters using:

- student_id
- is_read

and sorts using:

- created_at DESC

A composite index allows the database to efficiently filter and sort without scanning the entire table.

### Additional Improvements

#### Pagination

```sql
SELECT *
FROM notifications
WHERE student_id = 1042
ORDER BY created_at DESC
LIMIT 10 OFFSET 0;
```

Benefits:

- Reduces memory usage.
- Faster response times.
- Better user experience.

#### Select Required Columns Only

Instead of:

```sql
SELECT *
FROM notifications;
```

Use:

```sql
SELECT id, title, type, created_at
FROM notifications;
```

Benefits:

- Transfers less data.
- Improves query performance.

### Expected Result

- Faster reads.
- Reduced database load.
- Better scalability.
- Improved notification retrieval performance.
