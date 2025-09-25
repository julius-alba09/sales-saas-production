import { Navigation } from '@/components/navigation/Navigation';
import { Breadcrumb } from '@/components/navigation/Breadcrumb';
import {
  Section,
  Grid,
  Card,
  PageHeader,
  Button,
  FeatureItem
} from '@/components/ui/Optimized';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation />

      {/* Header */}
      <PageHeader 
        title="Complete Sales SaaS Platform Features"
        description="Comprehensive tools for agencies, sales reps, and appointment setters"
      />

      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-6">
        <Breadcrumb />
      </div>

      {/* Features Content */}
      <div className="container mx-auto px-6 py-12 max-w-5xl">

        <Section title="Multi-Tenant Platform Architecture" icon="🏢">
          <Grid columns={2}>
            <Card 
              title="Platform Administration" 
              items={[
                "Super Admin Dashboard with organization overview",
                "Client Account Management (create, edit, suspend)",
                "Client Impersonation with full access rights",
                "Complete audit trail of all actions",
                "Subscription & billing management",
                "Platform-wide analytics & usage statistics",
              ]}
            />
            <Card 
              title="White Label & Branding" 
              items={[
                "Custom branding per client (logos, colors)",
                "Custom domain support (client.yourdomain.com)",
                "Branded email notification templates",
                "Custom application names per client",
              ]}
            />
          </Grid>
        </Section>

        <Section title="User Management & Permissions" icon="👥">
          <Grid columns={2}>
            <Card title="Role-Based Access Control" items={[
              "Platform Admin role with full access",
              "Client Admin for organization management", 
              "Sales Rep role with personal dashboard",
              "Appointment Setter for specialized metrics",
            ]} />
            <Card title="Team Management" items={[
              "Email-based team member invitations",
              "Granular permission management",
              "User status management (active/inactive)",
              "User profile and avatar management",
            ]} />
          </Grid>
        </Section>

        <Section title="Sales Performance Tracking" icon="📊">
          <Grid columns={2}>
            <Card title="Sales Rep Metrics" items={[
              "Daily metrics entry (calls, offers, closes)",
              "Cash collection tracking by product",
              "Automatic calculations (show rates, close rates)",
              "Product-specific tracking (A, B, C, D, E)",
              "Performance ratios and conversion metrics",
            ]} />
            <Card title="Appointment Setter Metrics" items={[
              "Outbound activity (calls, messaging time)",
              "Triage performance (offers, bookings, rates)",
              "Consult management and conversion rates",
              "Set performance (scheduled, closed, rates)",
              "Efficiency and conversion tracking",
            ]} />
          </Grid>
        </Section>

        <Section title="Analytics & Reporting" icon="📈" description="Comprehensive data visualizations and insights for all user roles">
          <Grid columns={2}>
            <Card title="Dashboard Components" items={[
              "KPI summary cards with today/yesterday toggle",
              "Interactive data tables (sort, filter)",
              "Revenue charts with time-based trends",
              "Leaderboard with customizable metrics",
              "Team vs individual view switching",
            ]} />
            <Card title="Advanced Analytics" variant="highlighted" items={[
              "Custom date range filtering",
              "Multi-metric analysis and comparisons",
              "Trend analysis over time",
              "Team member performance comparison",
              "Excel/CSV export for all reports",
            ]} />
          </Grid>
        </Section>

        <Section title="Comprehensive Reporting System" icon="📝">
          <Grid columns={2}>
            <Card title="End of Day (EOD) Reports">
              <div>
                <p className="text-gray-700 mb-3 font-medium">Quantitative Section:</p>
                <ul className="space-y-3 mb-4">
                  <FeatureItem>Sales metrics entry with product breakdown</FeatureItem>
                  <FeatureItem>Automatic calculation of derived metrics</FeatureItem>
                </ul>
                <p className="text-gray-700 mb-3 font-medium">Qualitative Section:</p>
                <ul className="space-y-3">
                  <FeatureItem>Pipeline management & conversation updates</FeatureItem>
                  <FeatureItem>Consult analysis & objection handling</FeatureItem>
                  <FeatureItem>Self reflection with 1-10 rating scale</FeatureItem>
                </ul>
              </div>
            </Card>
            <Card title="End of Week & Month Reports">
              <div>
                <p className="text-gray-700 mb-3 font-medium">EOW Reports:</p>
                <ul className="space-y-3 mb-4">
                  <FeatureItem>Weekly goal achievement analysis</FeatureItem>
                  <FeatureItem>Success analysis & future planning</FeatureItem>
                </ul>
                <p className="text-gray-700 mb-3 font-medium">EOM Reports:</p>
                <ul className="space-y-3 mb-4">
                  <FeatureItem>Monthly goal review & achievement analysis</FeatureItem>
                  <FeatureItem>Strategic planning for upcoming month</FeatureItem>
                </ul>
                <p className="text-gray-700 mb-3 font-medium">Custom Questionnaires:</p>
                <ul className="space-y-3">
                  <FeatureItem>Editable questions with multiple input types</FeatureItem>
                  <FeatureItem>Flexible required/optional fields</FeatureItem>
                </ul>
              </div>
            </Card>
          </Grid>
        </Section>

        <Section title="Notification & Communication" icon="🔔">
          <Grid columns={3}>
            <Card title="Email Notifications" items={[
              "Customizable notification frequency",
              "Individual and team notifications",
              "Direct reply functionality",
            ]} />
            <Card title="Slack Integration" items={[
              "Real-time Slack webhook alerts",
              "Channel-specific routing",
              "Rich formatting with key metrics",
            ]} />
            <Card title="Notification Settings" items={[
              "Frequency control (daily, weekly)",
              "Content filtering options",
              "Multi-channel delivery",
            ]} />
          </Grid>
        </Section>

        <Section title="Advanced Features" icon="🚀" description="Cutting-edge capabilities to maximize team efficiency and performance">
          <Grid columns={2}>
            <Card title="Business Intelligence" variant="bordered" items={[
              "Predictive analytics & trend forecasting",
              "Goal tracking with visual progress indicators",
              "AI-powered performance recommendations",
              "Historical & industry benchmarking",
            ]} />
            <Card title="Workflow Automation" variant="bordered" items={[
              "Automated reminders for EOD/EOW/EOM",
              "Context-aware alert prioritization",
              "Automatic error checking & validation",
              "Scheduled report generation & distribution",
            ]} />
          </Grid>
        </Section>

        <div className="flex justify-center mt-16">
          <Button href="/" variant="primary" size="lg">
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}