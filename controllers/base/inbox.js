


class Inbox {
    constructor(payload) {

    }

    async messageList() {
        try {
            return 'hit messageList'
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async messageByID() {
        try {
            return 'hit messageByID'
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async send() {
        try {
            return 'hit sendMessage'
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }

    async sentMessages() {
        try {
            return 'hit sendMessage'
        } catch (error) {
            throw new CustomError(error.message, error.statusCode, error.functionName);
        }
    }
}

module.exports = Inbox;
