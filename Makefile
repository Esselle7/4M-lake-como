.PHONY: dev build start install clean setup lint

install:
	npm install

dev:
	npm run dev

build:
	npm run build

start:
	npm run start

clean:
	rm -rf .next node_modules

setup: install
	@echo ""
	@echo "✅  Dipendenze installate."
	@echo "👉  Aggiungi le immagini in /public/images/ (vedi public/images/README.md)"
	@echo "👉  Copia .env.local.example in .env.local e configura i valori"
	@echo "🚀  Avvia con: make dev"
	@echo "🌐  Il sito sarà disponibile su http://localhost:3000"
	@echo ""

lint:
	npm run lint

type-check:
	npx tsc --noEmit
