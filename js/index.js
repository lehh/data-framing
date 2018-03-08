class Bit {
    constructor(flag = '01111110', escape = '0') {
        this.flag = flag;
        this.escape = escape;
    }

    static randomBitString(stringLength) {
        var randomBit = '';

        for (var i = 0; i <= stringLength / 2; i++) {
            randomBit += 1;
            randomBit += Math.floor(Math.random() * 2);
        };

        return randomBit;
    }

    static escapeBitMessage(splittedText) {
        var splittedTextLength = splittedText.length,
            escapedMessage = '',
            oneCount = 0,
            i = 0;

        for (; i < splittedTextLength; i++) {
            escapedMessage += splittedText[i];

            if (splittedText[i] == '1') {
                oneCount++;

                if (oneCount == 5) {
                    escapedMessage += 0;
                    oneCount = 0;
                }

            } else {
                oneCount = 0;
            }
        };

        return escapedMessage;
    }
}

class Char {
    constructor(flag = 'F', escape = 'E') {
        this.flag = flag;
        this.escape = escape;
    }

    static randomCharString(stringLength) {
        var randomChar = '';

        for (var i = 0; i <= stringLength / 2; i++) {
            randomChar += String.fromCharCode(Math.floor(Math.random() * 4) + 100);
            randomChar += String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        };

        return randomChar;
    }

    static escapeCharMessage(splittedText) {
        var splittedTextLength = splittedText.length,
            escapedMessage = '',
            i = 0;

        for (; i < splittedTextLength; i++) {
            if (splittedText[i] == 'E' || splittedText[i] == 'F') {
                escapedMessage += 'E';
            }

            escapedMessage += splittedText[i];
        };

        return escapedMessage;
    }
}

class Message {
    constructor(text, type = new Object()) {
        this.text = text;
        this.type = type;
    }

    get textWithFlags() {
        return this.type.flag + this.text + this.type.flag;
    }

    get escapedMessage() {
        return escapeText(this.type, this.text.toUpperCase())
    }

    get escapedFlaggedMessage() {
        return this.type.flag + escapeText(this.type, this.text.toUpperCase()) + this.type.flag;
    }

    removeFlags() {
        var flagLength = this.type.flag.length,
            textLength = this.text.length;

        this.text = this.text.substr(flagLength, textLength - (2 * flagLength))
    }

    hasFlags() {
        var flag_ = this.type.flag,
            flagLength = flag_.length,
            text_ = this.text,
            textLength = text_.length;

        if (firstFlag() == flag_ && lastFlag() == flag_) {
            return true;
        }

        function firstFlag() {
            return text_.substr(0, flagLength)
        }

        function lastFlag() {
            return text_.substr(textLength - flagLength, textLength)
        }

        return false;
    }

    static randomMessage(type_, messageLength = 16) {
        if (type_ instanceof Bit) {
            var randomBit = Bit.randomBitString(messageLength);
            return new Message(randomBit, type_);
        } else if (type_ instanceof Char) {
            var randomChar = Char.randomCharString(messageLength);
            return new Message(randomChar, type_);
        }
    }
}

function escapeText(type, text) {
    if (type instanceof Bit) {
        return Bit.escapeBitMessage(splitText(text));
    } else if (type instanceof Char) {
        return Char.escapeCharMessage(splitText(text));
    }
}

function splitText(text) {
    return text.split('');
}

function loadAtSecondFrame(url, mode) {
    $.ajax({
        url: url,
        cache: false,
        success: function (page) {
            var $page = $(page);

            if (mode != null)
                $page = insertModeIntoPage(mode, $page)

            $("#secondFrame").html($page);
        }
    });
}

function insertModeIntoPage(mode, $page) {
    $page.find("#mode").html(mode);
    return $page;
}

function showAlert() {
    $("#alert").fadeTo(2500, 500).slideUp(500);
}

function setAlertMessage(message) {
    $("#alertMessage").html(message);
}

function setErrorAlert() {
    $("#alert").addClass("alert-danger");
}

function setSuccessAlert() {
    $("#alert").addClass("alert-success");
}



