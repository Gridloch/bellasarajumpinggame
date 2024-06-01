class LevelOne extends Phaser.Scene 
{

    score = 0
    horse
    canterSpeed = 310
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
    levelTime = 60
    done = false

    constructor ()
    {
        super({ key: 'LevelOne' });
    }

    preload ()
    {
        this.load.image('mountains', './images/mountains.png');
        this.load.image('path', './images/path.png');
        this.load.image('scoreBoard', './images/scoreBoard.png');

        this.load.atlas('horse', './images/horse.png', './images/horse.json');
        this.load.atlas('jumps', './images/jumps.png', './images/jumps.json');
        this.load.atlas('gems', './images/gems.png', './images/gems.json');
        this.load.image('endGate', './images/endGate.png');

        // Level reference
        // this.load.image('Level1', './images/Level1.png');
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


        // Display
        this.add.image(444, 30, 'scoreBoard').setScrollFactor(0) 
        // Horseshoe Display
        this.horseshoeText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.horseshoeText.text = "0 x ";
        this.horseshoeText.setPosition(320-this.horseshoeText.width/2, 35-this.horseshoeText.height/2);
        // Score Display
        this.scoreNameText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.scoreNameText.text = langData.score;
        this.scoreNameText.setPosition(445-this.scoreNameText.width/2, 18-this.scoreNameText.height/2);

        this.scoreText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.scoreText.text = "0";
        this.scoreText.setPosition(445-this.scoreText.width/2, 40-this.scoreText.height/2);
        // Clock
        this.clock = this.plugins.get('rexclockplugin').add(this, config);
        this.clock.start();
        // Display
        this.clockNameText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' }).setScrollFactor(0);
        this.clockNameText.text = langData.time;
        this.clockNameText.setPosition(570-this.clockNameText.width/2, 18-this.clockNameText.height/2);
        this.timerText = this.add.text(443, 234, 'Static Text Object', { fontFamily: 'Arial', fontSize: 30, color: '#ffffff', align: 'center' }).setScrollFactor(0)//.setVisible(false);
        this.timerText.text = "0:00";
        this.timerText.setPosition(575-this.timerText.width/2, 40-this.timerText.height/2);


        // Horse
        this.horse = this.physics.add.sprite(-100, this.runHeight, 'horse', 'canter0000')
        this.horse.body.setSize(150, 95, false).setOffset(70, 100);
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
        this.endGate = this.physics.add.image(this.levelEnd - 83, 270, 'endGate').setOrigin(0, .5)
        this.endGate.body.setOffset(70, 0);


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

            this.physics.add.sprite(4355, 345, 'gems', 'gemPink10'),
            this.physics.add.sprite(4485, 285, 'gems', 'gemPink10'),
            this.physics.add.sprite(4560, 250, 'gems', 'gemPink40'),

            this.physics.add.sprite(4910, 330, 'gems', 'gemBlue5'),
            this.physics.add.sprite(4950, 275, 'gems', 'gemBlue5'),
            this.physics.add.sprite(5035, 230, 'gems', 'gemBlue35'),

            this.physics.add.sprite(5423, 265, 'gems', 'gemPink25'),

            this.physics.add.sprite(5835, 250, 'gems', 'gemBlue50'),

            this.physics.add.sprite(6320, 260, 'gems', 'gemBlue35'),

            this.physics.add.sprite(6600, 330, 'gems', 'gemBlue20'),
            this.physics.add.sprite(6745, 340, 'gems', 'gemBlue5'),

            this.physics.add.sprite(7560, 320, 'gems', 'gemPink10'),
            this.physics.add.sprite(7605, 275, 'gems', 'gemPink10'),
            this.physics.add.sprite(7660, 245, 'gems', 'gemPink10'),
            this.physics.add.sprite(7725, 235, 'gems', 'gemPink40'),

            this.physics.add.sprite(8225, 340, 'gems', 'gemYellow15'),

            this.physics.add.sprite(8475, 265, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8515, 230, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8515, 320, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8565, 205, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8560, 270, 'gems', 'gemPink40'),
            this.physics.add.sprite(8565, 340, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8615, 230, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8615, 320, 'gems', 'gemBlue5'),
            this.physics.add.sprite(8645, 265, 'gems', 'gemBlue5'),

            this.physics.add.sprite(9105, 330, 'gems', 'gemBlue65'),

            this.physics.add.sprite(9505, 260, 'gems', 'gemPink10'),

            this.physics.add.sprite(10130, 360, 'gems', 'gemBlue5'),
            this.physics.add.sprite(10180, 315, 'gems', 'gemPink10'),
            this.physics.add.sprite(10250, 275, 'gems', 'gemBlue5'),
            this.physics.add.sprite(10310, 240, 'gems', 'gemPink10'),
            this.physics.add.sprite(10355, 215, 'gems', 'gemYellow75'),

            this.physics.add.sprite(10870, 290, 'gems', 'gemBlue20'),

            this.physics.add.sprite(11090, 260, 'gems', 'gemPink40'),
            this.physics.add.sprite(11160, 260, 'gems', 'gemPink40'),

            this.physics.add.sprite(11630, 220, 'gems', 'gemBlue35'),

            this.physics.add.sprite(12095, 220, 'gems', 'gemPink55'),
            this.physics.add.sprite(12235, 325, 'gems', 'gemPink70'),
            this.physics.add.sprite(12430, 220, 'gems', 'gemPink55'),

            this.physics.add.sprite(12745, 210, 'gems', 'gemYellow30'),

            this.physics.add.sprite(13115, 255, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13295, 345, 'gems', 'gemBlue20'),
            this.physics.add.sprite(13450, 300, 'gems', 'gemBlue20'),

            this.physics.add.sprite(13900, 260, 'gems', 'gemPink10'),
            this.physics.add.sprite(14035, 225, 'gems', 'gemYellow45'),

            this.physics.add.sprite(14380, 345, 'gems', 'gemBlue20'),

            this.physics.add.sprite(14930, 345, 'gems', 'gemBlue20'),

            this.physics.add.sprite(15375, 270, 'gems', 'gemBlue5'),
            this.physics.add.sprite(15445, 290, 'gems', 'gemBlue5'),
            this.physics.add.sprite(15490, 345, 'gems', 'gemBlue5'),
            this.physics.add.sprite(15525, 290, 'gems', 'gemBlue5'),
            this.physics.add.sprite(15590, 270, 'gems', 'gemBlue5'),

            this.physics.add.sprite(16315, 235, 'gems', 'gemPink10'),
            this.physics.add.sprite(16430, 235, 'gems', 'gemPink10'),
            this.physics.add.sprite(16535, 235, 'gems', 'gemPink10'),
            this.physics.add.sprite(16650, 235, 'gems', 'gemPink10'),

            this.physics.add.sprite(16850, 260, 'gems', 'gemBlue20'),

            this.physics.add.sprite(17230, 300, 'gems', 'gemPink10'),
            this.physics.add.sprite(17280, 255, 'gems', 'gemPink10'),
            this.physics.add.sprite(17355, 225, 'gems', 'gemPink10'),
            this.physics.add.sprite(17430, 215, 'gems', 'gemYellow45'),

            this.physics.add.sprite(18170, 215, 'gems', 'gemYellow45'),
            this.physics.add.sprite(18180, 165, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18180, 265, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18210, 190, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18210, 240, 'gems', 'gemBlue5'),
            this.physics.add.sprite(18240, 215, 'gems', 'gemBlue5'),

            this.physics.add.sprite(18615, 325, 'gems', 'gemBlue20'),
            this.physics.add.sprite(18700, 280, 'gems', 'gemBlue20'),

            this.physics.add.sprite(19325, 270, 'gems', 'gemBlue20'),
            this.physics.add.sprite(19500, 215, 'gems', 'gemBlue35'),
            this.physics.add.sprite(19670, 215, 'gems', 'gemBlue35'),
            this.physics.add.sprite(19800, 280, 'gems', 'gemPink55'),
            this.physics.add.sprite(19970, 215, 'gems', 'gemBlue35'),
            this.physics.add.sprite(20185, 215, 'gems', 'gemBlue35'),

            this.physics.add.sprite(20650, 200, 'gems', 'gemPink10'),
            this.physics.add.sprite(20650, 340, 'gems', 'gemPink10'),

            this.physics.add.sprite(20950, 300, 'gems', 'gemYellow75'),

            this.physics.add.sprite(21430, 325, 'gems', 'gemPink10'),

            this.physics.add.sprite(21835, 325, 'gems', 'gemPink10'),

            this.physics.add.sprite(22150, 330, 'gems', 'gemYellow60'),
            this.physics.add.sprite(22240, 265, 'gems', 'gemPink10'),
            this.physics.add.sprite(22315, 265, 'gems', 'gemBlue5'),
            this.physics.add.sprite(22420, 220, 'gems', 'gemPink10'),
            this.physics.add.sprite(22495, 220, 'gems', 'gemBlue5'),
            this.physics.add.sprite(22590, 265, 'gems', 'gemPink10'),
            this.physics.add.sprite(22665, 265, 'gems', 'gemBlue5')
        ]
        
        this.gems = this.physics.add.group({immovable: true});
        this.gems.addMultiple(this.gemsArray);


        // Jumps
        this.jumpsArray = [
            this.physics.add.sprite(2285, 360, 'jumps', 'waterTrough'),
            this.physics.add.sprite(5010, 350, 'jumps', 'woodenFence'),
            this.physics.add.sprite(5836, 360, 'jumps', 'hayBale'),
            this.physics.add.sprite(7685, 335, 'jumps', 'wall'),
            this.physics.add.sprite(8970, 345, 'jumps', 'woodenFence'),
            this.physics.add.sprite(11120, 360, 'jumps', 'hedge'),
            this.physics.add.sprite(12435, 350, 'jumps', 'woodenFence'),
            this.physics.add.sprite(13130, 360, 'jumps', 'hayBale'),
            this.physics.add.sprite(13965, 355, 'jumps', 'wall'),
            this.physics.add.sprite(16020, 365, 'jumps', 'stump'),
            this.physics.add.sprite(17380, 335, 'jumps', 'wall'),
            this.physics.add.sprite(18198, 340, 'jumps', 'woodenFence'),
            this.physics.add.sprite(19815, 365, 'jumps', 'stump'),
            this.physics.add.sprite(22090, 340, 'jumps', 'blueFence'),
        ]

        this.jumpsArray.forEach(jump => {
            switch (jump.frame.name) {
                case 'blueFence':
                    jump.body.setSize(5, 50, false).setOffset(10, 50);
                    break;
                case 'hayBale':
                    jump.body.setSize(5, 50, false).setOffset(15, 10);
                    break;
                case 'hedge':
                    jump.body.setSize(5, 50, false).setOffset(30, 10);
                    break;
                case 'log':
                    jump.body.setSize(5, 50, false).setOffset(10, 10);
                    break;
                case 'stump':
                    jump.body.setSize(5, 50, false).setOffset(30, 10);
                    break;
                case 'wall':
                    jump.body.setSize(5, 50, false).setOffset(10, 50);
                    break;
                case 'waterTrough':
                    jump.body.setSize(5, 50, false).setOffset(10, 10);
                    break;
                case 'woodenFence':
                    jump.body.setSize(5, 50, false).setOffset(20, 50);
                    break;
            
                default:
                    console.log("Unknown jump type: " + jump.frame.name)
                    break;
            }
        });

        this.jumps = this.physics.add.group({immovable: true});
        this.jumps.addMultiple(this.jumpsArray);
        

        // Extra settings for debug mode
        if (this.physics.config.debug) {
            this.horse.x = 18000
            // Keep horse still unless buttons are pressed
            this.canterSpeed = 0
            // Speed up movement
            this.gallopSpeed = this.gallopSpeed 

            // Display object coordinates in debug mode
            this.gemsArray.forEach(gem => {
                this.gemText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' });
                this.gemText.text = "x: " + gem.x + "\ny: " + gem.y;
                this.gemText.setPosition(gem.x-this.gemText.width/2, gem.y-40);
            });
            this.jumpsArray.forEach(jump => {
                this.jumpText = this.add.text(0, 0, 'Static Text Object', { fontFamily: 'Arial', fontSize: 10, color: '#ffffff', align: 'center' });
                this.jumpText.text = "x: " + jump.x + "\ny: " + jump.y;
                this.jumpText.setPosition(jump.x-this.jumpText.width/2, jump.y-40);
            });
        }


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
        function millisToMinutesAndSeconds(millis) {
            var minutes = Math.floor(millis / 60000);
            var seconds = ((millis % 60000) / 1000).toFixed(0);
            return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
          }

        this.timerText.text = millisToMinutesAndSeconds(this.clock.now)


        // Horse movement
        if (this.horseMovement === this.horseMovements.jumping) {
            // Adjust horse hitbox position whilst jumping
            switch (this.horse.frame.name) {
                case 'jump0001':
                    this.horse.body.setSize(150, 105, false).setOffset(90, 70);
                    break;
                case 'jump0002':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 35);
                    break;
                case 'jump0003':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 25);
                    break;
                case 'jump0004':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0005':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0006':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0007':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 20);
                    break;
                case 'jump0008':
                    this.horse.body.setSize(150, 105, false).setOffset(115, 25);
                    break;
                case 'jump0009':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 35);
                    break;
                case 'jump0010':
                    this.horse.body.setSize(150, 105, false).setOffset(110, 55);
                    break;
                    
                case 'jump0011':
                    this.horse.body.setSize(150, 105, false).setOffset(90, 85);
                    this.horseMovement = this.horseMovements.running
                    break;
            
                default:
                    this.horse.body.setSize(150, 105, false).setOffset(90, 90);
                    break;
            }
        }
        else {
            if (this.isSkidding) {
                // Horse skid
                if (this.horseMovement !== this.horseMovements.skidding) {
                    this.horseMovement = this.horseMovements.skidding
                    if (!this.physics.config.debug) {
                        this.horse.setVelocityX(this.canterSpeed);
                    }
                    this.horse.body.setSize(150, 105, false).setOffset(70, 95);
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
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                this.horse.play('gallop')
            }
            else if (this.physics.config.debug && this.cursors.left.isDown) {
                if (this.horseMovement !== this.horseMovements.galloping) {
                    // Allow backwards movement in debug mode
                    this.horseMovement = this.horseMovements.galloping
                    this.horse.setVelocityX(-this.gallopSpeed);
                    this.horse.body.setSize(150, 105, false).setOffset(70, 95);
                    this.horse.playReverse('gallop')
                }
            }
            else if (!this.cursors.right.isDown && this.horseMovement !== this.horseMovements.cantering) {
                // Horse canter if right arrow key is not down
                this.horseMovement = this.horseMovements.cantering
                this.horse.setVelocityX(this.canterSpeed);
                this.horse.body.setSize(150, 105, false).setOffset(70, 95);
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
                        let points = 0
                        switch (gem.frame.name) {
                            case "gemBlue5":
                                points += 5
                                break;
                            case "gemPink10":
                                points += 10
                                break;
                            case "gemYellow15":
                                points += 15
                                break;
                            case "gemBlue20":
                                points += 20
                                break;
                            case "gemPink25":
                                points += 25
                                break;
                            case "gemYellow30":
                                points += 30
                                break;
                            case "gemBlue35":
                                points += 35
                                break;
                            case "gemPink40":
                                points += 40
                                break;
                            case "gemYellow45":
                                points += 45
                                break;
                            case "gemBlue50":
                                points += 50
                                break;
                            case "gemPink55":
                                points += 55
                                break;
                            case "gemYellow60":
                                points += 60
                                break;
                            case "gemBlue65":
                                points += 65
                                break;
                            case "gemPink70":
                                points += 70
                                break;
                            case "gemYellow75":
                                points += 75
                                break;
                        
                            default:
                                console.log("Unknown gem: " + gem.frame.name)
                                break;
                        }
                        this.score += points
                        this.scoreText.text = this.score
                        this.scoreText.setPosition(445-this.scoreText.width/2, 40-this.scoreText.height/2);
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

        // End gate
        this.physics.overlap(
            this.horse,
            [this.endGate],
            function() {
                    if (!this.done) {
                        this.done = true
                        this.clock.pause()
                        this.timeBonus = this.levelTime -  Math.ceil(this.clock.now / 1000)
                        this.finalScore = this.score + this.timeBonus
                    }
            },
            null,
            this);
    }
}