.PHONY: default

default:
	@echo "No default recipe."

client:
	NEXT_TELEMETRY_DISABLED=1 cd ./pkgs/client && bun run dev

serve:
	bun --inspect run ./pkgs/server/src/main.ts

fmt:
	cd ./pkgs/server && bun run format

services:
	docker-compose up -d

services-down:
	docker-compose down
	docker ps
