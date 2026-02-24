export default function DebugPage() {
    return (
        <div style={{ padding: '100px', textAlign: 'center', background: 'red', color: 'white', fontSize: '40px', fontWeight: 'black' }}>
            <h1>DEBUG MODE: SUCCESS ✅</h1>
            <p>If you see this, the app is LIVE and UPDATING.</p>
            <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
    );
}
