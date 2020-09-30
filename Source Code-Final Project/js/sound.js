






(function() {
    var audio = {
        sound1: document.getElementById('backgroundMusic1'),
        sound2: document.getElementById('backgroundMusic1'),
         boom: function() {
            this.sound1.src = './music/shooting.mp3';
            this.sound1.play();
        },
        start: function() {
            this.sound2.src = './music/start.mp3';
            this.sound2.play();
        },
        end: function() {
            this.sound2.src = './music/end.mp3';
            this.sound2.play();
        },
        done: function() {
            this.sound2.src = './music/done.mp3';
            this.sound2.play();
        },
        init: function() {
            var sound = ['start', 'end', 'boom', 'done'];
            var index = 0;
            var self = this;

            var callback = function() {
                index++;
                if(index < sound.length) {
                    self.sound1.src = './music/' + sound[index] + '.mp3';
                } else {
                    console.log('audio inited');

                    self.sound1.removeEventListener('loadeddata', callback);
                    
                }
            };

            this.sound1.src = './music/' + sound[index] + '.mp3';

            this.sound1.addEventListener('loadeddata', callback);
        }
    };

    audio.init();

    window.audio = audio;
})();

