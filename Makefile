build:
	docker run --rm -u "$(id -u):$(id -g)" -v "./k6/xk6:/xk6" grafana/xk6 build \
  		--with github.com/grafana/xk6-sql \
  		--with github.com/grafana/xk6-output-prometheus-remote \
		--with github.com/oleiade/xk6-kv

stop:
	docker-compose down

start: stop
	docker-compose up -d

run-test:
	docker-compose run -it --rm k6 run /scripts/sample.js
