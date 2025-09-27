export default function TestSimple() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Simple Test Page</h1>
      <p>If you can see this, the deployment is working!</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  )
}