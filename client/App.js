import React, {Component} from 'react';
import {hot} from 'react-hot-loader';
import io from 'socket.io-client';

import styles from './App.css';

import MessageForm from './MessageForm';
import MessageList from './MessageList';
import UsersList from './UsersList';
import UserForm from './UserForm';

//argument przekazany do funkcji io to przestrzeń nazw z którą jest nawiązywane połączenie
const socket = io('/');

//klasa app dziedziczy po klasie component zaimportowanej z reacta
class App extends Component {
    constructor(props) {
        //dlatego wywołana jest metoda super która jest wywołaniem knstruktora klasy rozszerzanej (component)
        super(props);
        this.state = {
            users: [], 
            messages: [], 
            text: '', 
            name: ''
        }
    }

    //funkcja nasłuchująca na wiadomości typu update i message    
    componentDidMount() {
        socket.on('message', message => this.messageReceive(message));
        socket.on('update', ({users}) => this.chatUpdate(users));
    }

    //metoda odbiera wiadomość, a na następnie aktualizuje stan wiadomości 
    messageReceive(message) {
        const messages = [message, ...this.state.messages];
        //metoda aktualizuje stan aplikacji
        this.setState({messages});
    }

   //serwer każdorazowo wysyła tablicę z aktualną listą użytkowników
    chatUpdate(users) {
        this.setState({users});
    }

    //metoda wysyłająca wiadomości do serwera; przed wysłaniem aktualizuje bieżący stan aplikacji a następnie emituje wysłaną wiadomość tak aby wyświetliła się reszcie użytkowników czatu
    handleMessageSubmit(message) {
        const messages = [message, ...this.state.messages];
        this.setState({messages});
        socket.emit('message', message);
    }

    //moetda obsługuje tworzenie nowego użytkownika czatu, a następnie wysyła info do serwera który powiadamia resztę o dołączeniu
    handleUserSubmit(name) {
        this.setState({name});
        socket.emit('join', name);
    }

    render() {
        // <warunek_do_sprawdzenia> ? <przypadek_true> : <przypadek_false>
        return this.state.name !== '' ? (
            this.renderLayout()
        ) : this.renderUserForm() //zaimplementowane w późniejszej części
    }

    renderLayout() {
        return (
            <div className={styles.App}>
                <div className={styles.AppHeader}>
                    <div className={styles.AppTitle}>
                        ChatApp
                    </div>
                    <div className={styles.AppRoom}>
                        App room
                    </div>
                </div>
                <div className={styles.AppBody}>
                    <UsersList //props users
                        users={this.state.users}
                    />
                    <div className={styles.MessageWrapper}>
                        <MessageList
                            messages={this.state.messages}
                        />
                        <MessageForm
                            onMessageSubmit={message => this.handleMessageSubmit(message)}
                            name={this.state.name}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderUserForm() {
        return (<UserForm onUserSubmit = {name => this.handleUserSubmit(name)} />)
    }
};

export default hot(module) (App);
