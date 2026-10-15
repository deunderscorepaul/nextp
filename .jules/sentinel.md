## 2024-05-15 - Missing Rate Limiting on External API Trigger
**Vulnerability:** The `/api/trucks/refresh` endpoint triggered a manual refresh pulling from an external API (Craftplaces) with no rate limits.
**Learning:** Endpoints that trigger backend work or external API calls without authentication or rate limits leave the application and external API accounts vulnerable to DoS attacks.
**Prevention:** Apply strict rate limiters (e.g., using `express-rate-limit`) on any resource-intensive or external-service-dependent endpoints to cap the number of requests per window.
