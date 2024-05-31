playMusic = true
playGame = false
backgroundMusic = null


class JumpingGameStart extends Phaser.Scene 
{
    constructor ()
    {
        super({ key: 'JumpingGameStart' });
    }

    preload ()
    {
        this.load.image('start', './images/start_screen.png');
        this.load.image('UI', './images/UI.png');
        this.load.atlas('music_button', './images/music.png', './images/music.json');
        this.load.audio('background_music', ['./game_soundtrack.mp3']);
        this.load.plugin('rexclockplugin', 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexclockplugin.min.js', true);

    }

    create ()
    {
        // Music
        backgroundMusic = this.sound.add('background_music');
        backgroundMusic.loop = true; 
        backgroundMusic.play();


        // Start screen
        const start = this.add.image(444, 234, 'start').setScrollFactor(0)
        const startInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(286, 274, 325, 45), Phaser.Geom.Rectangle.Contains);
            startInteractive.on('pointerdown', function (pointer)
            {
                playGame = true
                start.setVisible(false)
            });


        // Text for start button
        // this.startText = this.add.text(443, 234, 'Static Text Object', { fontFamily: 'Arial', fontSize: 20, color: '#ffffff', align: 'center' });
        // this.startText.text = langData.start_game;
        // this.startText.setPosition(450-this.startText.width/2, 295-this.startText.height/2);


        // UI
        const UI = this.add.image(443, 234, 'UI').setScrollFactor(0)
        // Music button
        const musicButton = this.add.sprite(871, 453, 'music_button', 'music_on').setInteractive({ pixelPerfect: true }).setScale(0.7).setScrollFactor(0);
            musicButton.on('pointerdown', function (pointer)
            {
                if (playMusic) {
                    backgroundMusic.stop()
                    this.setFrame('music_off_hover')
                }
                else {
                    backgroundMusic.play()
                    this.setFrame('music_on_hover')
                }
                playMusic = !playMusic
            });
            musicButton.on('pointerover', function (pointer) { this.setFrame(`music_${playMusic ? 'on' : 'off'}_hover`); console.log(playMusic) });
            musicButton.on('pointerout', function (pointer) { this.setFrame(`music_${playMusic ? 'on' : 'off'}`) });
    }

    update () 
    {
        if (playGame) {
            this.scene.start('LevelOne');
        }
    }

}