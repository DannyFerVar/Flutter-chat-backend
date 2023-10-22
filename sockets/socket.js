const { io } = require('../index');
const { tryJWT } = require('../helpers/jwt');
const { connectedUser, disconnectedUser, saveMessage } = require('../controllers/socket');

//Mensajes del server
io.on('connection', client => {
    console.log('Client connected');

    //validate authentication
    const [valid, uid] = tryJWT(client.handshake.headers['x-token'])

    if (!valid) { return client.disconnect(); }

    //Authenticated client
    connectedUser(uid);

    //Add user to a particular chat room
    //Cuando un cliente se conecta, hay dos salas por defecto: global (io.emit manda mensaje a todos los usuarios). 
    //client.id permite mandar un mensaje directo a un usuario en específico.
    //Unir al usuario a una sala individual que contenga el uid del usuario:
    client.join(uid);

    //Listen personal messages
    client.on('personal-message', async (payload) => {
        //TODO: save message
        await saveMessage(payload);

        io.to(payload.to).emit('personal-message', payload);
    });


    client.on('disconnect', () => { disconnectedUser(uid); });

    client.on('mensaje', (payload) => {
        console.log('Mensaje', payload);

        io.emit('Mensaje', { admin: 'Nuevo Mensaje' });
    });
});
