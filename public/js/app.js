(function () {
    var Message;
    Message = function (arg) {
        this.text = arg.text, this.message_side = arg.message_side;
        this.draw = function (_this) {
            return function () {
                var $message;
                $message = $($('.message_template').clone().html());
                $message.addClass(_this.message_side).find('.text').html(_this.text);
                $('.messages').append($message);
                return setTimeout(function () {
                    return $message.addClass('appeared');
                }, 0);
            };
        }(this);
        return this;
    };

    function whatPage() {
        if (window.location.pathname == "/bank/") {
            return "bank";
        } else {
            return "hotel";
        }
    }

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
    $(function () {
        var getMessageText, message_side, sendMessage, welcomemessage;
        var sessionID = guid();
        var pageType = whatPage();
        console.log(pageType);
        message_side = 'right';
        getMessageText = function () {
            var $message_input;
            $message_input = $('.message_input');
            return $message_input.val();
        };
        welcomemessage = text("Hello world!");
        sendMessage = function (text, sender = "user") {
            var $messages, message;
            if (text.trim() === '') {
                return;
            }
            $('.message_input').val('');
            $messages = $('.messages');
            // message_side = message_side === 'left' ? 'right' : 'left';
            message_side = sender === "user" ? "left" : "right";
            message = new Message({
                text: text,
                message_side: message_side
            });
            message.draw();
            $.ajax({
                type: "GET",
                url: "/api/message",
                data: {
                    sessionID: sessionID,
                    message: text,
                    from: pageType
                },
                success: function (response) {
                    var chat = new Message({
                        text: response,
                        message_side: "right"
                    });
                    chat.draw();
                    return $messages.animate({
                        scrollTop: $messages.prop('scrollHeight')
                    }, 300);
                }
            });

            return $messages.animate({
                scrollTop: $messages.prop('scrollHeight')
            }, 300);
        };
        $('.send_message').click(function (e) {
            return sendMessage(getMessageText());
        });
        $('.message_input').keyup(function (e) {
            if (e.which === 13) {
                return sendMessage(getMessageText());
            }
        });
          welcomeMessage
        //sendMessage('Hello! :)');
        //setTimeout(function () {
        //     return sendMessage('Hi Sandy! How are you?');
        // }, 1000);
        // return setTimeout(function () {
        //     return sendMessage('I\'m fine, thank you!');
        // }, 2000);
    });
}.call(this));
