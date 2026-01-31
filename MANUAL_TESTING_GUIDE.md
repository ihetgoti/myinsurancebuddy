# Manual Testing Guide - AI Content Generation

## 🚀 Server Status
- **URL**: http://localhost:3002
- **Status**: ✅ Running
- **Health Check**: http://localhost:3002/api/health

---

## 📋 Pre-Test Setup

### 1. Check Database Connection
```bash
curl http://localhost:3002/api/health
```
Expected: `{"status":"ok","database":"up"}`

### 2. Login to Admin Dashboard
- Go to: http://localhost:3002/login
- Use your admin credentials
- Navigate to: **Dashboard → AI Providers**

---

## 🧪 Test 1: Add Test Providers (WITHOUT Real API Keys)

Since you don't have 5 OpenRouter accounts yet, let's add **test providers**:

### Option A: Via Admin UI
1. Go to: http://localhost:3002/dashboard/ai-providers
2. Click "Add Provider"
3. Add 2-3 test providers with **fake keys**:
   - Name: "Test Account 1"
   - API Key: `sk-test-1`
   - Model: `deepseek/deepseek-r1:free`
   
### Option B: Via API (Quick)
```bash
# Add test provider 1
curl -X POST http://localhost:3002/api/admin/ai-providers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Account 1",
    "apiKey": "sk-or-v1-test-key-1",
    "preferredModel": "deepseek/deepseek-r1:free",
    "priority": 1
  }'

# Add test provider 2
curl -X POST http://localhost:3002/api/admin/ai-providers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Account 2", 
    "apiKey": "sk-or-v1-test-key-2",
    "preferredModel": "google/gemini-2.0-flash-exp:free",
    "priority": 2
  }'
```

---

## 🧪 Test 2: Verify Provider Rotation

### Test Failover Behavior
```bash
# Test with a single page generation
curl -X POST http://localhost:3002/api/ai-generate \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "filters": {
      "insuranceTypeId": "your-insurance-type-id"
    },
    "sections": ["intro", "requirements"],
    "batchSize": 1,
    "priority": "states-only"
  }'
```

**Expected**: Should try Provider 1 → Fail → Try Provider 2 → Fail → Pause (since keys are fake)

---

## 🧪 Test 3: Create Auto-Generate Job

### Step 1: Create a Job
```bash
curl -X POST http://localhost:3002/api/auto-generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Job - California Auto",
    "filters": {
      "insuranceTypeId": "YOUR_INSURANCE_TYPE_ID",
      "stateIds": ["YOUR_STATE_ID"],
      "geoLevels": ["STATE"]
    },
    "sections": ["intro", "requirements", "faqs"],
    "model": "deepseek/deepseek-r1:free",
    "batchSize": 5,
    "delayBetweenBatches": 2000
  }'
```

### Step 2: Start the Job
```bash
# Replace JOB_ID with the ID from Step 1
curl -X POST http://localhost:3002/api/auto-generate/JOB_ID/execute
```

### Step 3: Check Status (While Running)
```bash
# Check every few seconds
curl http://localhost:3002/api/auto-generate/JOB_ID/status
```

**Expected Response**:
```json
{
  "id": "...",
  "status": "PROCESSING",
  "totalPages": 1,
  "processedPages": 0,
  "percentComplete": 0
}
```

---

## 🧪 Test 4: Test Pause on Rate Limit

Since you have fake API keys, the job should **PAUSE** after failing both providers:

### Check Paused Status
```bash
curl http://localhost:3002/api/auto-generate/JOB_ID/status
```

**Expected Response**:
```json
{
  "id": "...",
  "status": "PAUSED",
  "isPaused": true,
  "canResume": true,
  "autoResumeAt": "2026-02-01T12:00:00Z",
  "timeUntilResume": 1440,
  "processedPages": 0,
  "resumeState": {
    "lastProcessedStateId": "...",
    "processedCount": 0
  }
}
```

---

## 🧪 Test 5: Resume Paused Job

### Resume the Job
```bash
curl -X POST http://localhost:3002/api/auto-generate/JOB_ID/execute
```

**Expected**: Job resumes from where it paused

---

## 🧪 Test 6: Test Free Model Protection

### Verify Deposit Protection
```bash
# Try to use a PAID model (should be blocked)
curl -X POST http://localhost:3002/api/ai-generate \
  -H "Content-Type: application/json" \
  -d '{
    "filters": {...},
    "sections": ["intro"],
    "model": "openai/gpt-4o"  <-- PAID MODEL
  }'
```

**Expected**: System should log warning and switch to free model:
```
⚠️ Model "openai/gpt-4o" is paid. Switching to free model to protect deposit.
```

---

## 🖥️ UI Testing Checklist

### Dashboard Tests
- [ ] Navigate to **AI Providers** page
- [ ] Add a new provider
- [ ] See list of all providers
- [ ] Check provider status (Active/Inactive)

### Auto-Generate Tests
- [ ] Go to **Auto-Generate** page
- [ ] Click "New Job"
- [ ] Select insurance type
- [ ] Select states
- [ ] Choose sections (intro, faqs, etc.)
- [ ] Submit job
- [ ] Watch progress bar
- [ ] Verify it shows "Paused" when rate limited
- [ ] Click "Resume" button

### Job Status Tests
- [ ] View job list
- [ ] Click on a job to see details
- [ ] Check processed/successful/failed counts
- [ ] View error log

---

## 🔍 Debug Logs

### View Server Logs
```bash
# In another terminal, tail the logs
cd /Users/hetgoti/Het@Peersonal/myinsurancebuddy/apps/admin
pnpm dev 2>&1 | grep -E "(Provider|Rate limit|Paused|Resumed|Error)"
```

### Check Database
```bash
# List all jobs
psql myinsurancebuddy_dev -c "SELECT id, name, status, processed_pages, total_pages FROM ai_generation_jobs;"

# List all providers
psql myinsurancebuddy_dev -c "SELECT name, is_active, request_count, last_error FROM aiproviders;"
```

---

## 🐛 Common Issues

### Issue 1: "No AI providers available"
**Fix**: Add providers in Dashboard → AI Providers

### Issue 2: "Unauthorized"
**Fix**: Login first at http://localhost:3002/login

### Issue 3: Job stuck at "PENDING"
**Fix**: Job needs to be started:
```bash
curl -X POST http://localhost:3002/api/auto-generate/JOB_ID/execute
```

---

## ✅ Success Criteria

| Test | Expected Result |
|------|-----------------|
| Add providers | Providers appear in list |
| Start job | Status changes to PROCESSING |
| Fake API keys | Job PAUSES after retries |
| Check status | Shows `isPaused: true` |
| Resume job | Continues from saved state |
| Paid model request | Auto-switches to free model |
| Progress tracking | Processed count increases |

---

## 📝 Next Steps After Testing

Once testing is complete:

1. **Get real API keys** from OpenRouter
2. **Deposit $10** in each account
3. **Update providers** with real keys
4. **Start real generation** job
5. **Monitor daily** for pause/resume cycles

---

**Need help?** Check the logs or run:
```bash
curl http://localhost:3002/api/health
curl http://localhost:3002/api/auto-generate/JOB_ID/status
```
