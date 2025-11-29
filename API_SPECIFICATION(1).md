# MASH IoT Device API Specification

## 📊 Implementation Progress

**Overall Progress:** 🟡 **25%** (4/16 endpoints + 1/5 features partially complete)

**Last Updated:** November 11, 2025

### ✅ Completed Features
1. ✅ **Core Infrastructure Setup** (Phase 1 - 100%)
   - Database schema created and migrated
   - Redis configured for caching
   - JWT authentication middleware implemented
   - Device API key middleware implemented

### 🚧 In Progress
1. 🚧 **Device Registration** (40% complete)
   - ✅ Database schema ready
   - ✅ Authentication middleware ready
   - ⏳ POST /devices endpoint (next step)
   - ⏳ API key generation endpoint
   - ⏳ Unit tests

### ⏳ Pending Features
1. **Device Monitoring** - Real-time status tracking
2. **Fleet Management** - Multi-device analytics
3. **Sensor/Actuator APIs** - 10 endpoints remaining
4. **Postman Collection** - Testing & validation

---

## 🎯 Current Sprint: Week 1 - Device Registration

**Sprint Goal:** Complete first 3 endpoints (POST /devices, GET /devices, GET /devices/:deviceId)  
**Sprint Duration:** 3 days remaining  
**Completed:** 0/3 endpoints  
**Blocked:** None

---

## 🚀 IMMEDIATE NEXT STEPS (Action Required Today)

### Priority 1: Implement Device Registration Endpoint ⏰ 3 hours
**Status:** 🔴 CRITICAL - Start immediately

#### Step 2.1: Create Device Service Layer
**File:** `src/services/deviceService.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export class DeviceService {
  // Check if device exists by device ID
  static async findByDeviceId(deviceId: string) {
    return await prisma.device.findUnique({
      where: { deviceId }
    });
  }

  // Check if device exists by API key
  static async findByApiKey(apiKey: string) {
    const deviceKey = await prisma.deviceApiKey.findUnique({
      where: { apiKey },
      include: { device: true }
    });
    return deviceKey?.device;
  }

  // Create new device
  static async create(data: {
    deviceId: string;
    userId: string;
    name: string;
    type: string;
    location?: string;
    ipAddress?: string;
    port?: number;
    configuration?: any;
    status: string;
  }) {
    return await prisma.device.create({
      data: {
        id: uuidv4(),
        ...data,
        lastSeen: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
  }

  // Get device by ID
  static async findById(id: string) {
    return await prisma.device.findUnique({
      where: { id }
    });
  }

  // Get user's devices with filters
  static async findByUserId(
    userId: string,
    filters: {
      status?: string;
      type?: string;
      page?: number;
      limit?: number;
    }
  ) {
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;

    const [devices, total] = await Promise.all([
      prisma.device.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.device.count({ where })
    ]);

    return {
      devices,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  // Update device
  static async update(deviceId: string, data: any) {
    return await prisma.device.update({
      where: { deviceId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  // Delete device
  static async delete(deviceId: string) {
    return await prisma.device.delete({
      where: { deviceId }
    });
  }
}
```

**Action Items:**
- [ ] Create the file `src/services/deviceService.ts`
- [ ] Copy the code above
- [ ] Install dependencies: `npm install uuid @types/uuid`
- [ ] Test connection: Add console.log in create method

---

#### Step 2.2: Create Device Controller
**File:** `src/controllers/deviceController.ts`

```typescript
import { Request, Response } from 'express';
import { DeviceService } from '../services/deviceService';
import { z } from 'zod';

// Validation schema
const registerDeviceSchema = z.object({
  deviceId: z.string().regex(/^MASH-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/, 'Invalid device ID format'),
  name: z.string().min(1).max(255),
  type: z.enum(['MUSHROOM_CHAMBER', 'ENVIRONMENTAL_SENSOR']),
  location: z.string().optional(),
  ipAddress: z.string().ip().optional(),
  port: z.number().int().min(1).max(65535).optional(),
  configuration: z.record(z.any()).optional()
});

export class DeviceController {
  // POST /devices - Register new device
  static async registerDevice(req: Request, res: Response) {
    try {
      // Validate request body
      const validatedData = registerDeviceSchema.parse(req.body);
      
      const userId = req.user.id; // From JWT middleware
      
      // Check if device already exists
      const existing = await DeviceService.findByDeviceId(validatedData.deviceId);
      if (existing) {
        return res.status(409).json({
          success: false,
          statusCode: 409,
          error: 'Conflict',
          message: 'Device already registered'
        });
      }
      
      // Create device
      const device = await DeviceService.create({
        ...validatedData,
        userId,
        status: 'OFFLINE'
      });
      
      return res.status(201).json({
        success: true,
        statusCode: 201,
        data: device
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'Bad Request',
          message: 'Validation failed',
          details: error.errors
        });
      }
      
      console.error('Register device error:', error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'Failed to register device'
      });
    }
  }

  // GET /devices - Get user's devices
  static async getDevices(req: Request, res: Response) {
    try {
      const userId = req.user.id;
      const filters = {
        status: req.query.status as string,
        type: req.query.type as string,
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10
      };

      const result = await DeviceService.findByUserId(userId, filters);

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: result
      });
    } catch (error) {
      console.error('Get devices error:', error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error'
      });
    }
  }

  // GET /devices/:deviceId - Get device details
  static async getDevice(req: Request, res: Response) {
    try {
      const { deviceId } = req.params;
      const userId = req.user.id;

      const device = await DeviceService.findByDeviceId(deviceId);

      if (!device) {
        return res.status(404).json({
          success: false,
          statusCode: 404,
          error: 'Not Found',
          message: 'Device not found'
        });
      }

      // Verify ownership
      if (device.userId !== userId) {
        return res.status(403).json({
          success: false,
          statusCode: 403,
          error: 'Forbidden',
          message: 'Access denied'
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: device
      });
    } catch (error) {
      console.error('Get device error:', error);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal Server Error'
      });
    }
  }
}
```

**Action Items:**
- [ ] Create `src/controllers/deviceController.ts`
- [ ] Install zod for validation: `npm install zod`
- [ ] Copy the code above

---

#### Step 2.3: Create Device Routes
**File:** `src/routes/deviceRoutes.ts`

```typescript
import { Router } from 'express';
import { DeviceController } from '../controllers/deviceController';
import { authenticate } from '../middleware/auth';

const router = Router();

// User endpoints (require JWT auth)
router.post('/devices', authenticate, DeviceController.registerDevice);
router.get('/devices', authenticate, DeviceController.getDevices);
router.get('/devices/:deviceId', authenticate, DeviceController.getDevice);

export default router;
```

**Action Items:**
- [ ] Create `src/routes/deviceRoutes.ts`
- [ ] Copy the code above

---

#### Step 2.4: Register Routes in Main App
**File:** `src/app.ts` or `src/index.ts`

```typescript
import deviceRoutes from './routes/deviceRoutes';

// ... existing code ...

app.use('/api/v1', deviceRoutes);

// ... rest of code ...
```

**Action Items:**
- [ ] Add device routes to your main app file
- [ ] Restart server: `npm run dev`

---

### Priority 2: Test First Endpoint ⏰ 1 hour

#### Step 3.1: Manual Testing with Postman

1. **Get JWT Token:**
   - Login with existing user endpoint
   - Copy the `access_token` from response

2. **Create Postman Request:**
   ```
   POST {{base_url}}/devices
   Headers:
     Authorization: Bearer <your-jwt-token>
     Content-Type: application/json
   
   Body:
   {
     "deviceId": "MASH-A1-CAL25-AC2415",
     "name": "Test Mushroom Chamber",
     "type": "MUSHROOM_CHAMBER",
     "location": "Lab A",
     "ipAddress": "192.168.1.100",
     "port": 5000,
     "configuration": {
       "spawningTempMin": 20,
       "spawningTempMax": 25
     }
   }
   ```

3. **Expected Response:** `201 Created`

**Action Items:**
- [ ] Test successful registration (should return 201)
- [ ] Test duplicate registration (should return 409)
- [ ] Test invalid device ID format (should return 400)
- [ ] Test missing required fields (should return 400)
- [ ] Test without auth token (should return 401)

---

#### Step 3.2: Unit Tests (Optional for now, recommended later)

**File:** `src/tests/device.test.ts`

```typescript
import request from 'supertest';
import app from '../app';

describe('Device Registration', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login and get token
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    authToken = response.body.data.accessToken;
  });

  it('should register a new device', async () => {
    const response = await request(app)
      .post('/api/v1/devices')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        deviceId: 'MASH-TEST-001-ABC',
        name: 'Test Device',
        type: 'MUSHROOM_CHAMBER'
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.deviceId).toBe('MASH-TEST-001-ABC');
  });

  it('should reject duplicate device', async () => {
    const response = await request(app)
      .post('/api/v1/devices')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        deviceId: 'MASH-TEST-001-ABC',
        name: 'Duplicate Device',
        type: 'MUSHROOM_CHAMBER'
      });

    expect(response.status).toBe(409);
  });
});
```

**Action Items (Later):**
- [ ] Install testing dependencies: `npm install -D jest @types/jest supertest @types/supertest ts-jest`
- [ ] Configure Jest
- [ ] Write unit tests
- [ ] Run tests: `npm test`

---

### Priority 3: Update Progress Tracking ⏰ 5 minutes

After completing endpoint #1, update this document:

**Action Items:**
- [ ] Mark `POST /devices` as ✅ Done in Endpoints Table below
- [ ] Update progress percentage at top (1/16 = 6%)
- [ ] Check off items in Feature 1 checklist
- [ ] Commit changes to Git

---

## 📋 Updated Implementation Checklist

### Phase 1: Core Infrastructure ✅ COMPLETE
- [x] Set up database schema (devices, sensor_readings, actuator_states, device_logs)
- [x] Create migrations and seeders
- [x] Set up Redis for caching and pub/sub
- [x] Implement JWT authentication middleware
- [x] Create device API key middleware (`X-Device-Key`)
- [x] Set up error handling and logging

### Phase 2: Device Registration & Auth 🚧 IN PROGRESS (33%)
- [ ] Implement device registration endpoint ⏰ TODAY
- [ ] Certificate generation system
- [ ] API key generation and validation
- [ ] Device ownership middleware ✅ DONE (in controller)
- [ ] Unit tests for auth flows

### Phase 3: Monitoring & Health ⏳ NOT STARTED
- [ ] Heartbeat endpoint with Redis caching
- [ ] Health metrics calculation
- [ ] WebSocket server setup
- [ ] Real-time event broadcasting
- [ ] Offline detection background job

### Phase 4: Fleet Management ⏳ NOT STARTED
- [ ] Device listing with advanced filters
- [ ] Update/delete operations
- [ ] Analytics aggregation queries
- [ ] Bulk operations
- [ ] Background job for analytics

### Phase 5: Sensor & Actuator APIs ⏳ NOT STARTED
- [ ] Sensor reading submission (batch insert)
- [ ] Historical data queries with intervals
- [ ] Actuator control endpoints
- [ ] Rate limiting configuration
- [ ] Audit logging

### Phase 6: Testing & Documentation ⏳ NOT STARTED
- [ ] Create Postman collection
- [ ] End-to-end testing
- [ ] Load testing (sensor submissions)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment scripts

---

## 📊 Progress Tracking

### Endpoints Completion Status

| # | Endpoint | Method | Status | Priority | Est. Time | Actual Time |
|---|----------|--------|--------|----------|-----------|-------------|
| 1 | `/devices` | POST | 🚧 In Progress | HIGH | 3h | - |
| 2 | `/devices` | GET | ⏳ Not Started | HIGH | 2h | - |
| 3 | `/devices/:deviceId` | GET | ⏳ Not Started | HIGH | 1h | - |
| 4 | `/devices/:deviceId` | PATCH | ⏳ Not Started | MEDIUM | 2h | - |
| 5 | `/devices/:deviceId` | DELETE | ⏳ Not Started | MEDIUM | 1h | - |
| 6 | `/devices/:deviceId/readings` | POST | ⏳ Not Started | HIGH | 3h | - |
| 7 | `/devices/:deviceId/readings` | GET | ⏳ Not Started | HIGH | 4h | - |
| 8 | `/devices/:deviceId/readings/latest` | GET | ⏳ Not Started | MEDIUM | 1h | - |
| 9 | `/devices/:deviceId/analytics` | GET | ⏳ Not Started | MEDIUM | 5h | - |
| 10 | `/devices/:deviceId/mode` | POST | ⏳ Not Started | HIGH | 2h | - |
| 11 | `/devices/:deviceId/actuators/:name` | POST | ⏳ Not Started | HIGH | 2h | - |
| 12 | `/devices/:deviceId/actuators` | GET | ⏳ Not Started | MEDIUM | 1h | - |
| 13 | `/devices/:deviceId/actuators/state` | POST | ⏳ Not Started | HIGH | 2h | - |
| 14 | `/devices/:deviceId/heartbeat` | POST | ⏳ Not Started | HIGH | 2h | - |
| 15 | `/devices/:deviceId/health` | GET | ⏳ Not Started | MEDIUM | 3h | - |
| 16 | `/devices/:deviceId/api-key` | POST | ⏳ Not Started | HIGH | 2h | - |

**Total Estimated Time:** 36 hours (4-5 days)  
**Time Spent So Far:** 5 hours (infrastructure setup)  
**Remaining Time:** 31 hours

---

## 🎯 Updated Timeline

### ✅ Completed (Nov 11, 2025)
- Database setup & migrations
- Redis configuration
- Auth middleware implementation

### 🔴 Today (Nov 11, 2025 - Afternoon)
- [ ] Implement POST /devices endpoint (Priority 1)
- [ ] Manual testing with Postman (Priority 2)
- [ ] Update progress tracking (Priority 3)

### 🟡 Tomorrow (Nov 12, 2025)
- [ ] Implement GET /devices (list devices)
- [ ] Implement GET /devices/:deviceId (device details)
- [ ] Test all 3 endpoints together
- [ ] Create basic Postman collection

### 🟢 Rest of Week 1 (Nov 13-14, 2025)
- [ ] Implement PATCH /devices/:deviceId
- [ ] Implement DELETE /devices/:deviceId
- [ ] Implement POST /devices/:deviceId/api-key
- [ ] Complete Phase 2 (Registration & Auth)

### Week 2 Goal (Nov 18-22, 2025)
- Complete Phase 3 & Phase 4
- 10 endpoints total working
- WebSocket connection established

### Week 3-4 Goal (Nov 25 - Dec 6, 2025)
- Complete Phase 5 & Phase 6
- All 16 endpoints done
- Full Postman collection
- Deploy to Railway

---

## 🚨 Blockers & Issues

**Current Blockers:** None

**Potential Risks:**
1. ⚠️ WebSocket implementation might take longer than estimated
2. ⚠️ Time-series database optimization needs research
3. ⚠️ Certificate-based auth complexity

**Mitigation:**
- Start WebSocket research early
- Consider using existing libraries for time-series
- Certificate auth can be post-MVP

---

## 📝 Development Notes

### Completed Setup (Nov 11, 2025)
✅ Database tables created:
- `devices`
- `sensor_readings`  
- `actuator_states`
- `device_api_keys`

✅ Middleware ready:
- JWT authentication (`authenticate`)
- Device API key (`authenticateDevice`)

✅ Infrastructure:
- Redis connected
- Error handling configured
- Logging setup complete

### Next Steps After Current Task:
1. After POST /devices works → Implement GET endpoints
2. After GET endpoints work → Add UPDATE/DELETE
3. After CRUD complete → Move to sensor data endpoints
4. Parallel track: Start Postman collection early

---

## 🎯 Success Criteria Update

### Minimum Viable Product (MVP) - Updated
- ⏳ 16 endpoints implemented and tested (0/16 done)
- 🚧 Device registration with API key authentication (in progress)
- ⏳ Sensor data submission and retrieval
- ⏳ Actuator control (mode change + individual control)
- ⏳ Device heartbeat and health monitoring
- ⏳ Postman collection with 20+ test cases

**Current MVP Progress:** 25% (infrastructure complete, first endpoint in progress)

---

## 🎯 Task Breakdown: Complete IoT Device Management Backend System

### Feature 1: Device Registration (0%)
**Secure device onboarding with certificate-based authentication**

- [ ] **Endpoint 1:** `POST /devices` - Register device *(Priority: HIGH)*
- [ ] **Endpoint 2:** `POST /devices/:deviceId/api-key` - Generate device API key
- [ ] **Endpoint 3:** `POST /devices/:deviceId/certificate` - Issue device certificate
- [ ] Certificate validation middleware
- [ ] Device ownership verification
- [ ] Device ID uniqueness validation
- [ ] Database schema: `devices` table with indexes

**Estimated Time:** 8 hours  
**Dependencies:** User authentication system, PostgreSQL/MySQL setup

---

### Feature 2: Device Monitoring (0%)
**Real-time status tracking, health metrics, and diagnostics**

- [ ] **Endpoint 4:** `POST /devices/:deviceId/heartbeat` - Device heartbeat *(Priority: HIGH)*
- [ ] **Endpoint 5:** `GET /devices/:deviceId/health` - Health metrics
- [ ] **Endpoint 6:** `GET /devices/:deviceId` - Device details
- [ ] **Endpoint 7:** `GET /devices/:deviceId/readings/latest` - Latest sensor reading
- [ ] WebSocket connection for real-time updates
- [ ] Device offline detection (5 min timeout)
- [ ] Health status calculation logic
- [ ] Database schema: `device_health_logs` table

**Estimated Time:** 10 hours  
**Dependencies:** WebSocket server (Socket.io), Redis for pub/sub

---

### Feature 3: Fleet Management (0%)
**Multi-device management with analytics and bulk operations**

- [ ] **Endpoint 8:** `GET /devices` - List user's devices with filtering *(Priority: HIGH)*
- [ ] **Endpoint 9:** `PATCH /devices/:deviceId` - Update device
- [ ] **Endpoint 10:** `DELETE /devices/:deviceId` - Remove device
- [ ] **Endpoint 11:** `GET /devices/:deviceId/analytics` - Device analytics
- [ ] **Endpoint 12:** `POST /devices/bulk/control` - Bulk actuator control
- [ ] Advanced filtering (status, type, location)
- [ ] Pagination & sorting
- [ ] Analytics aggregation (24h, 7d, 30d, 90d)
- [ ] Background jobs for analytics calculation

**Estimated Time:** 12 hours  
**Dependencies:** Background job processor (Bull/BullMQ), TimescaleDB recommended

---

### Feature 4: API Endpoints - Sensor Data & Actuator Control (0%)
**15+ device management endpoints with advanced filtering**

**Sensor Data Endpoints:**
- [ ] **Endpoint 13:** `POST /devices/:deviceId/readings` - Submit sensor data *(Priority: HIGH)*
- [ ] **Endpoint 14:** `GET /devices/:deviceId/readings` - Historical data with intervals
- [ ] Batch insert optimization
- [ ] Time-series data aggregation
- [ ] Data retention policy (90 days raw, 1 year hourly, forever daily)

**Actuator Control Endpoints:**
- [ ] **Endpoint 15:** `POST /devices/:deviceId/mode` - Change mode (Spawning/Fruiting)
- [ ] **Endpoint 16:** `POST /devices/:deviceId/actuators/:actuatorName` - Control actuator
- [ ] **Endpoint 17:** `GET /devices/:deviceId/actuators` - Get actuator states
- [ ] **Endpoint 18:** `POST /devices/:deviceId/actuators/state` - IoT reports state
- [ ] Actuator command queuing
- [ ] Rate limiting (prevent abuse)
- [ ] Audit trail logging

**Estimated Time:** 10 hours  
**Dependencies:** Rate limiter (express-rate-limit), Queue system

---

### Feature 5: Postman IoT Collection (0%)
**Device lifecycle testing and fleet management validation**

- [ ] Create Postman workspace
- [ ] Environment variables setup (base URL, tokens, device IDs)
- [ ] **Collection 1:** Device Registration Flow
  - [ ] Register device
  - [ ] Generate API key
  - [ ] Issue certificate
  - [ ] Verify authentication
- [ ] **Collection 2:** Device Lifecycle
  - [ ] Heartbeat submission
  - [ ] Health check
  - [ ] Status updates
  - [ ] Device offline scenario
- [ ] **Collection 3:** Sensor Data Flow
  - [ ] Submit readings (single)
  - [ ] Submit readings (batch)
  - [ ] Query historical data
  - [ ] Test aggregation intervals
- [ ] **Collection 4:** Actuator Control
  - [ ] Change device mode
  - [ ] Control individual actuators
  - [ ] Bulk operations
  - [ ] State synchronization
- [ ] **Collection 5:** Fleet Management
  - [ ] List devices with filters
  - [ ] Update device configuration
  - [ ] Analytics queries
  - [ ] Delete device
- [ ] Pre-request scripts for auth tokens
- [ ] Test assertions (status codes, response validation)
- [ ] Documentation with examples

**Estimated Time:** 6 hours  
**Dependencies:** All endpoints implemented

---

## 📋 Implementation Checklist

### Phase 1: Core Infrastructure (Week 1)
- [ ] Set up database schema (devices, sensor_readings, actuator_states, device_logs)
- [ ] Create migrations and seeders
- [ ] Set up Redis for caching and pub/sub
- [ ] Implement JWT authentication middleware
- [ ] Create device API key middleware (`X-Device-Key`)
- [ ] Set up error handling and logging

### Phase 2: Device Registration & Auth (Week 1-2)
- [ ] Implement device registration endpoint
- [ ] Certificate generation system
- [ ] API key generation and validation
- [ ] Device ownership middleware
- [ ] Unit tests for auth flows

### Phase 3: Monitoring & Health (Week 2)
- [ ] Heartbeat endpoint with Redis caching
- [ ] Health metrics calculation
- [ ] WebSocket server setup
- [ ] Real-time event broadcasting
- [ ] Offline detection background job

### Phase 4: Fleet Management (Week 2-3)
- [ ] Device listing with advanced filters
- [ ] Update/delete operations
- [ ] Analytics aggregation queries
- [ ] Bulk operations
- [ ] Background job for analytics

### Phase 5: Sensor & Actuator APIs (Week 3)
- [ ] Sensor reading submission (batch insert)
- [ ] Historical data queries with intervals
- [ ] Actuator control endpoints
- [ ] Rate limiting configuration
- [ ] Audit logging

### Phase 6: Testing & Documentation (Week 3-4)
- [ ] Create Postman collection
- [ ] End-to-end testing
- [ ] Load testing (sensor submissions)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment scripts

---

## 🚀 Next Steps (Immediate Actions)

### Step 1: Database Setup (Priority: CRITICAL)
**Time: 2 hours**

1. **Create database schema:**
```sql
-- devices table
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(255) UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'OFFLINE',
  ip_address VARCHAR(45),
  port INTEGER,
  current_mode VARCHAR(50),
  configuration JSONB,
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_device_id ON devices(device_id);

-- sensor_readings table (consider TimescaleDB)
CREATE TABLE sensor_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(255) NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  co2 INTEGER,
  mode VARCHAR(50),
  alert BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_readings_device_timestamp ON sensor_readings(device_id, timestamp DESC);

-- actuator_states table
CREATE TABLE actuator_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(255) NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  blower_fan BOOLEAN DEFAULT FALSE,
  exhaust_fan BOOLEAN DEFAULT FALSE,
  humidifier BOOLEAN DEFAULT FALSE,
  led_lights BOOLEAN DEFAULT FALSE,
  last_updated TIMESTAMP DEFAULT NOW()
);

-- device_api_keys table
CREATE TABLE device_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id VARCHAR(255) NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
  api_key VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

2. **Run migrations**
3. **Set up connection pooling**
4. **Configure backup strategy**

---

### Step 2: Implement Device Registration (Priority: HIGH)
**Time: 6 hours**

**File: `src/controllers/deviceController.ts`**
```typescript
import { Request, Response } from 'express';
import { DeviceService } from '../services/deviceService';

export class DeviceController {
  static async registerDevice(req: Request, res: Response) {
    try {
      const userId = req.user.id; // From JWT middleware
      const deviceData = req.body;
      
      // Validate device ID format
      if (!deviceData.deviceId.match(/^MASH-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/)) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          error: 'Invalid device ID format'
        });
      }
      
      // Check if device already exists
      const existing = await DeviceService.findByDeviceId(deviceData.deviceId);
      if (existing) {
        return res.status(409).json({
          success: false,
          statusCode: 409,
          error: 'Device already registered'
        });
      }
      
      // Create device
      const device = await DeviceService.create({
        ...deviceData,
        userId,
        status: 'OFFLINE'
      });
      
      res.status(201).json({
        success: true,
        statusCode: 201,
        data: device
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        statusCode: 500,
        error: 'Internal server error'
      });
    }
  }
}
```

**File: `src/routes/deviceRoutes.ts`**
```typescript
import { Router } from 'express';
import { DeviceController } from '../controllers/deviceController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/devices', authenticate, DeviceController.registerDevice);

export default router;
```

**Tasks:**
- [ ] Create controller with validation
- [ ] Create service layer with database logic
- [ ] Add unit tests (Jest)
- [ ] Test with Postman

---

### Step 3: Set Up Authentication Middleware (Priority: HIGH)
**Time: 3 hours**

**File: `src/middleware/auth.ts`**
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: 'No token provided'
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      error: 'Invalid token'
    });
  }
};

export const authenticateDevice = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const apiKey = req.headers['x-device-key'];
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: 'No API key provided'
      });
    }
    
    // Verify API key in database
    const device = await DeviceService.findByApiKey(apiKey as string);
    
    if (!device) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        error: 'Invalid API key'
      });
    }
    
    req.device = device;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      error: 'Authentication failed'
    });
  }
};
```

---

### Step 4: Create Basic Postman Collection (Priority: MEDIUM)
**Time: 1 hour**

1. **Create new Postman collection:** "MASH IoT Device API"
2. **Set up environment variables:**
   - `base_url`: `https://mash-backend-api-production.up.railway.app/api/v1`
   - `auth_token`: `{{token}}` (auto-set after login)
   - `device_id`: `MASH-A1-CAL25-AC2415`
   - `device_api_key`: `{{device_key}}` (auto-set after key generation)

3. **Create first request:**
   - **Name:** Register Device
   - **Method:** POST
   - **URL:** `{{base_url}}/devices`
   - **Headers:** `Authorization: Bearer {{auth_token}}`
   - **Body:** Use example from specification

---

## 📊 Progress Tracking

### Endpoints Completion Status

| # | Endpoint | Method | Status | Priority | Est. Time |
|---|----------|--------|--------|----------|-----------|
| 1 | `/devices` | POST | ⏳ Not Started | HIGH | 3h |
| 2 | `/devices` | GET | ⏳ Not Started | HIGH | 2h |
| 3 | `/devices/:deviceId` | GET | ⏳ Not Started | HIGH | 1h |
| 4 | `/devices/:deviceId` | PATCH | ⏳ Not Started | MEDIUM | 2h |
| 5 | `/devices/:deviceId` | DELETE | ⏳ Not Started | MEDIUM | 1h |
| 6 | `/devices/:deviceId/readings` | POST | ⏳ Not Started | HIGH | 3h |
| 7 | `/devices/:deviceId/readings` | GET | ⏳ Not Started | HIGH | 4h |
| 8 | `/devices/:deviceId/readings/latest` | GET | ⏳ Not Started | MEDIUM | 1h |
| 9 | `/devices/:deviceId/analytics` | GET | ⏳ Not Started | MEDIUM | 5h |
| 10 | `/devices/:deviceId/mode` | POST | ⏳ Not Started | HIGH | 2h |
| 11 | `/devices/:deviceId/actuators/:name` | POST | ⏳ Not Started | HIGH | 2h |
| 12 | `/devices/:deviceId/actuators` | GET | ⏳ Not Started | MEDIUM | 1h |
| 13 | `/devices/:deviceId/actuators/state` | POST | ⏳ Not Started | HIGH | 2h |
| 14 | `/devices/:deviceId/heartbeat` | POST | ⏳ Not Started | HIGH | 2h |
| 15 | `/devices/:deviceId/health` | GET | ⏳ Not Started | MEDIUM | 3h |
| 16 | `/devices/:deviceId/api-key` | POST | ⏳ Not Started | HIGH | 2h |

**Total Estimated Time:** 36 hours (4-5 days)

---

## 🎯 Success Criteria

### Minimum Viable Product (MVP)
- ✅ 16 endpoints implemented and tested
- ✅ Device registration with API key authentication
- ✅ Sensor data submission and retrieval
- ✅ Actuator control (mode change + individual control)
- ✅ Device heartbeat and health monitoring
- ✅ Postman collection with 20+ test cases

### Advanced Features (Post-MVP)
- Certificate-based authentication (X.509)
- WebSocket real-time streaming
- Bulk operations API
- Advanced analytics with time-series aggregation
- Alert system with email/SMS notifications
- Device firmware update API
- Multi-tenancy support

---

## 📝 Notes for Development

1. **Use TypeScript** for type safety
2. **Repository pattern** for database operations
3. **Service layer** for business logic
4. **Controller layer** for request handling
5. **Middleware** for auth, validation, error handling
6. **Environment variables** for configuration
7. **Docker** for containerization
8. **CI/CD** with GitHub Actions
9. **Monitoring** with Sentry or New Relic
10. **API documentation** with Swagger

---

## Overview
This document specifies the REST API endpoints that need to be implemented in the MASH Backend for IoT device management, sensor data collection, and actuator control.

**Version:** 1.0  
**Base URL:** `https://mash-backend-api-production.up.railway.app/api/v1`  
**Authentication:** Bearer Token (JWT)

---

## Table of Contents
1. [Device Management](#device-management)
2. [Sensor Data](#sensor-data)
3. [Actuator Control](#actuator-control)
4. [Device Status & Health](#device-status--health)
5. [Data Models](#data-models)
6. [Webhooks & Real-time](#webhooks--real-time)

---

## Device Management

### 1. Register Device
Register a new IoT device to a user's account.

**Endpoint:** `POST /devices`  
**Auth:** Required  
**Request Body:**
```json
{
  "deviceId": "MASH-A1-CAL25-AC2415",
  "name": "Mushroom Prototype Chamber",
  "type": "MUSHROOM_CHAMBER",
  "location": "Lab Room A",
  "ipAddress": "192.168.1.100",
  "port": 5000,
  "configuration": {
    "spawningTempMin": 20,
    "spawningTempMax": 25,
    "fruitingTempMin": 15,
    "fruitingTempMax": 20,
    "spawningHumidityMin": 90,
    "spawningHumidityMax": 95,
    "fruitingHumidityMin": 85,
    "fruitingHumidityMax": 90,
    "spawningCO2Min": 10000,
    "fruitingCO2Min": 500,
    "fruitingCO2Max": 800
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "uuid-device-123",
    "deviceId": "MASH-A1-CAL25-AC2415",
    "name": "Mushroom Prototype Chamber",
    "type": "MUSHROOM_CHAMBER",
    "status": "OFFLINE",
    "userId": "uuid-user-456",
    "ipAddress": "192.168.1.100",
    "port": 5000,
    "lastSeen": null,
    "createdAt": "2024-11-06T06:00:00Z",
    "updatedAt": "2024-11-06T06:00:00Z"
  }
}
```

---

### 2. Get User's Devices
Retrieve all devices registered to the authenticated user.

**Endpoint:** `GET /devices`  
**Auth:** Required  
**Query Parameters:**
- `status` (optional): Filter by status (`ONLINE`, `OFFLINE`, `MAINTENANCE`)
- `type` (optional): Filter by device type
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "devices": [
      {
        "id": "uuid-device-123",
        "deviceId": "MASH-A1-CAL25-AC2415",
        "name": "Mushroom Prototype Chamber",
        "type": "MUSHROOM_CHAMBER",
        "status": "ONLINE",
        "ipAddress": "192.168.1.100",
        "port": 5000,
        "lastSeen": "2024-11-06T06:30:00Z",
        "currentMode": "SPAWNING",
        "createdAt": "2024-11-06T06:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

---

### 3. Get Device Details
Get detailed information about a specific device.

**Endpoint:** `GET /devices/:deviceId`  
**Auth:** Required  
**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "uuid-device-123",
    "deviceId": "MASH-A1-CAL25-AC2415",
    "name": "Mushroom Prototype Chamber",
    "type": "MUSHROOM_CHAMBER",
    "status": "ONLINE",
    "ipAddress": "192.168.1.100",
    "port": 5000,
    "currentMode": "SPAWNING",
    "lastSeen": "2024-11-06T06:30:00Z",
    "configuration": {
      "spawningTempMin": 20,
      "spawningTempMax": 25,
      "fruitingTempMin": 15,
      "fruitingTempMax": 20
    },
    "latestReading": {
      "temperature": 22.5,
      "humidity": 92.3,
      "co2": 12500,
      "timestamp": "2024-11-06T06:30:00Z"
    },
    "actuators": {
      "blower_fan": false,
      "exhaust_fan": false,
      "humidifier": true,
      "led_lights": false
    },
    "createdAt": "2024-11-06T06:00:00Z",
    "updatedAt": "2024-11-06T06:30:00Z"
  }
}
```

---

### 4. Update Device
Update device information.

**Endpoint:** `PATCH /devices/:deviceId`  
**Auth:** Required  
**Request Body:**
```json
{
  "name": "Updated Chamber Name",
  "location": "New Location",
  "ipAddress": "192.168.1.101",
  "configuration": {
    "spawningTempMin": 21
  }
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "uuid-device-123",
    "deviceId": "MASH-A1-CAL25-AC2415",
    "name": "Updated Chamber Name",
    "updatedAt": "2024-11-06T06:35:00Z"
  }
}
```

---

### 5. Delete Device
Remove a device from user's account.

**Endpoint:** `DELETE /devices/:deviceId`  
**Auth:** Required  
**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Device deleted successfully"
}
```

---

## Sensor Data

### 6. Submit Sensor Reading
IoT device submits sensor data to backend (called by RPi).

**Endpoint:** `POST /devices/:deviceId/readings`  
**Auth:** Device API Key (in header: `X-Device-Key`)  
**Request Body:**
```json
{
  "temperature": 22.5,
  "humidity": 92.3,
  "co2": 12500,
  "mode": "SPAWNING",
  "alert": false,
  "timestamp": "2024-11-06T06:30:00Z"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "statusCode": 201,
  "data": {
    "id": "uuid-reading-789",
    "deviceId": "MASH-A1-CAL25-AC2415",
    "temperature": 22.5,
    "humidity": 92.3,
    "co2": 12500,
    "mode": "SPAWNING",
    "alert": false,
    "timestamp": "2024-11-06T06:30:00Z",
    "createdAt": "2024-11-06T06:30:05Z"
  }
}
```

---

### 7. Get Sensor History
Retrieve historical sensor data for a device.

**Endpoint:** `GET /devices/:deviceId/readings`  
**Auth:** Required  
**Query Parameters:**
- `startDate` (optional): ISO 8601 date
- `endDate` (optional): ISO 8601 date
- `limit` (optional): Number of readings (default: 100, max: 1000)
- `interval` (optional): Aggregation interval (`1m`, `5m`, `15m`, `1h`, `1d`)

**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "readings": [
      {
        "id": "uuid-reading-789",
        "temperature": 22.5,
        "humidity": 92.3,
        "co2": 12500,
        "mode": "SPAWNING",
        "alert": false,
        "timestamp": "2024-11-06T06:30:00Z"
      },
      {
        "id": "uuid-reading-790",
        "temperature": 22.3,
        "humidity": 91.8,
        "co2": 12300,
        "mode": "SPAWNING",
        "alert": false,
        "timestamp": "2024-11-06T06:25:00Z"
      }
    ],
    "count": 2,
    "startDate": "2024-11-06T06:00:00Z",
    "endDate": "2024-11-06T06:30:00Z"
  }
}
```

---

### 8. Get Latest Reading
Get the most recent sensor reading for a device.

**Endpoint:** `GET /devices/:deviceId/readings/latest`  
**Auth:** Required  
**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "id": "uuid-reading-789",
    "temperature": 22.5,
    "humidity": 92.3,
    "co2": 12500,
    "mode": "SPAWNING",
    "alert": false,
    "timestamp": "2024-11-06T06:30:00Z"
  }
}
```

---

### 9. Get Analytics
Get aggregated analytics for a device.

**Endpoint:** `GET /devices/:deviceId/analytics`  
**Auth:** Required  
**Query Parameters:**
- `period`: Time period (`24h`, `7d`, `30d`, `90d`)
- `metrics`: Comma-separated metrics (`temperature`, `humidity`, `co2`, `all`)

**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "period": "24h",
    "temperature": {
      "min": 20.5,
      "max": 24.2,
      "avg": 22.3,
      "current": 22.5
    },
    "humidity": {
      "min": 88.5,
      "max": 95.0,
      "avg": 92.1,
      "current": 92.3
    },
    "co2": {
      "min": 11000,
      "max": 13500,
      "avg": 12250,
      "current": 12500
    },
    "alerts": {
      "total": 3,
      "resolved": 3,
      "active": 0
    }
  }
}
```

---

## Actuator Control

### 10. Set Device Mode
Change device operating mode (Spawning/Fruiting).

**Endpoint:** `POST /devices/:deviceId/mode`  
**Auth:** Required  
**Request Body:**
```json
{
  "mode": "FRUITING"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "deviceId": "MASH-A1-CAL25-AC2415",
    "mode": "FRUITING",
    "previousMode": "SPAWNING",
    "changedAt": "2024-11-06T06:35:00Z"
  }
}
```

---

### 11. Control Actuator
Control a specific actuator (relay).

**Endpoint:** `POST /devices/:deviceId/actuators/:actuatorName`  
**Auth:** Required  
**Request Body:**
```json
{
  "state": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "deviceId": "MASH-A1-CAL25-AC2415",
    "actuator": "humidifier",
    "state": true,
    "timestamp": "2024-11-06T06:35:00Z"
  }
}
```

---

### 12. Get Actuator States
Get current state of all actuators.

**Endpoint:** `GET /devices/:deviceId/actuators`  
**Auth:** Required  
**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "blower_fan": false,
    "exhaust_fan": false,
    "humidifier": true,
    "led_lights": false,
    "lastUpdated": "2024-11-06T06:35:00Z"
  }
}
```

---

### 13. Submit Actuator State (from IoT)
IoT device reports actuator state changes.

**Endpoint:** `POST /devices/:deviceId/actuators/state`  
**Auth:** Device API Key  
**Request Body:**
```json
{
  "actuators": {
    "blower_fan": false,
    "exhaust_fan": false,
    "humidifier": true,
    "led_lights": false
  },
  "timestamp": "2024-11-06T06:35:00Z"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Actuator states updated"
}
```

---

## Device Status & Health

### 14. Update Device Status (Heartbeat)
IoT device sends periodic heartbeat to indicate it's online.

**Endpoint:** `POST /devices/:deviceId/heartbeat`  
**Auth:** Device API Key  
**Request Body:**
```json
{
  "status": "ONLINE",
  "ipAddress": "192.168.1.100",
  "uptime": 86400,
  "timestamp": "2024-11-06T06:35:00Z"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Heartbeat received"
}
```

---

### 15. Get Device Health
Get device health metrics.

**Endpoint:** `GET /devices/:deviceId/health`  
**Auth:** Required  
**Response:** `200 OK`
```json
{
  "success": true,
  "statusCode": 200,
  "data": {
    "status": "HEALTHY",
    "uptime": 86400,
    "lastSeen": "2024-11-06T06:35:00Z",
    "connectivity": {
      "serialConnected": true,
      "networkLatency": 25
    },
    "sensors": {
      "scd41": "OPERATIONAL",
      "lcd": "OPERATIONAL"
    },
    "actuators": {
      "blower_fan": "OPERATIONAL",
      "exhaust_fan": "OPERATIONAL",
      "humidifier": "OPERATIONAL",
      "led_lights": "OPERATIONAL"
    }
  }
}
```

---

## Data Models

### Device
```typescript
interface Device {
  id: string;
  deviceId: string;  // Unique hardware ID
  userId: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  ipAddress?: string;
  port?: number;
  currentMode?: GrowingMode;
  configuration?: DeviceConfiguration;
  lastSeen?: Date;
  createdAt: Date;
  updatedAt: Date;
}

enum DeviceType {
  MUSHROOM_CHAMBER = 'MUSHROOM_CHAMBER',
  ENVIRONMENTAL_SENSOR = 'ENVIRONMENTAL_SENSOR'
}

enum DeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  ERROR = 'ERROR'
}

enum GrowingMode {
  SPAWNING = 'SPAWNING',
  FRUITING = 'FRUITING'
}
```

### Sensor Reading
```typescript
interface SensorReading {
  id: string;
  deviceId: string;
  temperature: number;  // Celsius
  humidity: number;     // Percentage
  co2: number;          // PPM
  mode: GrowingMode;
  alert: boolean;
  timestamp: Date;
  createdAt: Date;
}
```

### Actuator State
```typescript
interface ActuatorState {
  deviceId: string;
  blower_fan: boolean;
  exhaust_fan: boolean;
  humidifier: boolean;
  led_lights: boolean;
  lastUpdated: Date;
}
```

---

## Webhooks & Real-time

### 16. WebSocket Connection
Real-time sensor data streaming.

**Endpoint:** `WS /devices/:deviceId/stream`  
**Auth:** Token in query param `?token=xxx`  
**Events:**
```json
{
  "event": "sensor_reading",
  "data": {
    "temperature": 22.5,
    "humidity": 92.3,
    "co2": 12500,
    "timestamp": "2024-11-06T06:35:00Z"
  }
}

{
  "event": "actuator_change",
  "data": {
    "actuator": "humidifier",
    "state": true,
    "timestamp": "2024-11-06T06:35:00Z"
  }
}

{
  "event": "alert",
  "data": {
    "type": "CO2_LOW",
    "message": "CO2 level below threshold",
    "value": 9500,
    "timestamp": "2024-11-06T06:35:00Z"
  }
}
```

---

## Authentication

### Device API Key
IoT devices use a unique API key for authentication.

**Header:** `X-Device-Key: device-api-key-here`

**Generate Device Key:**
```
POST /devices/:deviceId/api-key
```

**Response:**
```json
{
  "success": true,
  "data": {
    "apiKey": "mash_device_xxxxxxxxxxxxxxxx",
    "expiresAt": null
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "statusCode": 400,
  "error": "Bad Request",
  "message": "Invalid device configuration",
  "timestamp": "2024-11-06T06:35:00Z"
}
```

**Common Status Codes:**
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (e.g., device already registered)
- `422` - Unprocessable Entity (validation error)
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Rate Limiting

- **User API:** 100 requests/minute
- **Device API:** 1000 requests/minute (for sensor data submission)
- **WebSocket:** 1 connection per device

---

## Notes for Backend Developer

1. **Database Schema:**
   - Create tables: `devices`, `sensor_readings`, `actuator_states`, `device_logs`
   - Index on: `deviceId`, `userId`, `timestamp`
   - Consider time-series database for sensor readings (e.g., TimescaleDB)

2. **Real-time:**
   - Implement WebSocket using Socket.io or native WS
   - Use Redis for pub/sub between API instances

3. **Data Retention:**
   - Raw sensor data: 90 days
   - Aggregated data (hourly): 1 year
   - Aggregated data (daily): Forever

4. **Security:**
   - Validate device ownership before allowing control
   - Rate limit actuator commands to prevent abuse
   - Log all actuator changes for audit trail

5. **Performance:**
   - Batch insert sensor readings
   - Cache latest reading per device
   - Use background jobs for analytics calculation

---

**End of API Specification**
