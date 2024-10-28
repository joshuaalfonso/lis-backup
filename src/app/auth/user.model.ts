
export class User {
    constructor(
        public user_id: string,
        public username: string, 
        public avatar: number, 
        private _token: string, 
        private _tokenExpirationDate: Date,
        public usl: string,
        public accessDetail: any[]
    ) {}

    get token() {
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }
        return this._token;
    }
}
