class UsersService {
    //konstruktor inicjalizujący tablicę użytkowników
    constructor() {
        this.users = [];
    }

    //metoda zwracająca tablicę użytkowników
    getAllUsers() {
        return this.users;
    }

    //metoda sukająca użytkownika po wskazanym id;
    //metoda find szuka użytkownika posiadającego identyczne id do wskazanego w argumencie metody - userId
    getUserById(userId) {
        return this.users.find(user => user.id === userId);
    }

    //dodaje użytkownika do tablicy
    addUser(user) {
        this.users = [user, ...this.users];
    }

    //usuwa użytkownika za pomocą metody Array.prototype.filter zwracającej obiekty które spełniają warunek
    //odfiltrowuje użytkowników których id jest różne od wskazanego w argumencie meody
    removeUser(userId) {
        this.users = this.users.filter(user => user.id !== userId);
    }
}
module.exports = UsersService;