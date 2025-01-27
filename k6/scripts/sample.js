import http from 'k6/http';
import { check, fail } from "k6";
import sql from 'k6/x/sql';
import { openKv } from "k6/x/kv";
import { populateKVsFromDatabase } from "./lib/settings.js";
import { SharedArray } from 'k6/data';

const kv = openKv();
const db = sql.open('postgres', 'postgres://postgres:dbpasswd@db:5432/postgres?sslmode=disable');

export async function setup() {
    populateKVsFromDatabase(kv, db);

    let results = sql.query(db, "SELECT id FROM tenants WHERE name = 'Tenant 1';");
    check(results, { 'tenant fetch was successful': (r) => r.length > 0 });

    let res = http.get(`http://stubmatic:7777/dummy-external/products?tenant_id=${results[0].id}&product_name=product-abc`, {
        responseType: 'text'
    })
    check(res, { 'sku fetch was successful': (r) => r.status === 200 });

    return JSON.parse(res.body).sku
}

export async function teardown() {
    db.close();
    await kv.clear();
}

const params = new SharedArray('all params', function () {
    return JSON.parse(open('./data/params.json'));
});

export const options = {
    discardResponseBodies: true,
    scenarios: {
        smoke: {
            exec: "delay",
            executor: "constant-vus",
            vus: 1,
            duration: "4s",
            tags: { test_id: 'delay' }
        },
        spike: {
            executor: 'ramping-arrival-rate',
            exec: 'clubs',
            startTime: '10s',
            stages: [
                { target: 20000, duration: '2m' }, // fast ramp-up to a high point
                { target: 0, duration: '30s' }, // ramp down back to 0 iters/s over the last 30 second
            ],
            preAllocatedVUs: 20000, // how large the initial pool of VUs would be
            tags: { test_id: 'clubs' }
        },
        stress: {
            executor: 'ramping-arrival-rate',
            exec: 'clubs',
            startTime: '2m', // the ramping API test starts a little later
            startRate: 50,
            timeUnit: '1s', // we start at 50 iterations per second
            stages: [
                { target: 200, duration: '30s' }, // go from 50 to 200 iters/s in the first 30 seconds
                { target: 200, duration: '3m30s' }, // hold at 200 iters/s for 3.5 minutes
                { target: 0, duration: '30s' }, // ramp down back to 0 iters/s over the last 30 second
            ],
            preAllocatedVUs: 50, // how large the initial pool of VUs would be
            maxVUs: 100, // if the preAllocatedVUs are not enough, we can initialize more
            tags: { test_id: 'clubs' }
        }
    },
    thresholds: {
        http_req_failed: ['rate<0.01'],
        http_req_duration: ['p(95)<500', 'p(99)<1000'],
        checks: ["rate > 0.95"]
    },
};

export async function clubs(product_sku) {
    let param1 = await kv.get("param1");
    let res = http.get(`http://stubmatic:7777/clubs?product_sku=${product_sku}&param_a=${param1}&param_b=${params[Math.floor(Math.random() * params.length)]}`);
    check(res, { "status is 200": (res) => res.status === 200 });
}

export function delay() {
    let res = http.get('http://stubmatic:7777/delay');
    check(res, { "status is 200": (res) => res.status === 200 });
}

export function handleSummary(data) {
    return {
        'summary.json': JSON.stringify(data, null, 2),
        stdout: textSummary(data, { indent: " ", enableColors: true }),
    }
}
