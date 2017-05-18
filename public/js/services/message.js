(() => {
    var $ = jQuery;
    angular.module("mftchat", ["ngRoute"]).service("MessageHandler", MessageHandler);
    MessageHandler.$inject = ["$rootScope", "$http"]

    function MessageHandler($rootScope) {
        var service = {};
        service.getSessionID = sessionID;
        service.sendMessageServer = sendMessage;
        service.getInput = getInput;
        service.sendToChat = sendToChat;

        function sessionID() {
            $rootScope.sessionID = guid();
            return $rootScope.sessionID;
        }

        function getInput() {
            return $rootScope.chattext;
        }

        function sendMessage(text) {
            let data = {
                sessionID: $rootScope.sessionID,
                text: text
            };
            $http.get("/api/message", data).then(handleSuccess, handleError);

        }



        function sendToChat(messageprops) {
            this.text = messageprops.text;
            this.message_side = messageprops.message_side
            this.draw = (_this) => {
                return () => {
                    var $message = $($(".message_template").clone().html());
                    $message.addClass(_this.message_side).find(".text").html(_this.text);
                    $(".messages").append($message);
                    return setTimeout(() => {
                        return $message.addClass("appeared");
                    }, 0);
                }
            }
            return this;
        }

        //Internal functions
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        function handleSuccess() {
            let chat = new sendToChat({
                text: $rootScope.text,
                message_side: "left"
            });
            chat.draw();
            $(".messages").animate({
                scrollTop: $(".messages").prop("scrollHeight")
            }, 300);
        }
        return service;
    }
})();