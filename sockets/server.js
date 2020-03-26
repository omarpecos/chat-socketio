// Server
const express = require('express');
const app = express();

const http = require('http');

const server = http.createServer(app);

server.listen(3000);

app.use(express.static('public'));

// socket IO 
const socketIo = require('socket.io');
const io = socketIo.listen(server);

//Lokijs como una BBDD (*)
UsersOnId = new Array();
IdsOnUsers = new Array();

io.on('connect',function(socket){
    console.log('nueva conexion id: '+socket.id );
    
    socket.on('datos_usuario',function(datos){

        usuario = datos.usuario;
        console.log("datos usaurio >> " + datos.usuario);
        id_socket = socket.id; 

        console.log("--------------------------------------------");
        console.log('correo: '+datos.correo + ' usuario: '+usuario+ ' id_socket: '+id_socket);

        // guardando user por id
        UsersOnId[id_socket] = usuario;
        // guardando Ids por user
        if (IdsOnUsers[usuario] == null){
           IdsOnUsers[usuario] = new Array();
        }
        IdsOnUsers[usuario].push(id_socket);
       /* console.log("USUARIOS ONLINE")
        console.log('>>>>> Usuarios por id ---->>> ');
        console.log(UsersOnId);
        console.log('>>>>> Ids por Users ---->>> ');
        console.log(IdsOnUsers);*/
        console.log("--------------- Usuarios conectados ---->  "+ Object.keys(IdsOnUsers).length);
        
       
        io.emit('nuevo_usuario',{usuario : usuario});
        io.emit('users',{users : Object.keys(IdsOnUsers)});
    });

    socket.on('send_mensaje',function(datos){

        console.log(JSON.stringify(datos));

        if (datos.destinatario != null){
            console.log(datos.usuario+' esta eviando un mensaje privado');
            destinatario = datos.destinatario;
            // sus Ids que estan online de este user
            dirs = IdsOnUsers[destinatario];
                // console.log("destino >>> "+destinatario+" Y sus dirs >>> "+dirs);

            for (var i=0;i<dirs.length;i++){
                io.to(dirs[i]).emit('nuevo_mensaje',{usuario : datos.usuario, mensaje : datos.mensaje, destino: destinatario});
            }
            io.to(socket.id).emit('nuevo_mensaje',{usuario : datos.usuario, mensaje : datos.mensaje,});
           
        }else{
            console.log(datos.usuario+' esta eviando un mensaje NORMAL');
            io.emit('nuevo_mensaje',{usuario : datos.usuario, mensaje : datos.mensaje , destino: 'todos'});
        }
        
    });

    socket.on('disconnect',function(){
        id_user = socket.id;

        if (UsersOnId[id_user]){
                // orimero cogemos su user a partir de su Id
            usuario = UsersOnId[id_user];

            // ahora borramos el id actual de ese user
            delete UsersOnId[id_user];

            // cogemos los ids de ese usuario 
            array_ids = IdsOnUsers[usuario];

            for (var index = 0; index < array_ids.length; index++) {
                if (id_user == array_ids[index]){
                        id_to_borrar = index;
                }   
            }
            // ahora borramos el id de IdsOnUsers
            IdsOnUsers[usuario].splice(id_to_borrar,1);

            if (IdsOnUsers[usuario].length < 1){
                delete IdsOnUsers[usuario];
            }

            io.emit('users',{users : Object.keys(IdsOnUsers)});
            console.log("Usuario : "+usuario+ ' desconectado');
            console.log("--------------------------------------------");
        }

    });
    

    
});
