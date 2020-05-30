const socket = io(SITE_URL);
var md = window.markdownit({linkify: true});
let userId = $('#userId').text();
let message = $('#message');

socket.on('message', (data) => {
    $('#messages').append(`<div class="message">${md.render(data.message)
        .replace(/<h[0-9]>/g, '<p>').replace(/<\/h1[0-9]>/g, '</p>')
        .replace(/<blockquote>|<\/blockquote>/g, '')
        .replace(/<hr>/g, '')
        .replace(/<ul>|<\/ul>/g, '')
        .replace(/<li>|<\/li>/g, '')
        .replace(/<img/g, '<img style="max-width: 8%; max-height: 8%;" ')}</div>`);
    if (data.id === userId) $("#messages").find("div:last").addClass('sendMessage')
    $('html').scrollTop($('html').prop('scrollHeight') + 100)
    $('#typing').hide();
});

socket.on('typing', () => {
    $('#typing').show();
});

socket.on('online', (data) => {
    $('#online').text(data)
});


$('#sendMessage').click(function () {
    if (message.val().replace(/ /g, '') === '') return;
    socket.emit('message', {id: userId, message: message.val()})
    let old = message.attr("placeholder");
    message.attr('disabled', 'disabled');
    message.removeAttr("placeholder")
    message.attr("placeholder", "Waiting...");
    setTimeout(() => {
        message.removeAttr("placeholder");
        message.attr("placeholder", old);
        message.removeAttr('disabled');
        message.focus();
    }, 1250);
    message.val('');
})

$(document).on('keypress',function(e) {
    message.focus();
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
