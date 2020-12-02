class UserHelper {
    constructor() {
        this.users = [];
    }

    pushUser(id, name) {
        let user = { id, name }
        this.users.push(user);

        return this.users;
    }

    removeUser(id) {
        let user = this.getUser(id);
        if (user) {
            this.users = this.users.filter((user) => user.id !== id)
        }
        return user;
    }

    getUser(id) {
        return this.users.filter((user) => user.id === id)[0];
    }

    getListUsers() {
        return this.users;
    }
}

export default UserHelper;