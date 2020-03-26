
const socket = io.connect();
users_conectados = [];

socket.on('nuevo_usuario',function(datos){
    alert(" Nuevo usuario conectado >>> "+ datos.usuario);
});

socket.on('users',function(datos){
    users_conectados = datos.users;
    actualiza_lista(users_conectados);
});

socket.on('nuevo_mensaje',function(datos){

    var divChatJquery =  $('#cont_mensajes');

    if (datos.destino == 'todos'){
        divChatJquery.append(' <p class="msg_normal"><img src="https://img.icons8.com/dusk/16/000000/globe-earth.png">&nbsp;<strong>'+datos.usuario+' : </strong>'+datos.mensaje+'</p>');
    }else{
        if (datos.destino == user){
            divChatJquery.append(' <p class="msg_priv_recibido"><img style="position:relative;top:3px;" src="https://img.icons8.com/color/20/000000/unlock.png"><strong>'+datos.usuario+' : </strong>'+datos.mensaje+'</p>');
           
        }else{
            divChatJquery.append(' <p class="msg_priv_enviado"><img style="position:relative;top:3px;" src="https://img.icons8.com/color/20/000000/unlock.png"><strong>'+datos.usuario+' : </strong>'+datos.mensaje+'</p>');
        } 
    }
  
  var chatDiv =  document.getElementById("cont_mensajes");
  chatDiv.scrollTop = chatDiv.scrollHeight;

});


function loguear(correo,usuario){

    socket.emit('datos_usuario',{correo : correo, usuario : usuario});
}

function enviar_msj(usuario,mensaje,destinatario = null){
  
    socket.emit('send_mensaje',{mensaje : msj, usuario: usuario,destinatario: destinatario});
}