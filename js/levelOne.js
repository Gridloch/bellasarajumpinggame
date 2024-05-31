class LevelOne extends Phaser.Scene 
{

    score = 0
    horse
    canterSpeed = 0//310
    gallopSpeed = 500
    skidSpeed = 200
    runHeight = 280
    horseMovements = {
        running: 'running',
        cantering: 'cantering',
        galloping: 'galloping',
        jumping: 'jumping',
        skidding: 'skidding'
    }
    horseMovement = this.horseMovements.running
    isSkidding = false
    levelEnd = 22941

    constructor ()
    {
        super({ key: 'LevelOne' });
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
        this.load.atlas('gems', './images/gems.png', './images/gems.json');
        this.load.image('endGate', './images/endGate.png');

        // Level reference
        this.load.image('Level1', './images/Level1.png');
    }

    create ()
    { 
        // Inputs
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        // BG
        this.add.image(444, 234, 'mountains').setScrollFactor(0)        
        for (let index = 0; index < this.levelEnd / 468; index++) {            
            this.add.image(444 + (index * 888), 234, 'path')
        }
        // Level Reference
        this.add.image(0, 0, 'Level1').setOrigin(0, 0).setAlpha(.6) 


        // Music
        const backgroundMusic = this.sound.add('background_music');
        backgroundMusic.loop = true; 
        backgroundMusic.play();


        // Horse
        // this.horse = this.physics.add.sprite(-100, this.runHeight, 'horse', 'canter0000')
        this.horse = this.physics.add.sprite(this.levelEnd-300, this.runHeight, 'horse', 'canter0000')
        this.horse.body.setSize(150, 90, false).setOffset(70, 100);
            this.anims.create({
                key: 'canter',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'canter0000', 'canter0001', 'canter0002', 'canter0003', 'canter0004', 'canter0005', 'canter0006', 'canter0007', 'canter0008', 'canter0009', 'canter0010', 'canter0011'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'gallop',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'gallop0000', 'gallop0001', 'gallop0002', 'gallop0003', 'gallop0004', 'gallop0005', 'gallop0006'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'jump',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'jump0000', 'jump0001', 'jump0002', 'jump0003', 'jump0004', 'jump0005', 'jump0006', 'jump0007', 'jump0008', 'jump0009', 'jump0010', 'jump0011'
                ] }),
                frameRate: 16
            });
            this.anims.create({
                key: 'slideStart',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'slide0000', 'slide0001'
                ] }),
                frameRate: 20
            });
            this.anims.create({
                key: 'slide',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'slide0002', 'slide0003', 'slide0004', 'slide0005', 'slide0006'
                ] }),
                frameRate: 20,
                repeat: -1
            });
            this.anims.create({
                key: 'slideEnd',
                frames: this.anims.generateFrameNumbers('horse', { frames: [
                    'slide0007', 'slide0008', 'slide0009'
                ] }),
                frameRate: 20
            });


        // Camera
        this.cameras.main.startFollow(this.horse, false, 1, 0, -275, 45).setBounds(0, 0, this.levelEnd, 468);


        // Start and End Gates
        this.add.image(this.levelEnd - 83, 270, 'endGate').setOrigin(0, .5)

        // Gems
        this.gemsArray = [
            this.physics.add.sprite(728, 210, 'gems', 'gemBlue20'),

            this.physics.add.sprite(1200, 340, 'gems', 'gemBlue5'),
            this.physics.add.sprite(1250, 285, 'gems', 'gemBlue5'),
            this.physics.add.sprite(1310, 235, 'gems', 'gemBlue5'),
            this.physics.add.sprite(1370, 210, 'gems', 'gemBlue5'),

            this.physics.add.sprite(2050, 255, 'gems', 'gemPink55'),

            this.physics.add.sprite(2510, 260, 'gems', 'gemBlue35'),

            this.physics.add.sprite(2700, 350, 'gems', 'gemPink10'),
            this.physics.add.sprite(2850, 350, 'gems', 'gemPink10'),

            this.physics.add.sprite(3300, 220, 'gems', 'gemBlue65'),

            this.physics.add.sprite(3590, 340, 'gems', 'gemPink10'),

            this.physics.add.sprite(4350, 340, 'gems', 'gemPink10'),
            this.physics.add.sprite(4485, 280, 'gems', 'gemPink10'),
            this.physics.add.sprite(4560, 245, 'gems', 'gemPink40'),

            this.physics.add.sprite(4910, 330, 'gems', 'gemBlue5'),
            this.physics.add.sprite(4950, 275, 'gems', 'gemBlue5'),
            this.physics.add.sprite(5030, 230, 'gems', 'gemBlue35'),

            this.physics.add.sprite(5420, 260, 'gems', 'gemPink25')
        ]
        
        this.gems = this.physics.add.group({immovable: true});
        this.gems.addMultiple(this.gemsArray);


        // Jumps
        // this.jump1 = this.physics.add.sprite(600, this.runHeight+60, 'jumps', 'wall')
        // this.jump1.body.setSize(5, 50, false).setOffset(10, 50);

        // this.jump2 = this.physics.add.sprite(1500, this.runHeight+60, 'jumps', 'wall')
        // this.jump2.body.setSize(5, 50, false).setOffset(10, 50);

        this.jumps = this.physics.add.group({immovable: true});
        // this.jumps.addMultiple([this.jump1, this.jump2]);


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
            musicButton.on('pointerover', function (pointer) { this.setFrame(`music_${playMusic ? 'on' : 'off'}_hover`);});
            musicButton.on('pointerout', function (pointer) { this.setFrame(`music_${playMusic ? 'on' : 'off'}`) });
    }

    update ()
    {
        // Horse movement
        if (this.horseMovement === this.horseMovements.jumping) {
            // Adjust horse hitbox position whilst jumping
            switch (this.horse.frame.name) {
                case 'jump0001':
                    this.horse.body.setSize(150, 90, false).setOffset(90, 85);
                    break;
                case 'jump0002':
                    this.horse.body.setSize(150, 90, false).setOffset(110, 50);
                    break;
                case 'jump0003':
                    this.horse.body.setSize(150, 90, false).setOffset(110, 40);
                    break;
                case 'jump0004':
                    this.horse.body.setSize(150, 90, false).setOffset(110, 35);
                    break;
                case 'jump0005':
                    this.horse.body.setSize(150, 90, false).setOffset(110, 35);
                    break;
                case 'jump0006':
                    this.horse.body.setSize(150, 90, false).setOffset(110, 35);
                    break;
                case 'jump0007':
                    this.horse.body.setSize(150, 90, false).setOffset(110, 35);
                    break;
                case 'jump0008':
                    this.horse.body.setSize(150, 90, false).setOffset(115, 40);
                    break;
                case 'jump0009':
                    this.horse.body.setSize(150, 90, false).setOffset(110, 50);
                    break;
                case 'jump0010':
                    this.horse.body.setSize(150, 90, false).setOffset(110, 70);
                    break;
                    
                case 'jump0011':
                    this.horse.body.setSize(150, 90, false).setOffset(90, 100);
                    this.horseMovement = this.horseMovements.running
                    break;
            
                default:
                    this.horse.body.setSize(150, 90, false).setOffset(90, 100);
                    break;
            }
        }
        else {
            if (this.isSkidding) {
                // Horse skid
                if (this.horseMovement !== this.horseMovements.skidding) {
                    this.horseMovement = this.horseMovements.skidding
                    this.horse.setVelocityX(this.canterSpeed);
                    this.horse.body.setSize(150, 90, false).setOffset(70, 100);
                    this.horse.play('slideStart') 
                }
                
                // Loop slide animation while skidding
                if (this.horse.frame.name === 'slide0001') {
                    this.horse.play('slide') 
                }

                this.isSkidding = false
            }
            else if (this.horseMovement === this.horseMovements.skidding)
            {
                // End slide animation and continue running afterdone skidding
                if (this.horse.frame.name === 'slide0009') {
                    this.horseMovement = this.horseMovements.running
                }
                else if (this.horse.frame.name !== 'slide0007' && this.horse.frame.name !== 'slide0008') {
                    this.horse.play('slideEnd')
                }
            }
            else if (this.cursors.right.isDown && this.horseMovement !== this.horseMovements.galloping)
            {
                // Horse gallop when right arrow key is down
                this.horseMovement = this.horseMovements.galloping
                this.horse.setVelocityX(this.gallopSpeed);
                this.horse.body.setSize(150, 90, false).setOffset(70, 100);
                this.horse.play('gallop')
            }
            else if (!this.cursors.right.isDown && this.horseMovement !== this.horseMovements.cantering) {
                // Horse canter if right arrow key is not down
                this.horseMovement = this.horseMovements.cantering
                this.horse.setVelocityX(this.canterSpeed);
                this.horse.body.setSize(150, 90, false).setOffset(70, 100);
                this.horse.play('canter')
            }
            else if (this.spaceBar.isDown) {
                // Horse jump if spacebar is pressed
                this.horseMovement = this.horseMovements.jumping
                this.horse.play('jump')
            }
        }

        // Gems
        this.gems.getChildren().forEach(gem => {
            this.physics.overlap(
                this.horse,
                gem,
                function() {
                    if (gem.visible) {
                        gem.setVisible(false)
                        console.log(gem.frame.name)
                        switch (gem.frame.name) {
                            case "gemBlue5":
                                this.score += 5
                                break;
                            case "gemPink10":
                                this.score += 10
                                break;
                            case "gemYellow15":
                                this.score += 15
                                break;
                            case "gemBlue20":
                                this.score += 20
                                break;
                            case "gemPink25":
                                this.score += 23
                                break;
                            case "gemYellow30":
                                this.score += 30
                                break;
                            case "gemBlue35":
                                this.score += 35
                                break;
                            case "gemPink40":
                                this.score += 40
                                break;
                            case "gemYellow45":
                                this.score += 45
                                break;
                            case "gemBlue50":
                                this.score += 50
                                break;
                            case "gemPink55":
                                this.score += 55
                                break;
                            case "gemYellow60":
                                this.score += 60
                                break;
                            case "gemBlue65":
                                this.score += 65
                                break;
                            case "gemPink70":
                                this.score += 70
                                break;
                            case "gemYellow75":
                                this.score += 75
                                break;
                        
                            default:
                                console.log("Unknown gem: " + gem.frame.name)
                                break;
                        }

                        console.log(this.score)
                    }
                },
                null,
                this);
        });

        // Jumps
        this.physics.overlap(
            this.horse,
            this.jumps,
            function() {
                    this.isSkidding = true
            },
            null,
            this);
    }
}