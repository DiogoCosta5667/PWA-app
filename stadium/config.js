const config = {
    db: 'mongodb+srv://costadiogo418_db_user:123@diogo.j96w6dd.mongodb.net/stadium?retryWrites=true&w=majority&appName=Diogo',
    secret: 'a-string-secret-at-least-256-bits-long',
    expiresPassword: 86400, // expires in 24hours
    saltRounds: 10
 }
 
 module.exports = config;