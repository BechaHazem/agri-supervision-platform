# Backend Docker (Microservices)

Starts Eureka + Kafka + all backend services.

## Prereqs
- Docker Desktop
- Ports free on host: 8761, 8080, 8081, 8082, 8083, 9092, 2181

## Run
From `backend/`:

```bash
docker compose up --build
```

## URLs
- Eureka: http://localhost:8761
- Gateway: http://localhost:8080

## Notes
- Config Service is not used; services are configured via their local `application.yml` and Docker env overrides.
- Kafka is available inside the Docker network at `kafka:9092`.
- H2 databases are in-memory in the current setup (data resets on container restart).
