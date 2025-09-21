# Sales SaaS Application - Requirements & Features

## Dashboard Types

### 1. Agency Dashboard (User Dashboard)
**Target Users**: Sales agency owners/managers
**Permissions**: Full access - read/write/edit/delete
**Core Features**:
- Complete team performance overview
- Product/offer management system
- Team analytics and reporting
- User management and permissions
- Notification preference configuration
- Data analysis across all team members
- Leaderboard views with filtering capabilities

### 2. Sales Rep Dashboard
**Target Users**: Individual sales representatives
**Permissions**: Limited access - primarily data submission and personal reporting
**Core Features**:
- Personal performance tracking
- EOD/EOW/EOM report submission
- Individual KPI monitoring
- Goal setting and tracking
- Personal analytics and trends

### 3. Appointment Setter Dashboard
**Target Users**: Appointment setters working with sales reps
**Permissions**: Limited access - data submission and personal KPI tracking
**Core Features**:
- Specialized setter KPI tracking
- Call and messaging metrics
- Booking rate analytics
- Individual performance monitoring

## Key Performance Indicators (KPIs)

### Appointment Setter KPIs
1. **# of Outbound Calls**
2. **Minutes Spent Messaging**
3. **Triage Offers Made**
4. **Triage Calls Booked**
5. **Triage Booked Rate** = Triage Calls Booked / Triage Offers Made
6. **Consult Offers Made**
7. **Consult Calls Booked**
8. **Consult Booked Rate** = Consult Calls Booked / Consult Offers Made
9. **Scheduled Sets**
10. **Closed Sets**
11. **Close Rate** = Closed Sets / Scheduled Sets

### Sales Rep Metrics
#### Reported Metrics:
- Schedule Calls
- Live Calls
- Offers Made
- Closes
- Deposits
- Product A Closed (customizable product names)
- Product B Closed
- Product C Closed
- Product D Closed
- Product E Closed
- Product A Cash Collected
- Product B Cash Collected
- Product C Cash Collected
- Product D Cash Collected
- Product E Cash Collected

#### Calculated Metrics:
- **Show Rate** = Live Calls / Scheduled Calls
- **Offer Rate** = Offers / Live Calls
- **Call Close Rate** = Closes / Live Calls
- **Offer Close Rate** = Closes / Offers
- **Product A Percentage Collected** = Cash Collected / Product Price
- **Product B Percentage Collected** = Cash Collected / Product Price
- **Product C Percentage Collected** = Cash Collected / Product Price
- **Product D Percentage Collected** = Cash Collected / Product Price
- **Product E Percentage Collected** = Cash Collected / Product Price
- **Total Cash Collected**
- **Total Percentage Collected** = Total Cash Collected / Total Product Price Sold
- **Cash Collected / Offer** = Total Cash Collected / Offers
- **Cash Collected / Call** = Total Cash Collected / Live Calls

## Reporting System

### End of Day (EOD) Reporting

#### Section 1: Pipeline Management
- Is my Sales Pipeline 100% Updated? (Yes/No)
- Is my Conversations Tab 100% Updated? (Yes/No)
- How Many Warm Leads Do I Still Need to Call? (Number)

#### Section 2: Consults
- List Consults (Text field for objections, why they're not moving forward, plan for follow-up)

#### Section 3: Reflection
- How Would I Rate Myself? (1-10 scale)
- Did I uncover the true pain on my calls? (Yes/No)
- Did I isolate and overcome objections? (Yes/No)
- Did I have positive energy on my calls? (Yes/No)
- Did I operate at my full potential today? (Yes/No)
- Am I going to hit projections this week/month? (Yes/No)
- My overall performance: (Text field)

#### Section 4: Summary
- How was your day? (Text field)
- Where do you need help? (Text field)

### End of Week (EOW) Reporting

#### Section 1: Weekly Goal
- What was your weekly goal? Did you reach it? (Text field)
- What helped you succeed / What would you have needed to do differently to succeed? (Text field)
- What is your goal for next week? (Text field)
- What will you do differently next week to reach your goal? (Text field)

#### Section 2: Summary
- How was your week? (Text field)
- Where do you need help? (Text field)

### End of Month (EOM) Reporting

#### Section 1: Monthly Goal
- What was your monthly goal? Did you reach it? (Text field)
- What helped you succeed / What would you have needed to do differently to succeed? (Text field)
- What is your goal for next month? (Text field)
- What will you do differently next month to reach your goal? (Text field)

#### Section 2: Summary
- How was your month? (Text field)
- Where do you need help? (Text field)

## Core Features

### User Management & Permissions
- **Manager Access**: Full CRUD permissions, can edit data and product names
- **User Access**: Can only submit data, view personal analytics
- Multi-tenant architecture supporting multiple agencies
- Team invitation and onboarding system

### Product Management
- Customizable product/offer names (replace "Product A" with actual product names)
- Product pricing configuration
- Product-specific analytics and reporting

### Analytics & Reporting
- **Individual Analysis**: Per-rep detailed performance tracking
- **Team Analysis**: Aggregated team performance and comparisons
- **Leaderboard System**: Filterable by any metric
- **Trend Analysis**: Historical performance tracking
- **Comparative Analysis**: Rep-to-rep and team-to-team comparisons

### Notification System
- **Frequency Options**:
  - Daily email per rep
  - Daily email for team totals
  - Monthly per rep
  - Monthly team totals
  - No notifications
- **Report Types**:
  - EOD notifications
  - Weekly performance summaries
  - Monthly performance reports

### Customization Features
- **Editable Questions**: Managers can customize EOD/EOW/EOM questions
- **Flexible KPIs**: Ability to add/remove tracking metrics
- **Custom Dashboards**: Personalized views based on role and preferences
- **Branding**: White-label capabilities for agencies

## Technical Requirements

### Security
- Role-based access control (RBAC)
- JWT authentication
- Data encryption at rest and in transit
- Audit logging for sensitive operations

### Performance
- Real-time data updates
- Responsive design for mobile and desktop
- Fast query performance for analytics
- Caching for frequently accessed data

### Integration Capabilities
- API endpoints for third-party integrations
- Webhook support for real-time notifications
- Export functionality (CSV, PDF reports)
- Import capabilities for bulk data entry

### Scalability
- Multi-tenant architecture
- Horizontal scaling capabilities
- Database optimization for large datasets
- CDN support for global performance