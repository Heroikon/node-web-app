const express = require('express');
const path = require('path');
const morgan = require('morgan');
const serverless = require('serverless-http');

const app = express();

// --- 1. KONFIGURACJA (Middleware) ---
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// WAŻNE: Obsługa plików statycznych (CSS, obrazy)
// Dzięki temu link <link rel="stylesheet" href="/css/style.css"> zadziała
app.use(express.static(path.join(__dirname, 'public')));

// Ustawienia widoków EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- 2. TRASY (ROUTES) ---

// Strona główna
app.get('/', (req, res) => {
    res.render('index', { title: 'Strona główna', message: 'Witaj w mojej aplikacji!' });
});

// O nas
app.get('/about', (req, res) => {
    res.render('about', { title: 'O nas', message: 'To jest strona o naszej firmie.' });
});

// Kontakt
app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Kontakt' });
});

// Obsługa formularza
app.post('/submit-form', (req, res) => {
    console.log("Otrzymano dane:", req.body);
    res.send('Formularz został wysłany poprawnie!');
});

// --- 3. OBSŁUGA BŁĘDÓW ---

// Obsługa 404 (musi być na samym końcu tras!)
app.use((req, res, next) => {
    res.status(404).render('404', { title: 'Nie znaleziono' });
});

// Obsługa błędów serwera (500)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', { title: 'Błąd serwera' });
});

// --- 4. EKSPORTY (Dla różnych środowisk) ---

// Eksport dla AWS Lambda / Serverless Offline
module.exports.handler = serverless(app);

// Eksport dla Vercel (kluczowe!)
module.exports = app;

// Uruchomienie lokalne / Docker (tylko jeśli nie jesteśmy na Vercel)
if (!process.env.VERCEL) {
    const port = process.env.PORT || 8081;
    app.listen(port, () => {
        console.log(`Serwer działa lokalnie na http://localhost:${port}`);
    });
}