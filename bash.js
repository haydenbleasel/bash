/*jslint browser:true*/

var Bash = function (selector, options) {

    'use strict';

    var command = selector.querySelector('.command'),
        terminal = selector.querySelector('.terminal'),
        prompt = options.prompt || 'user@home:~$',
        computer = options.computer || 'ttys000',
        history = [],
        current = history.length,
        self = this;

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/^[\s\xA0]+|[\s\xA0]+$/g, '');
        };
    }

    this.time = function () {
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            now = new Date(),
            day = days[now.getDay()],
            month = months[now.getMonth()],
            date = now.getDate(),
            hours = (now.getHours() < 10 ? '0' : '') + now.getHours(),
            minutes = (now.getMinutes() < 10 ? '0' : '') + now.getMinutes(),
            seconds = (now.getSeconds() < 10 ? '0' : '') + now.getSeconds();
        return day + ' ' + month + ' ' + date + ' ' + hours + ':' + minutes + ':' + seconds;
    };

    this.createPrompt = function (string, index) {
        var symbol = document.createElement('span');
        symbol.className = 'prompt prompt-' + index;
        symbol.innerHTML = string.trim() + ' ';
        return symbol;
    };

    this.reset = function () {
        var header = document.createElement('p'),
            input = document.createElement('span'),
            i;

        if (typeof prompt === 'string') {
            header.appendChild(this.createPrompt(prompt), 0);
        } else {
            for (i = 0; i < prompt.length; i += 1) {
                header.appendChild(this.createPrompt(prompt[i], i));
            }
        }

        input.className = 'command';
        input.contentEditable = 'true';
        header.appendChild(input);
        terminal.appendChild(header);
        terminal.scrollTop = terminal.scrollHeight;
        command = selector.querySelector('.command');
        command.focus();
    };

    this.post = function (message, delay, next) {
        var output;
        setTimeout(function () {
            output = document.createElement('p');
            output.innerHTML = message;
            terminal.appendChild(output);
            terminal.scrollTop = terminal.scrollHeight;
            if (next) {
                return next();
            }
        }, delay);
    };

    this.initialise = function () {
        self.post('Last login: ' + this.time() + ' on ' + computer, 300, function () {
            if (options.help) {
                self.post(options.help, 150);
            }
            setTimeout(function () {
                self.reset();
            }, 300);
        });
    };

    terminal.addEventListener('keydown', function (e) {
        var key = e.keyCode,
            request,
            i;
        if (key === 13) {
            e.preventDefault();
            command.removeAttribute('contenteditable');
            request = command.innerHTML.trim();
            command.removeAttribute('class');
            if (request === "") {
                self.reset();
            } else if (request === options.name) {
                options.function(function () {
                    self.reset();
                    history.push(request);
                    current = history.length;
                });
            } else {
                self.post('-bash: ' + request.split(' ')[0] + ': command not found', 0, function () {
                    self.reset();
                    history.push(request);
                    current = history.length;
                });
            }
        } else if (key === 38 && current > 0) {
            current -= 1;
            command.innerHTML = history[current];
        } else if (key === 40 && current < history.length - 1) {
            current += 1;
            command.innerHTML = history[current];
        }
    });

    this.initialise();

};
