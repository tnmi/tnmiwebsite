# 🔧 Quick Reference: Migrated API Endpoints

## Market Intelligence History

### ❌ OLD (Deprecated - DO NOT USE)
```typescript
// GET request with ID in URL
const response = await fetch(
  `/api/market-intelligence/history?product_id=${productId}`,
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);
```

### ✅ NEW (Use This)
```typescript
// POST request with ID in body
const response = await fetch(
  '/api/market-intelligence/history/query',
  {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product_id: productId,
      limit: 10,           // optional, default: 10
      production: false    // optional, default: false
    })
  }
);
```

### Using the API Client (Recommended)
```typescript
import { marketIntelligenceAPI } from '@/lib/market-intelligence-api';

// The API client handles everything automatically
const history = await marketIntelligenceAPI.getMarketIntelligenceHistory(
  userId,
  productId,
  10  // optional limit
);
```

---

## Request/Response Format

### Request Body
```json
{
  "product_id": "prod_abc123",
  "limit": 10,
  "production": false
}
```

### Success Response (200)
```json
{
  "user_id": "user_xyz",
  "product_id": "prod_abc123",
  "count": 3,
  "history": [
    {
      "session_id": "session_123",
      "product_id": "prod_abc123",
      "created_at": "2025-12-11T10:30:00Z",
      "timestamp": "2025-12-11T10:30:00Z",
      "output": {
        "session_id": "session_123",
        "market_segments": { /* ... */ },
        "metadata": { /* ... */ }
      }
    }
  ]
}
```

### Error Response (400)
```json
{
  "error": "product_id is required",
  "error_id": "MISSING_PRODUCT_ID"
}
```

### Error Response (401)
```json
{
  "error": "Authorization required",
  "error_id": "AUTH_MISSING"
}
```

---

## Common Mistakes

### ❌ Forgetting Content-Type Header
```typescript
// WRONG - Will fail with 400 error
fetch('/api/market-intelligence/history/query', {
  method: 'POST',
  body: JSON.stringify({ product_id: 'abc' })
})
```

### ✅ Correct
```typescript
// RIGHT - Includes Content-Type
fetch('/api/market-intelligence/history/query', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({ product_id: 'abc' })
})
```

---

### ❌ Using Old Endpoint
```typescript
// WRONG - Old GET endpoint (insecure)
fetch(`/api/market-intelligence/history?product_id=${id}`)
```

### ✅ Correct
```typescript
// RIGHT - New POST endpoint (secure)
fetch('/api/market-intelligence/history/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ product_id: id })
})
```

---

## TypeScript Types

```typescript
// Request
interface GetHistoryRequest {
  product_id: string;
  limit?: number;        // default: 10
  production?: boolean;  // default: false
}

// Response
interface MarketIntelligenceHistoryResponse {
  user_id: string;
  product_id: string;
  count: number;
  history: MarketIntelligenceHistoryItem[];
}

interface MarketIntelligenceHistoryItem {
  session_id: string;
  product_id: string;
  created_at: string;
  timestamp: string;
  output: MarketIntelligenceResponse;
}
```

---

## Security Checklist

✅ **DO:**
- Use POST method for all endpoints with sensitive IDs
- Send IDs in request body, not URL
- Include Authorization header
- Include Content-Type: application/json header
- Validate response status before parsing

❌ **DON'T:**
- Put product_id or session_id in URL query parameters
- Put product_id or session_id in URL path
- Use GET for endpoints that require IDs
- Forget Content-Type header
- Hardcode tokens in code

---

## Testing

### Manual Test
```bash
# Test with curl
curl -X POST https://your-app.com/api/market-intelligence/history/query \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"product_id":"prod_abc123","limit":5}'
```

### Browser DevTools
1. Open DevTools → Network tab
2. Trigger history load in UI
3. Find request to `/history/query`
4. Verify:
   - Method: POST ✅
   - Headers include `Content-Type: application/json` ✅
   - Request payload includes `product_id` ✅
   - URL does NOT contain `product_id` ✅

---

## Migration Date
**Migrated:** December 11, 2025  
**Backend Version:** 00077+
