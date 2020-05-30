const socket = io(SITE_URL);
let message = $('#message');

socket.on('message', (data) => {
    $('#messages').append(`<p>${data.message}</p>`);
    $('html').scrollTop($('html').prop('scrollHeight') + 100)
    $('#typing').hide();
});

socket.on('typing', (data) => {
    $('#typing').show();
});


$('#sendMessage').click(function () {
    if (message.val().replace(/ /g, '') === '') return;
    socket.emit('message', {message: message.val()})
    message.val('');
})

$(document).on('keypress',function(e) {
    if(e.which !== 13) return;
    $('#sendMessage').click();
    setTimeout(() => {
        message.val('');
    }, 10);

});

message.on('keypress',function(e) {
    
    if (message.val().replace(/ /g, '') === '') return;
    
    socket.emit('typing', true);
    

});
