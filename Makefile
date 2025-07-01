.PHONY: default

default:
	@echo "No default recipe."

serve:
	bun --inspect run ./pkgs/server/src/main.ts

fmt:
	cd ./pkgs/server && bun run format

services:
	docker-compose up -d

services-down:
	docker-compose down
	docker ps
