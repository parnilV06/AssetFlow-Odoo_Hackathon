require('dotenv').config();
const { prisma } = require('./src/config/prisma');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const API_URL = 'http://localhost:5001/api';

const logInfo = (msg) => console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`);
const logPass = (msg) => console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`);
const logFail = (msg, err = '') => console.log(`\x1b[31m[FAIL]\x1b[0m ${msg}`, err);

async function createSeedData() {
    logInfo('Creating Seed Data...');
    
    const dept = await prisma.department.upsert({
        where: { name: 'Maint Department' },
        update: { status: 'ACTIVE' },
        create: { name: 'Maint Department', status: 'ACTIVE' }
    });

    const category = await prisma.category.upsert({
        where: { name: 'Maint Category' },
        update: { status: 'ACTIVE' },
        create: { name: 'Maint Category', status: 'ACTIVE' }
    });

    const users = {
        admin: await prisma.user.upsert({
            where: { email: 'maint_admin@example.com' },
            update: { role: 'ADMIN', status: 'ACTIVE', departmentId: dept.id },
            create: { name: 'Maint Admin', email: 'maint_admin@example.com', password: 'hash', role: 'ADMIN', status: 'ACTIVE', departmentId: dept.id }
        }),
        emp: await prisma.user.upsert({
            where: { email: 'maint_emp@example.com' },
            update: { role: 'EMPLOYEE', status: 'ACTIVE', departmentId: dept.id },
            create: { name: 'Maint Emp', email: 'maint_emp@example.com', password: 'hash', role: 'EMPLOYEE', status: 'ACTIVE', departmentId: dept.id }
        }),
        tech: await prisma.user.upsert({
            where: { email: 'maint_tech@example.com' },
            update: { role: 'EMPLOYEE', status: 'ACTIVE', departmentId: dept.id },
            create: { name: 'Maint Tech', email: 'maint_tech@example.com', password: 'hash', role: 'EMPLOYEE', status: 'ACTIVE', departmentId: dept.id }
        }),
        inactiveTech: await prisma.user.upsert({
            where: { email: 'maint_tech_inactive@example.com' },
            update: { role: 'EMPLOYEE', status: 'INACTIVE', departmentId: dept.id },
            create: { name: 'Inactive Tech', email: 'maint_tech_inactive@example.com', password: 'hash', role: 'EMPLOYEE', status: 'INACTIVE', departmentId: dept.id }
        })
    };

    const createAsset = async (serial, status) => {
        let asset = await prisma.asset.findUnique({ where: { serialNumber: serial } });
        if (asset) {
            await prisma.asset.update({ where: { id: asset.id }, data: { status } });
        } else {
            asset = await prisma.asset.create({
                data: {
                    name: `Maint Asset ${status}`,
                    assetTag: `MA-${serial}`,
                    serialNumber: serial,
                    categoryId: category.id,
                    departmentId: dept.id,
                    status: status
                }
            });
        }
        return asset;
    };

    const availableAsset = await createAsset('MA-AV', 'AVAILABLE');
    const availableAsset2 = await createAsset('MA-AV2', 'AVAILABLE');
    const disposedAsset = await createAsset('MA-DP', 'DISPOSED');

    // Clean up active maintenance requests for available asset to start clean
    await prisma.maintenanceRequest.updateMany({
        where: { assetId: availableAsset.id, status: { notIn: ['RESOLVED', 'REJECTED'] } },
        data: { status: 'RESOLVED', resolvedAt: new Date() }
    });
    
    await prisma.maintenanceRequest.updateMany({
        where: { assetId: availableAsset2.id, status: { notIn: ['RESOLVED', 'REJECTED'] } },
        data: { status: 'RESOLVED', resolvedAt: new Date() }
    });

    return { dept, category, users, assets: { availableAsset, availableAsset2, disposedAsset } };
}

function generateTokens(users) {
    const tokens = {};
    for (const [key, user] of Object.entries(users)) {
        tokens[key] = jwt.sign({ id: user.id, role: user.role, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    }
    return tokens;
}

async function apiCall(method, endpoint, token, body = null) {
    const res = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: body ? JSON.stringify(body) : undefined
    });
    const json = await res.json().catch(() => null);
    return { status: res.status, json };
}

let fails = 0;

async function assert(name, condition, details = '') {
    if (condition) {
        logPass(name);
    } else {
        logFail(name, details);
        fails++;
    }
}

async function runTests() {
    logInfo('--- STARTING QA AUDIT FOR MAINTENANCE ---');
    const data = await createSeedData();
    const tokens = generateTokens(data.users);

    const adminToken = tokens.admin;
    const empToken = tokens.emp;

    logInfo('Running Positive Workflow Tests...');
    
    // 1. Raise Request (by Employee)
    let res = await apiCall('POST', '/maintenance', empToken, {
        assetId: data.assets.availableAsset.id,
        description: "Screen is completely shattered after drop",
        priority: "CRITICAL"
    });
    await assert('Raise Maintenance Request returns 201', res.status === 201, res.json);
    const reqId = res.json?.data?.id;
    let maint = await prisma.maintenanceRequest.findUnique({ where: { id: reqId } });
    await assert('Status is PENDING', maint.status === 'PENDING');
    await assert('RaisedBy derived from JWT', maint.requesterId === data.users.emp.id);
    let logs = await prisma.activityLog.findMany({ where: { action: 'MAINTENANCE_REQUESTED', entityId: reqId } });
    await assert('ActivityLog created for Request', logs.length > 0);
    
    // 2. Approve Request (by Admin)
    res = await apiCall('PATCH', `/maintenance/${reqId}`, adminToken, { status: "APPROVED" });
    await assert('Approve Request returns 200', res.status === 200, res.json);
    maint = await prisma.maintenanceRequest.findUnique({ where: { id: reqId } });
    await assert('Status updated to APPROVED', maint.status === 'APPROVED');
    logs = await prisma.activityLog.findMany({ where: { action: 'MAINTENANCE_APPROVED', entityId: reqId } });
    await assert('ActivityLog created for Approve', logs.length > 0);

    // 3. Assign Technician (by Admin)
    res = await apiCall('PATCH', `/maintenance/${reqId}`, adminToken, { status: "ASSIGNED", technicianId: data.users.tech.id });
    await assert('Assign Technician returns 200', res.status === 200, res.json);
    maint = await prisma.maintenanceRequest.findUnique({ where: { id: reqId } });
    await assert('Status updated to ASSIGNED and technician mapped', maint.status === 'ASSIGNED' && maint.technicianId === data.users.tech.id);
    logs = await prisma.activityLog.findMany({ where: { action: 'MAINTENANCE_ASSIGNED', entityId: reqId } });
    await assert('ActivityLog created for Assign', logs.length > 0);

    // 4. Start Maintenance
    res = await apiCall('PATCH', `/maintenance/${reqId}`, adminToken, { status: "IN_PROGRESS" });
    await assert('Start Maintenance returns 200', res.status === 200, res.json);
    maint = await prisma.maintenanceRequest.findUnique({ where: { id: reqId } });
    let asset = await prisma.asset.findUnique({ where: { id: data.assets.availableAsset.id } });
    await assert('Status updated to IN_PROGRESS', maint.status === 'IN_PROGRESS');
    await assert('Asset status updated to UNDER_MAINTENANCE', asset.status === 'UNDER_MAINTENANCE');
    logs = await prisma.activityLog.findMany({ where: { action: 'MAINTENANCE_STARTED', entityId: reqId } });
    await assert('ActivityLog created for Start', logs.length > 0);

    // 5. Resolve Maintenance
    res = await apiCall('PATCH', `/maintenance/${reqId}`, adminToken, { status: "RESOLVED" });
    await assert('Resolve Maintenance returns 200', res.status === 200, res.json);
    maint = await prisma.maintenanceRequest.findUnique({ where: { id: reqId } });
    asset = await prisma.asset.findUnique({ where: { id: data.assets.availableAsset.id } });
    await assert('Status updated to RESOLVED with resolvedAt', maint.status === 'RESOLVED' && maint.resolvedAt !== null);
    await assert('Asset status reverted to AVAILABLE', asset.status === 'AVAILABLE');
    logs = await prisma.activityLog.findMany({ where: { action: 'MAINTENANCE_RESOLVED', entityId: reqId } });
    await assert('ActivityLog created for Resolve', logs.length > 0);

    logInfo('Running State Machine Workflow Fences...');
    // Create fresh request
    res = await apiCall('POST', '/maintenance', empToken, {
        assetId: data.assets.availableAsset2.id,
        description: "Test state machine",
        priority: "LOW"
    });
    const req2Id = res.json?.data?.id;

    // PENDING -> IN_PROGRESS (invalid)
    res = await apiCall('PATCH', `/maintenance/${req2Id}`, adminToken, { status: "IN_PROGRESS" });
    await assert('PENDING -> IN_PROGRESS is blocked (409)', res.status === 409);

    // PENDING -> REJECTED (valid)
    res = await apiCall('PATCH', `/maintenance/${req2Id}`, adminToken, { status: "REJECTED" });
    await assert('PENDING -> REJECTED is valid (200)', res.status === 200);

    // REJECTED -> APPROVED (invalid)
    res = await apiCall('PATCH', `/maintenance/${req2Id}`, adminToken, { status: "APPROVED" });
    await assert('REJECTED -> APPROVED is blocked (409)', res.status === 409);

    logInfo('Running Negative Tests...');
    // Disposed Asset
    res = await apiCall('POST', '/maintenance', empToken, {
        assetId: data.assets.disposedAsset.id,
        description: "Disposed test",
        priority: "LOW"
    });
    await assert('Raise maintenance on disposed asset -> 409', res.status === 409);

    // Duplicate Request
    await apiCall('POST', '/maintenance', empToken, { assetId: data.assets.availableAsset.id, description: "Valid description text", priority: "LOW" });
    res = await apiCall('POST', '/maintenance', empToken, { assetId: data.assets.availableAsset.id, description: "Another valid text string", priority: "LOW" });
    await assert('Raise duplicate active request -> 409', res.status === 409);

    const dupReq = await prisma.maintenanceRequest.findFirst({ where: { assetId: data.assets.availableAsset.id, status: 'PENDING' }});

    // Inactive technician
    res = await apiCall('PATCH', `/maintenance/${dupReq.id}`, adminToken, { status: "APPROVED" });
    res = await apiCall('PATCH', `/maintenance/${dupReq.id}`, adminToken, { status: "ASSIGNED", technicianId: data.users.inactiveTech.id });
    await assert('Assign inactive technician -> 409', res.status === 409);

    // Invalid tech uuid
    res = await apiCall('PATCH', `/maintenance/${dupReq.id}`, adminToken, { status: "ASSIGNED", technicianId: "not-a-uuid" });
    await assert('Assign invalid UUID format -> 400', res.status === 400);

    // Missing fields (POST)
    res = await apiCall('POST', '/maintenance', empToken, { assetId: data.assets.availableAsset.id });
    await assert('Missing fields POST -> 400', res.status === 400);

    // Unknown payload fields
    res = await apiCall('POST', '/maintenance', empToken, { assetId: data.assets.availableAsset.id, description: "Test length of description string", priority: "LOW", hacking: true });
    await assert('Unknown payload fields -> 400', res.status === 400);

    // Employee attempting workflow update
    res = await apiCall('PATCH', `/maintenance/${dupReq.id}`, empToken, { status: "ASSIGNED", technicianId: data.users.tech.id });
    await assert('Employee attempting workflow update -> 403', res.status === 403);

    // Random maintenance ID
    res = await apiCall('PATCH', `/maintenance/00000000-0000-0000-0000-000000000000`, adminToken, { status: "APPROVED" });
    await assert('Random maintenance ID -> 404', res.status === 404);

    console.log(`\n\x1b[36m--- QA AUDIT COMPLETE ---\x1b[0m`);
    if (fails === 0) {
        console.log(`\x1b[32mALL TESTS PASSED! Maintenance module is production ready.\x1b[0m`);
    } else {
        console.log(`\x1b[31m${fails} TESTS FAILED! Check logs above.\x1b[0m`);
    }

    process.exit(0);
}

runTests();
