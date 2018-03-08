(function () {
    var message;
    var mode = $("#mode").html();

    $(document).ready(function () {
        $("#newMessage").tooltip();
        $("#btnHelp").tooltip();

        $("input[name=buttons]:radio").on("change", function () {
            if (this.id == "btnBit") {
                generateMessage(new Bit());
            } else if (this.id == "btnChar") {
                generateMessage(new Char());
            }

            fillLabels();
        }); $("#btnBit").trigger("change");

        $("#newMessage").on("click", function () {
            generateMessage(message.type);
            setMessage();
        });

        $("#submitAnswer").on("click", function () {
            reviseAnswer($("#answer").val(), message);
        });
    });

    function fillLabels() {
        var messageType = message.type;

        $("#flag").html(messageType.flag);
        $("#escape").html(messageType.escape);

        if (modeIsReceive()) {
            $("#questionLabel").html("Received message with escapes and flags:");
            $("#answerLabel").html("Message without escapes and flags:");
            $("#randomMessage").html(message.escapedFlaggedMessage);
        } else if (modeIsTransmit()) {
            $("#questionLabel").html("Message to be transmitted with flags:");
            $("#answerLabel").html("Message with escapes and flags:");
            $("#randomMessage").html(message.textWithFlags.toUpperCase());
        }
    }

    function reviseAnswer(answerText, message) {
        var answer = new Message(answerText.toUpperCase(), message.type);

        try {
            if (isValidAnswer(answer, message.text.length)) {
                var messageToCompare;

                if (modeIsReceive()) {
                    messageToCompare = message.text.toUpperCase();
                }
                else if (modeIsTransmit()) {
                    answer.removeFlags();
                    messageToCompare = message.escapedMessage;
                }

                if (!isCorrectAnswer(answer.text, messageToCompare))
                    throw 'Incorrect answer.';

                setSuccessAlert();
                setAlertMessage("Correct answer! A new message was generated.");
                showAlert();

                $("#newMessage").trigger("click");
                $("#answer").val('');
            }

        } catch (error) {
            setErrorAlert();

            if (error instanceof Error) {
                setAlertMessage("Internal Error. Check console for details.");
                console.log(error);
            } else {
                setAlertMessage(error);
            }

            showAlert();
        }
    }

    function isValidAnswer(answer, messageLength) {
        var answerText = answer.text;

        if (answerText == '') {
            throw 'Please, write something.';
        }

        if (modeIsReceive()) {
            if (answerText.length > messageLength
                || answer.hasFlags())
                throw 'Invalid answer.';
        } else if (modeIsTransmit()) {
            if (answerText.length < messageLength
                || !answer.hasFlags())
                throw 'Invalid answer.';
        }

        return true;
    }

    function isCorrectAnswer(answerText, escapedText) {
        if (answerText == escapedText)
            return true;

        return false;
    }

    function generateMessage(type, messageLength = 18) {
        message = Message.randomMessage(type, messageLength);
    }

    function setMessage() {
        if (modeIsReceive())
            $("#randomMessage").html(message.escapedFlaggedMessage);
        else if (modeIsTransmit())
            $("#randomMessage").html(message.textWithFlags.toUpperCase());
    }

    function modeIsReceive() {
        if (mode == "receive") {
            return true
        }

        return false;
    }

    function modeIsTransmit() {
        if (mode == "transmit") {
            return true;
        }

        return false;
    }
})();

