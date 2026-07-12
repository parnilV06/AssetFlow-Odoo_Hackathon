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
        where: { name: 'QA Department' },
        update: { status: 'ACTIVE' },
        create: { name: 'QA Department', status: 'ACTIVE' }
    });

    const category = await prisma.category.upsert({
        where: { name: 'QA Category' },
        update: { status: 'ACTIVE' },
        create: { name: 'QA Category', status: 'ACTIVE' }
    });

    const users = {
        admin: await prisma.user.upsert({
            where: { email: 'qa_admin@example.com' },
            update: { role: 'ADMIN', status: 'ACTIVE', departmentId: dept.id },
            create: { name: 'QA Admin', email: 'qa_admin@example.com', password: 'hash', role: 'ADMIN', status: 'ACTIVE', departmentId: dept.id }
        }),
        manager: await prisma.user.upsert({
            where: { email: 'qa_manager@example.com' },
            update: { role: 'ASSET_MANAGER', status: 'ACTIVE', departmentId: dept.id },
            create: { name: 'QA Manager', email: 'qa_manager@example.com', password: 'hash', role: 'ASSET_MANAGER', status: 'ACTIVE', departmentId: dept.id }
        }),
        employee1: await prisma.user.upsert({
            where: { email: 'qa_emp1@example.com' },
            update: { role: 'EMPLOYEE', status: 'ACTIVE', departmentId: dept.id },
            create: { name: 'QA Employee 1', email: 'qa_emp1@example.com', password: 'hash', role: 'EMPLOYEE', status: 'ACTIVE', departmentId: dept.id }
        }),
        employee2: await prisma.user.upsert({
            where: { email: 'qa_emp2@example.com' },
            update: { role: 'EMPLOYEE', status: 'ACTIVE', departmentId: dept.id },
            create: { name: 'QA Employee 2', email: 'qa_emp2@example.com', password: 'hash', role: 'EMPLOYEE', status: 'ACTIVE', departmentId: dept.id }
        }),
        inactive: await prisma.user.upsert({
            where: { email: 'qa_inactive@example.com' },
            update: { role: 'EMPLOYEE', status: 'INACTIVE', departmentId: dept.id },
            create: { name: 'QA Inactive', email: 'qa_inactive@example.com', password: 'hash', role: 'EMPLOYEE', status: 'INACTIVE', departmentId: dept.id }
        })
    };

    // Helper for assets
    const createAsset = async (serial, status) => {
        let asset = await prisma.asset.findUnique({ where: { serialNumber: serial } });
        if (asset) {
            await prisma.asset.update({ where: { id: asset.id }, data: { status } });
        } else {
            asset = await prisma.asset.create({
                data: {
                    name: `QA Asset ${status}`,
                    assetTag: `QA-${serial}`,
                    serialNumber: serial,
                    categoryId: category.id,
                    departmentId: dept.id,
                    status: status
                }
            });
        }
        return asset;
    };

    // We must reset allocations for these assets so tests start clean
    const availableAsset = await createAsset('QA-AV', 'AVAILABLE');
    const allocatedAsset = await createAsset('QA-AL', 'ALLOCATED');
    const maintenanceAsset = await createAsset('QA-MT', 'UNDER_MAINTENANCE');
    const disposedAsset = await createAsset('QA-DP', 'DISPOSED');

    // Make sure allocated asset actually has an active allocation
    await prisma.allocation.deleteMany({ where: { assetId: allocatedAsset.id } });
    await prisma.allocation.create({
        data: { assetId: allocatedAsset.id, userId: users.employee1.id, allocatedBy: users.admin.id }
    });

    // Make sure available asset has NO active allocations
    await prisma.allocation.updateMany({
        where: { assetId: availableAsset.id, returnedAt: null },
        data: { returnedAt: new Date() }
    });

    return { dept, category, users, assets: { availableAsset, allocatedAsset, maintenanceAsset, disposedAsset } };
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
    logInfo('--- STARTING QA AUDIT ---');
    const data = await createSeedData();
    const tokens = generateTokens(data.users);

    const adminToken = tokens.admin;
    const empToken = tokens.employee1;

    // Positive Tests
    logInfo('Running Positive Tests...');
    
    // Allocate Available Asset
    let res = await apiCall('POST', '/allocations/allocate', adminToken, {
        assetId: data.assets.availableAsset.id,
        employeeId: data.users.employee1.id,
        expectedReturn: new Date(Date.now() + 86400000).toISOString()
    });
    await assert('Allocate Available Asset returns 201', res.status === 201, res.json);
    let updatedAsset = await prisma.asset.findUnique({ where: { id: data.assets.availableAsset.id } });
    await assert('Asset status updated to ALLOCATED', updatedAsset.status === 'ALLOCATED');
    let logs = await prisma.activityLog.findMany({ where: { action: 'ASSET_ALLOCATED', entityId: res.json?.data?.id } });
    await assert('ActivityLog created for Allocation', logs.length > 0);

    // Return Asset
    res = await apiCall('POST', '/allocations/return', adminToken, {
        assetId: data.assets.availableAsset.id, // now allocated
        conditionNotes: "Looks good"
    });
    await assert('Return Asset returns 200', res.status === 200, res.json);
    updatedAsset = await prisma.asset.findUnique({ where: { id: data.assets.availableAsset.id } });
    await assert('Asset status updated to AVAILABLE', updatedAsset.status === 'AVAILABLE');
    logs = await prisma.activityLog.findMany({ where: { action: 'ASSET_RETURNED', entityId: res.json?.data?.id } });
    await assert('ActivityLog created for Return', logs.length > 0);

    // Transfer Asset (requires an allocated asset first)
    // Allocated asset is already allocated to employee1
    res = await apiCall('POST', '/allocations/transfer', adminToken, {
        assetId: data.assets.allocatedAsset.id,
        newEmployeeId: data.users.employee2.id
    });
    await assert('Transfer Asset returns 201', res.status === 201, res.json);
    updatedAsset = await prisma.asset.findUnique({ where: { id: data.assets.allocatedAsset.id } });
    await assert('Asset status remains ALLOCATED after transfer', updatedAsset.status === 'ALLOCATED');
    
    // Check old allocation is closed
    const prevAlloc = await prisma.allocation.findFirst({ where: { assetId: data.assets.allocatedAsset.id, userId: data.users.employee1.id }, orderBy: { createdAt: 'desc' } });
    await assert('Old allocation closed', prevAlloc.returnedAt !== null);

    // Negative Tests
    logInfo('Running Negative Tests...');
    
    // Allocate already allocated
    res = await apiCall('POST', '/allocations/allocate', adminToken, {
        assetId: data.assets.allocatedAsset.id, // now allocated to emp2
        employeeId: data.users.employee1.id
    });
    await assert('Allocate already allocated -> 409', res.status === 409);

    // Allocate maintenance asset
    res = await apiCall('POST', '/allocations/allocate', adminToken, {
        assetId: data.assets.maintenanceAsset.id,
        employeeId: data.users.employee1.id
    });
    await assert('Allocate maintenance asset -> 409', res.status === 409);

    // Allocate disposed asset
    res = await apiCall('POST', '/allocations/allocate', adminToken, {
        assetId: data.assets.disposedAsset.id,
        employeeId: data.users.employee1.id
    });
    await assert('Allocate disposed asset -> 409', res.status === 409);

    // Allocate inactive employee
    res = await apiCall('POST', '/allocations/allocate', adminToken, {
        assetId: data.assets.availableAsset.id,
        employeeId: data.users.inactive.id
    });
    await assert('Allocate to inactive employee -> 409', res.status === 409);

    // Transfer to same employee
    res = await apiCall('POST', '/allocations/transfer', adminToken, {
        assetId: data.assets.allocatedAsset.id, // currently emp2
        newEmployeeId: data.users.employee2.id
    });
    await assert('Transfer to same employee -> 409', res.status === 409);

    // Transfer inactive employee
    res = await apiCall('POST', '/allocations/transfer', adminToken, {
        assetId: data.assets.allocatedAsset.id,
        newEmployeeId: data.users.inactive.id
    });
    await assert('Transfer to inactive employee -> 409', res.status === 409);

    // Return unallocated asset
    res = await apiCall('POST', '/allocations/return', adminToken, {
        assetId: data.assets.availableAsset.id
    });
    await assert('Return unallocated asset -> 409', res.status === 409);

    // Random UUID
    res = await apiCall('POST', '/allocations/allocate', adminToken, {
        assetId: "00000000-0000-0000-0000-000000000000",
        employeeId: data.users.employee1.id
    });
    await assert('Random UUID -> 404', res.status === 404);

    // Missing fields
    res = await apiCall('POST', '/allocations/allocate', adminToken, {
        assetId: data.assets.availableAsset.id
    });
    await assert('Missing fields -> 400', res.status === 400);

    // Unknown fields
    res = await apiCall('POST', '/allocations/allocate', adminToken, {
        assetId: data.assets.availableAsset.id,
        employeeId: data.users.employee1.id,
        fakeField: "foo"
    });
    await assert('Unknown fields -> 400', res.status === 400);

    // Employee attempting allocation
    res = await apiCall('POST', '/allocations/allocate', empToken, {
        assetId: data.assets.availableAsset.id,
        employeeId: data.users.employee1.id
    });
    await assert('Employee attempting allocation -> 403', res.status === 403);

    // GET /allocations
    res = await apiCall('GET', '/allocations', adminToken);
    await assert('GET /allocations -> 200', res.status === 200 && Array.isArray(res.json?.data));

    // GET /assets/:id/allocation-history
    res = await apiCall('GET', `/assets/${data.assets.allocatedAsset.id}/allocation-history`, adminToken);
    await assert('GET /assets/:id/allocation-history -> 200', res.status === 200 && Array.isArray(res.json?.data));

    console.log(`\n\x1b[36m--- QA AUDIT COMPLETE ---\x1b[0m`);
    if (fails === 0) {
        console.log(`\x1b[32mALL TESTS PASSED! Module is production ready.\x1b[0m`);
    } else {
        console.log(`\x1b[31m${fails} TESTS FAILED! Check logs above.\x1b[0m`);
    }

    process.exit(0);
}

runTests();
