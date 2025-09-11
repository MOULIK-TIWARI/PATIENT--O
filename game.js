// 1. CONFIGURATION
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true // KEEP THIS TRUE! It's essential for debugging.
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

// 2. DEFINE YOUR VARIABLES
var player;
var platforms;
var cursors;
var spaceKey;
var attackKey;

// 3. PRELOAD FUNCTION
function preload() {
    // Load placeholder images
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/ground.png');
    this.load.image('player', 'assets/player.png');
}

// 4. CREATE FUNCTION
function create() {
    // Add background
    this.add.image(400, 300, 'sky');

    // Create platforms group and the ground
    platforms = this.physics.add.staticGroup();
    var ground = platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // CREATE THE PLAYER
    player = this.physics.add.sprite(100, 450, 'player');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true); // Keep player in the game world

    // Make player collide with platforms
    this.physics.add.collider(player, platforms);

    // SETUP KEYBOARD INPUT
    cursors = this.input.keyboard.createCursorKeys();
    spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);

    // DEBUG TEXT - Very Important!
    debugText = this.add.text(10, 10, 'Debug Info:', { fontSize: '16px', fill: '#fff' });
}

// 5. UPDATE FUNCTION - Runs every frame
function update() {
    // Update debug text to see what's happening
    debugText.setText([
        'Velocity Y: ' + player.body.velocity.y.toFixed(2),
        'Blocked Down: ' + player.body.blocked.down, // <- Check this line!
        'Touching Down: ' + player.body.touching.down,
        'Space Key: ' + spaceKey.isDown,
        'Up Key: ' + cursors.up.isDown
    ]);

    // Reset horizontal movement every frame
    player.setVelocityX(0);

    // LEFT AND RIGHT MOVEMENT
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
    }

    // JUMPING - SIMPLIFIED AND FIXED
    // Use 'blocked.down' which is more reliable for platforms
    if ((cursors.up.isDown || spaceKey.isDown) && player.body.blocked.down) {
        player.setVelocityY(-330); // This makes the player jump upwards
    }

    // ATTACKING
    if (Phaser.Input.Keyboard.JustDown(attackKey)) {
        console.log("Punch!");
    }
}