//ładowanie odpowiednich modułów
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const UsersService = require('./UsersService');

const usersService = new UsersService();

//tworzenie aplikacji Express
const app = express();
//tworzenie servera na podstawie aplikacji
const server = http.createServer(app);
//podpięcie socket.io do utworzonego serwera
const io = socketIo(server);

//ustawienie w app miejsca z którego będą serwowane pliki
app.use(express.static(`${__dirname}/public`));

//konfiguracja routingu nasłuchującego na '/' który w odpowiedzi będzie wysyłał index.html
app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

//funkcja nasłuchująca podłączenia nowego kilenta z  czatem; argument socket reprezentuje sosbę która weszła na czat
io.on('connection', (socket) => {
    //klient nasłuchuje na wiadomość wejscia do czatu
    socket.on('join', (name) => {
        //użytkownik który pojawił się w aplikacji, jest zapisywany do serwisu trzymającego listę osób w czacie
        usersService.addUser({
            id: socket.id,
            name
        });
        //aplikacja emituje zdarzenie update, które aktualizuje info na temat listy użytkowników każdemu nasłuchującemu na wydarzenie 'update'
        io.emit('update', {
            users: usersService.getAllUsers()
        });
    });
});

io.on('connection', (socket) => {
    //nasłuchiwanie na zdarzenie disconnect odpala funkcję usuwającą użytkownika z listy osób na czacie
    socket.on('disconnect', () => {
        usersService.removeUser(socket.id);
        //opuszczający klient emituje update aktualizujący listę użytkowników
        socket.brodcast.emit('update', {
            users: usersService.getAllUsers()
        });
    });
});

io.on('connection', (socket) => {
    //użytkownik (argument socket) za pomocą metody broadcast.emit wysyła wiadomość do wszytskich pócz siebie
    socket.on('message', (message) => {
        //destrukturyzacja (const {name} = ...) aby wyciągnąć tylko informację kto wysłał wiadomość
        const {name} = usersService.getUserById(socket.id);
        socket.broadcast.emit('message', {
            //obiekt reprezentujący wiadomość składający się z tekstu o nazwy wysyłającego
            text: message.text,
            from: name
        });
    });
})

//uruchomienie serwera i nasłuchiwanie na zapytania od klientów
server.listen(3000, () => {
    console.log('listening on :3000');
});