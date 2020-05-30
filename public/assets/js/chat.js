const socket = io(SITE_URL);
var md = window.markdownit({linkify: true});
let userId = $('#userId').text();
let message = $('#message');

socket.on('message', (data) => {
    $('#messages').append(`<div class="message">${md.render(data.message).replace(/<h[0-9]>/g, '<p>').replace(/<\/h1[0-9]>/g, '</p>').replace(/<blockquote>/g, '').replace(/<\/blockquote>/g, '')}</div>`);
    if (data.id === userId) $("#messages").find("p:last").addClass('sendMessage')
    $('html').scrollTop($('html').prop('scrollHeight') + 100)
    $('#typing').hide();
});

socket.on('typing', (data) => {
    $('#typing').show();
});

socket.on('online', (data) => {
    $('#online').text(data)
});


$('#sendMessage').click(function () {
    if (message.val().replace(/ /g, '') === '') return;
    socket.emit('message', {id: userId, message: message.val()})
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
