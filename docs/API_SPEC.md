# Sales SaaS Application - API Specification

## Base URL
`https://api.sales-saas.com/v1`

## Authentication
All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "success": true,
  "data": {},
  "message": "Success message",
  "errors": []
}
```

## Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## Authentication Endpoints

### POST /auth/register
Register a new organization and admin user
```json
{
  "organization_name": "Acme Sales Agency",
  "organization_slug": "acme-sales",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@acme.com",
  "password": "password123"
}
```

### POST /auth/login
Authenticate user and get JWT token
```json
{
  "email": "john@acme.com",
  "password": "password123"
}
```

### POST /auth/refresh
Refresh JWT token
```json
{
  "refresh_token": "refresh_token_here"
}
```

### POST /auth/logout
Invalidate current session

---

## User Management

### GET /users
Get all users in organization (Manager only)
Query parameters: `role`, `is_active`, `page`, `limit`

### POST /users
Create new user (Manager only)
```json
{
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Smith",
  "role": "sales_rep",
  "password": "temp_password"
}
```

### GET /users/:id
Get user details

### PUT /users/:id
Update user (Manager only for other users, users can edit themselves)
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "role": "sales_rep",
  "is_active": true
}
```

### DELETE /users/:id
Deactivate user (Manager only)

---

## Dashboard Data

### GET /dashboard/agency
Get agency dashboard data (Manager only)
```json
{
  "team_overview": {
    "total_sales_reps": 10,
    "total_setters": 5,
    "active_users": 14,
    "total_revenue": 125000.50
  },
  "performance_summary": {
    "today": { "calls": 150, "closes": 12 },
    "this_week": { "calls": 980, "closes": 78 },
    "this_month": { "calls": 4200, "closes": 340 }
  },
  "top_performers": [
    { "user_id": "uuid", "name": "John Doe", "closes": 45, "revenue": 15000 }
  ]
}
```

### GET /dashboard/sales-rep
Get sales rep dashboard data
```json
{
  "personal_metrics": {
    "today": { "scheduled_calls": 12, "live_calls": 8, "closes": 2 },
    "this_week": { "scheduled_calls": 65, "live_calls": 48, "closes": 12 },
    "this_month": { "scheduled_calls": 280, "live_calls": 205, "closes": 48 }
  },
  "goals": {
    "weekly_close_target": 15,
    "current_closes": 12,
    "progress_percentage": 80
  }
}
```

### GET /dashboard/setter
Get appointment setter dashboard data
```json
{
  "setter_metrics": {
    "today": { "outbound_calls": 45, "triage_booked": 8, "consult_booked": 3 },
    "this_week": { "outbound_calls": 320, "triage_booked": 56, "consult_booked": 24 },
    "booking_rates": {
      "triage_rate": 17.5,
      "consult_rate": 42.8
    }
  }
}
```

---

## Metrics & KPIs

### POST /metrics/sales-rep
Submit daily sales rep metrics
```json
{
  "date": "2024-01-15",
  "scheduled_calls": 12,
  "live_calls": 8,
  "offers_made": 6,
  "closes": 2,
  "deposits": 1,
  "products": [
    { "product_id": "uuid", "units_closed": 1, "cash_collected": 5000.00 },
    { "product_id": "uuid", "units_closed": 1, "cash_collected": 3500.00 }
  ]
}
```

### POST /metrics/setter
Submit daily setter metrics
```json
{
  "date": "2024-01-15",
  "outbound_calls": 45,
  "minutes_messaging": 120,
  "triage_offers_made": 12,
  "triage_calls_booked": 8,
  "consult_offers_made": 6,
  "consult_calls_booked": 3,
  "scheduled_sets": 5,
  "closed_sets": 2
}
```

### GET /metrics/user/:user_id
Get metrics for specific user
Query parameters: `start_date`, `end_date`, `metric_type`

### GET /metrics/team
Get aggregated team metrics (Manager only)
Query parameters: `start_date`, `end_date`, `group_by`

---

## Reporting

### GET /reports/eod-questions
Get EOD form questions for organization

### POST /reports/eod
Submit EOD report
```json
{
  "date": "2024-01-15",
  "responses": [
    { "question_id": "uuid", "response_boolean": true },
    { "question_id": "uuid", "response_text": "Had 3 great calls today" },
    { "question_id": "uuid", "response_number": 8 }
  ]
}
```

### GET /reports/eod/:user_id
Get EOD reports for user
Query parameters: `start_date`, `end_date`

### GET /reports/weekly-questions
Get weekly report questions

### POST /reports/weekly
Submit weekly report
```json
{
  "week_start_date": "2024-01-15",
  "responses": [
    { "question_id": "uuid", "response_text": "Exceeded my goal of 15 closes with 18!" }
  ]
}
```

### GET /reports/monthly-questions
Get monthly report questions

### POST /reports/monthly
Submit monthly report
```json
{
  "month_start_date": "2024-01-01",
  "responses": [
    { "question_id": "uuid", "response_text": "Great month overall, hit 95% of revenue target" }
  ]
}
```

---

## Products & Offers

### GET /products
Get all products for organization

### POST /products
Create new product (Manager only)
```json
{
  "name": "Weight Loss Course",
  "price": 2500.00
}
```

### PUT /products/:id
Update product (Manager only)
```json
{
  "name": "Advanced Weight Loss Course",
  "price": 3000.00,
  "is_active": true
}
```

### DELETE /products/:id
Deactivate product (Manager only)

---

## Analytics & Leaderboards

### GET /analytics/leaderboard
Get leaderboard data
Query parameters: `metric`, `period`, `role`, `limit`
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "user_id": "uuid",
      "name": "John Doe",
      "metric_value": 45,
      "metric_name": "closes"
    }
  ]
}
```

### GET /analytics/trends
Get performance trends
Query parameters: `user_id`, `metric`, `period`, `start_date`, `end_date`

### GET /analytics/comparison
Compare performance between users/periods
Query parameters: `user_ids`, `start_date`, `end_date`, `metrics`

---

## Goals

### GET /goals
Get user goals
Query parameters: `goal_type`, `active_only`

### POST /goals
Set new goal
```json
{
  "goal_type": "weekly",
  "metric_name": "closes",
  "target_value": 15,
  "period_start": "2024-01-15",
  "period_end": "2024-01-21"
}
```

### PUT /goals/:id
Update goal
```json
{
  "target_value": 18,
  "period_end": "2024-01-21"
}
```

### DELETE /goals/:id
Remove goal

---

## Notifications

### GET /notifications/settings
Get user notification preferences

### PUT /notifications/settings
Update notification preferences
```json
{
  "eod_reminders": {
    "frequency": "daily",
    "is_enabled": true
  },
  "performance_reports": {
    "frequency": "weekly",
    "is_enabled": true
  },
  "team_reports": {
    "frequency": "monthly",
    "is_enabled": false
  }
}
```

### GET /notifications/organization-settings
Get organization notification settings (Manager only)

### PUT /notifications/organization-settings
Update organization notification settings (Manager only)
```json
{
  "daily_team_summary": true,
  "weekly_performance_digest": true,
  "monthly_reports": false
}
```

---

## Question Management

### GET /questions/eod
Get EOD questions for organization

### POST /questions/eod
Create new EOD question (Manager only)
```json
{
  "section": "reflection",
  "question_text": "Did you follow up on all leads?",
  "question_type": "boolean",
  "question_order": 15
}
```

### PUT /questions/eod/:id
Update EOD question (Manager only)

### DELETE /questions/eod/:id
Deactivate EOD question (Manager only)

### GET /questions/weekly
Get weekly questions for organization

### POST /questions/weekly
Create new weekly question (Manager only)

### GET /questions/monthly
Get monthly questions for organization

### POST /questions/monthly
Create new monthly question (Manager only)

---

## Export & Integration

### GET /export/metrics
Export metrics data as CSV
Query parameters: `format`, `start_date`, `end_date`, `user_ids`

### GET /export/reports
Export reports data as PDF/CSV
Query parameters: `report_type`, `format`, `start_date`, `end_date`

### POST /webhooks/register
Register webhook endpoint
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["metric_submitted", "eod_completed"],
  "secret": "webhook_secret"
}
```

### GET /webhooks
List registered webhooks

### DELETE /webhooks/:id
Remove webhook

---

## Organization Management

### GET /organization
Get organization details

### PUT /organization
Update organization settings (Manager only)
```json
{
  "name": "Updated Agency Name",
  "settings": {
    "timezone": "America/New_York",
    "currency": "USD",
    "fiscal_year_start": "2024-01-01"
  }
}
```

### GET /organization/audit-log
Get organization audit log (Manager only)
Query parameters: `action`, `start_date`, `end_date`, `user_id`