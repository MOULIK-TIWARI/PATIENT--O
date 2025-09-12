// Simple Stickman Game - 5 Levels
// This code will work on your computer without Devvit

// Phaser game configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent: 'phaser-game',
    backgroundColor: '#111133',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

// Create the game
const game = new Phaser.Game(config);

// Game variables
let player, cursors, enemies, level, playerHealth, attackZone;
let levelText, healthText;

function preload() {
    // We'll load assets here tomorrow
    // this.load.image('player', 'assets/player.png');
    function preload() {
    // Load our new sprite images
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/enemy.png');
    this.load.image('attack', 'assets/attack.png'); // Load the attack sprite if you made it
}
}

function create() {
    // Setup game state
    level = 1;
    playerHealth = 100;
    enemies = this.physics.add.group();
    
    // Create floor
    this.add.rectangle(400, 390, 800, 20, 0x444444);
    
    // Create player (stickman)
    player = this.add.rectangle(100, 300, 20, 50, 0xffffff);
    this.physics.add.existing(player);
    player.body.setCollideWorldBounds(true);
    
    // Create attack zone (invisible)
    attackZone = this.add.rectangle(140, 300, 40, 30, 0xff0000, 0.3);
    this.physics.add.existing(attackZone);
    
    // Setup keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', attack, this);
    
    // Create enemies for level 1
    createEnemies.call(this);
    
    // Setup HUD
    levelText = document.getElementById('levelText');
    healthText = document.getElementById('healthText');
    updateHUD();
}

function update() {
    // Movement
    player.body.setVelocityX(0);
    
    if (cursors.left.isDown) {
        player.body.setVelocityX(-160);
    } else if (cursors.right.isDown) {
        player.body.setVelocityX(160);
    }
    
    // Keep attack zone with player
    attackZone.x = player.x + 30;
    attackZone.y = player.y;
    
    // Check for level completion
    if (enemies.countActive(true) === 0) {
        level++;
        if (level > 5) {
            showFinalCutscene.call(this);
        } else {
            createEnemies.call(this);
            updateHUD();
        }
    }
}

function attack() {
    // Check if attack hits any enemies
    enemies.getChildren().forEach(enemy => {
        if (Phaser.Geom.Rectangle.Overlaps(
            attackZone.getBounds(),
            enemy.getBounds()
        )) {
            enemy.health -= 10;
            if (enemy.health <= 0) {
                enemy.destroy();
            }
        }
    });
}

function createEnemies() {
    enemies.clear(true, true);
    
    for (let i = 0; i < level; i++) {
        const enemy = this.add.rectangle(600 + i * 60, 300, 20, 50, 0xff0000);
        this.physics.add.existing(enemy);
        enemy.health = 30;
        enemies.add(enemy);
    }
}

function updateHUD() {
    healthText.textContent = playerHealth;
    levelText.textContent = level;
}

function showFinalCutscene() {
    // Stop physics
    this.physics.pause();
    
    // Create final message
    const style = { font: '20px Arial', fill: '#ffffff' };
    this.add.text(250, 150, 'The Doctor appears...', style);
    this.add.text(200, 200, '"You have only been fighting yourself"', style);
    this.add.text(300, 250, 'None of this is real...', style);
    
    // After 5 seconds, show credits
    this.time.delayedCall(5000, () => {
        this.add.text(350, 300, 'THE END', { font: '30px Arial', fill: '#ff0000' });
    });
}