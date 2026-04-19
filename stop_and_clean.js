const child_process = require('child_process');
const fs = require('fs');

try {
    // 1. Find process on port 3000
    const output = child_process.execSync('netstat -ano | findstr :3000').toString();
    const lines = output.trim().split('\n');
    const pidsToKill = new Set();
    
    for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts.length > 4) {
            const pid = parts[parts.length - 1];
            if (pid !== '0' && pid) {
                pidsToKill.add(pid);
            }
        }
    }

    // 2. Kill them
    for (const pid of pidsToKill) {
        console.log('Killing PID:', pid);
        try {
            child_process.execSync(`taskkill /F /PID ${pid}`);
        } catch(e) {
            console.log('Could not kill PID:', pid);
        }
    }
} catch(e) {
    console.log('No processes found on port 3000.');
}

// Wait a bit for filesystem to free up
setTimeout(() => {
    try {
        console.log('Clearing .next directory...');
        fs.rmSync('.next', { recursive: true, force: true });
        console.log('Directory cleaned.');
    } catch(e) {
        console.error('Failed to clean directory:', e.message);
    }
}, 1500);
