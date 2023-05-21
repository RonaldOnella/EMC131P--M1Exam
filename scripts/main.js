var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var endText;
var enterText;
var cstars = 0;
var scaleCounter = 0;
var shiftKey;
var enterKey;
var enterText;
var bckgrndAudio;
var collAudio;
var n = 1
var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('Mountains', 'assets/background.jpg ');
    this.load.image('mainplatform', 'assets/mainplatform.png');
    this.load.image('ground', 'assets/platform.jpg  ');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio('ambiance','assets/wind.wav');
    this.load.audio('ding','assets/ding.mp3');
}

function create ()
{

    collAudio = this.sound.add('ding');
    bckgrndAudio = this.sound.add('ambiance');
    var musicConfig = {
        mute: false,
        volume: 0.8,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
    }
    bckgrndAudio.play(musicConfig);
    //  Background img
    this.add.image(400, 300, 'Mountains');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Ground
    platforms.create(400, 568, 'mainplatform').setScale(2).refreshBody();

    //   ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    // player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);


    //  spawn stars
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    

    stars.children.iterate(function (child) {

        // star bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(650, 16, 'Stars: 0', { fontSize: '25px', fill: '#000' });

    //  Platform Collider
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
    this.physics.add.overlap(player, stars, collectStar, null, this);
    

    this.physics.add.collider(player, bombs, hitBomb, null, this);
   
    
}




function update ()
{
    if (gameOver == true) {
        player.visible = false;
            if (enterKey.isDown)
        {
    
            this.scene.restart(); // restart current scene
            score = 0;
            n = 1;
            cstars = 0;
            gameOver = false;
        }
    }

    if (shiftKey.isDown){
        if (cursors.left.isDown)
        {
        player.setVelocityX(-300);

        player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {   
        player.setVelocityX(300);

        player.anims.play('right', true);
        }
        else
        {
        player.setVelocityX(0);

        player.anims.play('turn');
        }
    }

    else if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }

    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-330);
    }
    
}
function hitBomb (player, bomb)
    {
        this.physics.pause();
    
        player.setTint(0xff0000);
    
        player.anims.play('turn');
    
        gameOver = true;
    
        endText = this.add.text(245,270, ' GAME OVER ', {fontSize: '50px', fill: '#ff00ff'});
        enterText = this.add.text(245,315, ' hit ENTER to restart ', {fontSize: '25px', fill: '#ff00ff'});
        
    }

function collectStar (player, star)
{
    collAudio.play();
    star.disableBody(true, true);
    
    //  Add and update the score
    score += 1;
    scoreText.setText('Stars: ' + score);

    //recolor sprite body on star collection
    cstars += 1;
    if (cstars == 1){
        player.setTint(0xff0000);
       
    }
    else if (cstars == 2){
        player.setTint(0xFFA500);
    }
        
    else if (cstars == 3) {
        player.setTint(0xffff00);
    }
    else if (cstars == 4) { 
        player.setTint(0x00ff00);
    }
    else if (cstars == 5) {
        player.setTint(0x0000ff);
    }
    else if (cstars == 6) {
        player.setTint(0x4b0082);
    }
    else {
        player.setTint(0xee82ee);
        cstars = 0 //reset cstars to 0
    }

    //resize sprite body on star collection
   
    if(score %5 ==0){
        player.setScale (n+= 0.1)
        var bomb = bombs.create(Phaser.Math.Between(50, 750), 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }

    if (stars.countActive(true) <12)
    {
        //  A new batch of stars to collect
        stars.create(Phaser.Math.RND.between(0, 700), Phaser.Math.RND.between(0, 500), 'star');
        
    }


    
}



