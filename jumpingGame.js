playMusic = true
playGame = false

class JumpingGame extends Phaser.Scene 
{

    horse
    canterSpeed = 200
    gallopSpeed = 400
    skidSpeed = 200
    jumpSpeedX = 0
    jumpSpeedY = 180
    maxJump = 100
    runHeight = 280
    horseMovements = {
        running: 'running',
        jumping: 'jumping',
        landing: 'landing',
        skidding: 'skidding'
    }
    horseMovement = this.horseMovements.running

    constructor ()
    {
        super({ key: 'JumpingGame' });
    }

    preload ()
    {
        this.load.image('start', './images/start_screen.png');
        this.load.image('mountains', './images/mountains.png');
        this.load.image('path', './images/path.png');
        this.load.image('UI', './images/UI.png');
        this.load.atlas('music_button', './images/music.png', './images/music.json');
        this.load.audio('background_music', ['./game_soundtrack.mp3']);

        this.load.atlas('horse', './images/horse.png', './images/horse.json');
        this.load.atlas('jumps', './images/jumps.png', './images/jumps.json');
        this.load.image('gemBlue5', './images/gemBlue5.png');
    }

    create ()
    { 

        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // BG
        this.add.image(444, 234, 'mountains').setScrollFactor(0)
        this.add.image(444, 234, 'path')
        this.add.image(1332, 234, 'path')
        this.add.image(2220, 234, 'path')

        // Music
        const backgroundMusic = this.sound.add('background_music');
        backgroundMusic.loop = true; 
        backgroundMusic.play();

        // Horse
        this.horse = this.physics.add.sprite(-100, this.runHeight, 'horse', 'canter0000')
        this.anims.create({
            key: 'canter',
            frames: this.anims.generateFrameNumbers('horse', { frames: [
                'canter0000', 'canter0001', 'canter0002', 'canter0003', 'canter0004', 'canter0005', 'canter0006', 'canter0007', 'canter0008', 'canter0009', 'canter0010', 'canter0011'
            ] }),
            frameRate: 24,
            repeat: -1
        });
        this.anims.create({
            key: 'gallop',
            frames: this.anims.generateFrameNumbers('horse', { frames: [
                'gallop0000', 'gallop0001', 'gallop0002', 'gallop0003', 'gallop0004', 'gallop0005', 'gallop0006'
            ] }),
            frameRate: 24,
            repeat: -1
        });
        this.horse.body.setSize(150, 90, false).setOffset(70, 100);
        this.cameras.main.startFollow(this.horse, false, 1, 0, -275, 45).setBounds(0, 0, 2664, 468);


        this.gem1 = this.physics.add.image(400, this.runHeight+30, 'gemBlue5')
        this.gem2 = this.physics.add.image(600, this.runHeight-40, 'gemBlue5')

        this.gem3 = this.physics.add.image(1350, this.runHeight+30, 'gemBlue5')
        this.gem4 = this.physics.add.image(1450, this.runHeight-40, 'gemBlue5')
        this.gem5 = this.physics.add.image(1550, this.runHeight-40, 'gemBlue5')

        this.gem6 = this.physics.add.image(2000, this.runHeight-40, 'gemBlue5')
        this.gem7 = this.physics.add.image(2100, this.runHeight-40, 'gemBlue5')
        this.gem8 = this.physics.add.image(2200, this.runHeight-40, 'gemBlue5')
        this.gem9 = this.physics.add.image(2100, this.runHeight+40, 'gemBlue5')
        
        this.gems = this.physics.add.group({immovable: true});
        this.gems.addMultiple([this.gem1, this.gem2, this.gem3, this.gem4, this.gem5, this.gem6, this.gem7, this.gem8, this.gem9]);


        // Jumps
        this.jump1 = this.physics.add.sprite(600, this.runHeight+60, 'jumps', 'wall')
        this.jump1.body.setSize(10, 50, false).setOffset(27, 50);

        this.jump2 = this.physics.add.sprite(1500, this.runHeight+60, 'jumps', 'wall')
        this.jump2.body.setSize(10, 50, false).setOffset(27, 50);

        this.jumps = this.physics.add.group({immovable: true});
        this.jumps.addMultiple([this.jump1, this.jump2]);

        
        // UI
        const start = this.add.image(444, 234, 'start').setScrollFactor(0)
        const startInteractive = this.add.graphics().setInteractive(new Phaser.Geom.Rectangle(286, 274, 325, 45), Phaser.Geom.Rectangle.Contains);
            startInteractive.on('pointerdown', function (pointer)
            {
                playGame = true
                start.setVisible(false)
            });


        const UI = this.add.image(443, 234, 'UI').setScrollFactor(0)
        // music button
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
            // Horse movement
            if (this.horseMovement !== this.horseMovements.jumping && this.horseMovement !== this.horseMovements.landing) {
                if (this.horseMovement === this.horseMovements.skidding) {
                    // Horse skid
                    this.horse.setVelocityX(this.canterSpeed);
                    this.horse.setFrame('slide')   
                }
                else if (this.cursors.right.isDown)
                {
                    // Horse gallop
                    this.horse.setVelocityX(this.gallopSpeed);
                    this.horse.setFrame('gallop0001')
                }
                else {
                    // Horse canter
                    this.horse.setVelocityX(this.canterSpeed);
                    this.horse.setFrame('canter0009')
                }
            }
            else {
                // Speed boost while jumping
                // Horse canter
                this.horse.setVelocityX(this.canterSpeed + this.jumpSpeedX);

                // Horse gallop
                if (this.cursors.right.isDown)
                {
                    this.horse.setVelocityX(this.gallopSpeed + this.jumpSpeedX);
                }
            }

            if (this.spaceBar.isDown && this.horseMovement === this.horseMovements.running) {
                this.horseMovement = this.horseMovements.jumping
                jump(this.horse, -this.jumpSpeedY)
                this.horse.setFrame('jump0003')
            }
            else if (this.horseMovement === this.horseMovements.jumping && this.horse.y < this.runHeight - this.maxJump) {
                this.horseMovement = this.horseMovements.landing
                jump(this.horse, this.jumpSpeedY)
                this.horse.setFrame('jump0010')
            }
            else if ((this.horseMovement === this.horseMovements.landing && this.horse.y > this.runHeight) || this.horseMovement === this.horseMovements.skidding) {
                this.horseMovement = this.horseMovements.running
                this.horse.y = this.runHeight
                jump(this.horse, 0)
            }

            function jump(horse, speedY) {
                horse.setVelocityY(speedY);
            }

            // Gems

            this.gems.getChildren().forEach(gem => {
                this.physics.overlap(
                    this.horse,
                    gem,
                    function() {gem.setVisible(false)},
                    null,
                    this);
            });

            // Jumps
            this.physics.overlap(
                this.horse,
                this.jumps,
                function() {this.horseMovement = this.horseMovements.skidding},
                null,
                this);
        }
    }
}