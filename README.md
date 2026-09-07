# BookHub Client

Frontend-delen för **BookHub**, en fullstack CRUD-applikation som byggts som ett LIA-projekt (lärande i arbete) med fokus på molnutveckling. Detta repository innehåller Angular 20 single-page-applikationen som använder BookHub API:t.

Backend-repository: [bookhub-api](https://github.com/kofiturkson10/bookhub-api)
Live-app: https://wonderful-island-02ad5290f.7.azurestaticapps.net

## Funktioner

- Full CRUD för **böcker** och en personlig **"Mina citat"**-vy (citat är kopplade till respektive användare)
- Lägg till / redigera / ta bort hanteras i signalstyrda modaler (utan Bootstrap JS), inklusive en temaanpassad bekräftelsedialog för borttagning
- **JWT-autentisering** med inloggning och registrering, en fungerande HTTP-interceptor som bifogar token samt route guards som skyddar autentiserade sidor
- Växling mellan ljust/mörkt läge via `data-bs-theme` och en `ThemeService` (sparas i `localStorage`)
- Responsiv navbar som kollapsar till en signalstyrd hamburgermeny

## Teknikstack

- **Angular 20** — standalone components, signals, `@if`/`@for` control flow
- **Bootstrap** importerat som SCSS (gör det möjligt att åsidosätta variabler före importen)
- **Font Awesome** för ikoner
- Reactive Forms, funktionella route guards (`CanActivateFn`), funktionell HTTP-interceptor

## Förutsättningar

- [Node.js](https://nodejs.org/) (LTS)
- Angular CLI:
  ```bash
  npm install -g @angular/cli
  ```

## Köra lokalt

1. **Klona och installera**
   ```bash
   git clone https://github.com/kofiturkson10/bookhub-client.git
   cd bookhub-client
   npm install
   ```

2. **Starta utvecklingsservern**
   ```bash
   ng serve
   ```

   Applikationen körs på `http://localhost:4200`.

3. Se till att [bookhub-api](https://github.com/kofiturkson10/bookhub-api) körs lokalt (standard `https://localhost:7000`) så att applikationen har ett backend-API att kommunicera med.

## Miljökonfiguration

API:ts bas-URL är inte hårdkodad — den finns i Angulars environment-filer och byts ut vid build:

- `src/environments/environment.development.ts` — används av `ng serve`; pekar på det lokala API:t (`https://localhost:7000/api`).
- `src/environments/environment.ts` — används vid produktions-builds; pekar på det deployade Azure API:t.

Services läser `environment.apiBaseUrl`, så byte mellan olika miljöer kräver inga kodändringar.

## Bygga för produktion

```bash
ng build
```

Build-output skrivs till `dist/`. Produktionskonfigurationen använder `environment.ts`, vilket innebär att den byggda applikationen automatiskt pekar mot det deployade API:t.

## Deployment

Applikationen är deployad till **Azure Static Web Apps** via **GitHub Actions**. En push till `main` triggar workflow-filen i `.github/workflows/`, som bygger Angular-applikationen och publicerar det statiska innehållet.

> Obs: produktions-builds kör Angulars font-inlining-steg, som hämtar Google Fonts som refereras i `index.html`. En felaktig font-URL gör att builden misslyckas även om `ng serve` fungerar lokalt — kontrollera att fontens `<link>`-URL:er returnerar `200` innan du pushar.