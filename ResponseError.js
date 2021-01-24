module.exports = class ResponseError extends Error {
    constructor(clientMessage, status, errors) {
        super(clientMessage);
        this.clientMessage = clientMessage;
        this.status = status;
        this.errors = errors;
    }
};