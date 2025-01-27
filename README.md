# Context

This project contains an example of a sample test using k6 for load testing.
Underling resources used along with the k6 sample test:
- PostgreSQL: Used to simulate an usage of a k6 script getting content from the database
- Stubmatic: Used to mock the endpoints that the k6 test script runs against
- Prometheus: Time series database that k6 outputs the test's execution metrics
- InfluxDB: Time series database that k6 outputs the test's execution metrics.
  - PS: It's not being used in this example. If you want to test it, please comment out the prometheus `K6_OUT`, `K6_PROMETHEUS_RW_SERVER_URL` and `K6_PROMETHEUS_RW_TREND_STATS` and uncomment the influxdb `K6_OUT` env vars under the k6 service inside the docker-compose.yaml file
- Grafana: Tool to consume metrics from either Prometheus or InfluxDB and render them in dashboards

## Installation

- Step 1 - run `make build` - This will build a custom k6 binary with custom [xk6-sql](https://github.com/grafana/xk6-sql), [xk6-output-prometheus-remote](github.com/grafana/xk6-output-prometheus-remote) and [xk6-kv](github.com/oleiade/xk6-kv) extensions.
PS: It's not necessary to run this step every time you want to start the local stack or run tests. Running this step only once is enough.
- Step 2 - run `make start` - This will start all necessary underling resources the k6 sample test needds to integrate with
- Step 3 - run `make runt-test` - This will execute a k6 test's sample

## Dashboard

During test runs, see test results in http://localhost:3000/d/ccbb2351-2ae2-462f-ae0e-f2c893ad1028/k6-prometheus?orgId=1&refresh=10s (if you are using prometheus) or http://localhost:3000/d/ReuNR5Aik/k6-influxdb?orgId=1&refresh=10s (if you are using influxdb)