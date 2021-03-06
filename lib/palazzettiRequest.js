var request = require("request");

var palazzettiMsg = '/cgi-bin/sendmsg.lua?cmd=';

function PalazzettiRequest(aParams) {
    this.ipaddress = aParams.ipaddress;
    this.port = aParams.port;
};

PalazzettiRequest.prototype.getMessageURL = function() {
    return 'http://' + this.ipaddress + ':' + this.port + palazzettiMsg
};

PalazzettiRequest.prototype._request = function(sCommand) {
    return new Promise(function(resolve, reject) {
        request.get(this.getMessageURL() + sCommand,
            function(error, response, body) {
                try {
                    if (!error) {
                        var result = JSON.parse(body);
                    }
                    if (error) {
                        reject(error);
                    } else if (!result.SUCCESS) {
                        reject(result.INFO.CMD + ': ' + result.INFO.RSP);
                    } else {
                        resolve(result);
                    }
                } catch (errorParse) {
                    reject(errorParse);
                }
            });
    }.bind(this));
};


PalazzettiRequest.prototype.getAlls = function() {
    return this._request('GET+ALLS');
};

PalazzettiRequest.prototype.getTimer = function() {
    return this._request('GET+CHRD');
};

PalazzettiRequest.prototype.getLabel = function() {
    return this._request('GET+LABL');
};

PalazzettiRequest.prototype.setCommand = function(command) {
    return this._request('SET+' + command);
};

PalazzettiRequest.prototype.powerCommand = function(command) {
    return this._request('CMD+' + command);
};

/*
todo commands
GET+STDT
*/

exports.PalazzettiRequest = PalazzettiRequest;