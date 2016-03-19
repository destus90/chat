function User(name) {
    this.name = name;
}

User.prototype.say = function (form) {
    //Ajax
    var msg = form.elements.msg,
        msgValue = msg.value.trim();

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '../scripts/sendmsg.php');
    var formData = new FormData();
    formData.append('username', this.name);
    formData.append('msg', msgValue);
    xhr.send(formData);
    form.reset();
    xhr.onload = function () {
        if (xhr.responseText)
            document.querySelector('.error').innerHTML = xhr.responseText;
    }
}


document.addEventListener('DOMContentLoaded', function () {
    var source = new EventSource('../scripts/getmsg.php'),
        chat = document.querySelector('.chat'),
        message = document.querySelector('.message'),
        counterChar = document.querySelector('.form > span'),
        form = document.forms.message,
        messageLen = 255,
        allMessage = [],
        user;

    if (localStorage.getItem('username')) {
        form.elements.username.value = localStorage.getItem('username');
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        user = new User(this.elements.username.value.trim());
        user.say(this);
        chat.scrollTop = 0; // scroll chat in (0,0)
        localStorage.setItem('username', user.name); // save username in web-storage
    })

    form.addEventListener('reset', function (e) {
        e.preventDefault();
        this.elements.username.value = user.name;
        this.elements.msg.value = this.elements.msg.defaultValue; 
    })

    form.elements.msg.addEventListener('input', function () {
        if (this.value.length > messageLen) {
            counterChar.textContent = 0
            counterChar.style.color = 'red';
            this.setCustomValidity('Допускается не более ' + messageLen + ' символов');
        }
        else {
            this.value.trim() === '' ? this.setCustomValidity('Пустые сообщения запрещены') : this.setCustomValidity('');
            counterChar.textContent = messageLen - this.value.length;
            counterChar.style.color = 'green';
        }
    })

    form.elements.username.addEventListener('input', function () {
            this.value.trim() === '' ? this.setCustomValidity('Введите имя') : this.setCustomValidity('');
    })

    //Comet
    source.onmessage = function (e) {
        //clear chat message
        chat.innerHTML = '';
        //parse JSON
        allMessage = JSON.parse(e.data);
        allMessage.forEach(function (el) {
            var newMessage = message.cloneNode(true),
                userName = document.createTextNode(el.name),
                msg = document.createTextNode(el.msg),
                time = document.createTextNode(el.date.substring(el.date.length - 8, el.date.length)); // get time of message

            newMessage.querySelector('time').appendChild(time);
            newMessage.querySelector('span').appendChild(userName);
            newMessage.querySelector('article').appendChild(msg);

            chat.appendChild(newMessage);
        });
    }
});






