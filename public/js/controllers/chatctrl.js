(() => {
    angular.module("mftchat").controller("chat", chat);
    chat.$inject = ["$scope", "MessageHandler"];

    function chat($scope, MessageHandler) {
        initController();

        function initController() {
            console.log(MessageHandler.getSessionID());
        }
        $scope.sendMessage = () => {
            if (!$scope.text)
                return false;
            else {
                let chat = MessageHandler.sendToChat({
                    text: $scope.text,
                    message_side: "right"
                });
                chat.draw();
            }
        }
    }
})();