var playerMesh;
var playerBody;
var score=0;
var ballShape;
var ballGeometry;
var shootDirection;
var shootVelo;
var clock = new THREE.Clock();
var particleGroup=[], particleAttributes;
var particles=[];
var bulletTime=[];

function InitPlayer(){
    // Player Body
    playerShape = new CANNON.Sphere(radius);
    playerBody = new CANNON.Body({mass:mass,collisionFilterGroup:g[0],collisionFilterMask:g[1]});
    playerBody.addShape(playerShape);
    playerBody.position.set(Math.random()*100-50,50,Math.random()*100-50);
    playerBody.linearDamping = 0.9;
    // Player Mesh
    var sphereGeometry = new THREE.SphereGeometry(radius,32,32);
    var sphereMaterial = new THREE.MeshLambertMaterial({color: 0xffff00});
    playerMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    playerMesh.position.copy(playerBody.position);
    playerMesh.castShadow = true;
    playerMesh.receiveShadow = true;
    
    scene.add(playerMesh);
    world.addBody(playerBody);
    PlayerShoot();
}
function PlayerShoot(){
    ballShape = new CANNON.Sphere(0.2);
    ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
    shootDirection = new THREE.Vector3();
    shootVelo = 90;

    
    
    
    // projector = new THREE.Projector();
    window.addEventListener("click",Click);
}

function getShootDir(targetVec){
    var vector = targetVec;
    targetVec.set(0,0,1);
    vector.unproject(camera)
    var ray = new THREE.Ray(playerBody.position, vector.sub(playerBody.position).normalize() );
    targetVec.copy(ray.direction);
}

function Click(e){
    if(controls.enabled==true){
        var x = playerBody.position.x;
        var y = playerBody.position.y;
        var z = playerBody.position.z;
        var ballBody = new CANNON.Body({ mass: 1,collisionFilterGroup:g[0],collisionFilterMask:g[1]|g[2]});
        ballBody.addShape(ballShape);
        var bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff });
        var ballMesh = new THREE.Mesh( ballGeometry, bulletMaterial );

        var particleTexture = THREE.ImageUtils.loadTexture('./assets/textures/particles/star_08.png');
        particleGroup = new THREE.Object3D();
        particleAttributes = {
            starSize: [],
            starPosition: [],
            randomness: []
        };
        var totalParticles = 200;
        var radiusRange = 1;
        for(var i=0; i < totalParticles; i++) {
            var spriteMaterial = new THREE.SpriteMaterial( {
                map: particleTexture,
                useScreenCoordinates: false,
                color: 0x00000
            });
            var sprite = new THREE.Sprite( spriteMaterial );
            sprite.scale.set(1, 1, 1);
            sprite.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
            // sprite.position.setLength( radiusRange * Math.random());
            sprite.position.setLength( radiusRange * (Math.random() * 0.1 + 0.9) );
            sprite.material.color.setHSL( Math.random(), 0.9, 0.7 );
            sprite.opacity = 0.80; // translucent particles
            sprite.material.blending = THREE.AdditiveBlending; // Glowing Effect
            sprite.renderOrder = -1;
            particleGroup.add( sprite );
            particleAttributes.starPosition.push( sprite.position.clone() );
            particleAttributes.randomness.push( Math.random() );
        }
        particleGroup.position.z = -0.1;

        world.addBody(ballBody);
        scene.add(ballMesh);
        scene.add( particleGroup );
        ballMesh.castShadow = true;
        ballMesh.receiveShadow = true;
        balls.push(ballBody);
        ballMeshes.push(ballMesh);
        particles.push( particleGroup );
        bulletTime.push(0);
        getShootDir(shootDirection);
        ballBody.velocity.set(  shootDirection.x * shootVelo,
                                shootDirection.y * shootVelo,
                                shootDirection.z * shootVelo);

        // Move the ball outside the player sphere
        x += shootDirection.x * (playerShape.radius*1.02 + ballShape.radius);
        y += shootDirection.y * (playerShape.radius*1.02 + ballShape.radius);
        z += shootDirection.z * (playerShape.radius*1.02 + ballShape.radius);
        ballBody.position.set(x,y,z);
        ballMesh.position.set(x,y,z);
        score--;
        document.getElementById("score").innerHTML="Score<br>" + score +"<br>Time<br>" + Math.floor(sec);
    }
}

function BulletMovement(){
    for(var i=0; i<balls.length; i++){
        ballMeshes[i].position.copy(balls[i].position);
        ballMeshes[i].quaternion.copy(balls[i].quaternion);
        particles[i].position.copy(balls[i].position);
        if(bulletTime[i]>300) {
            scene.remove(ballMeshes[i]);
            scene.remove(particles[i]);
            world.removeBody(balls[i]);
            ballMeshes.splice(i,1);
            particles.splice(i,1);
            balls.splice(i,1);
            bulletTime.splice(i,1);
            i--;
        }
        else {
            bulletTime[i]++;
    
            var time = 4 * clock.getElapsedTime();
        
            for ( var c = 0; c < particles[i].children.length; c ++ ) 
            {
                var sprite = particles[i].children[ c ];
    
                // particle wiggle
                var wiggleScale = 2;
                sprite.position.x += wiggleScale * (Math.random() - 0.5);
                sprite.position.y += wiggleScale * (Math.random() - 0.5);
                sprite.position.z += wiggleScale * (Math.random() - 0.5);
                
                // pulse away/towards center
                // individual rates of movement
                var a = particleAttributes.randomness[c] + 1;
                var pulseFactor = Math.sin(a * time) * 0.1 + 0.9;
                sprite.position.x = particleAttributes.starPosition[c].x * pulseFactor;
                sprite.position.y = particleAttributes.starPosition[c].y * pulseFactor;
                sprite.position.z = particleAttributes.starPosition[c].z * pulseFactor;	
            }
            particles[i].rotation.y = time * 0.75;
    
            if(ballMeshes[i].position.x>=-300 && ballMeshes[i].position.x<=300){
                if(ballMeshes[i].position.z>=-300 && ballMeshes[i].position.z<=300){
                    if(ballMeshes[i].position.y>=-1 && ballMeshes[i].position.y<=1){
                        scene.remove(ballMeshes[i]);
                        scene.remove(particles[i]);
                        world.removeBody(balls[i]);
                        ballMeshes.splice(i,1);
                        particles.splice(i,1);
                        balls.splice(i,1);
                        i--;
                    }
                }
            }
            for(j=0;j<enemyMeshes.length;j++){
                if(ballMeshes[i].position.x + 1.4 >= enemyMeshes[j].position.x && 
                    ballMeshes[i].position.x - 1.4 <= enemyMeshes[j].position.x){
                    if(ballMeshes[i].position.y + 1.4 >= enemyMeshes[j].position.y && 
                        ballMeshes[i].position.y - 1.4 <= enemyMeshes[j].position.y){
                        if(ballMeshes[i].position.z + 1.4 >= enemyMeshes[j].position.z && 
                            ballMeshes[i].position.z - 1.4 <= enemyMeshes[j].position.z){
                            scene.remove(ballMeshes[i]);
                            scene.remove(particles[i]);
                            world.removeBody(balls[i]);
                            scene.remove(enemyMeshes[j]);
                            world.remove(enemyBodies[j]);
                            score+=2;
                            if(score>=0){
                                score=0;
                            }
                            document.getElementById("score").innerHTML="Score<br>" + score +"<br>Time<br>" + Math.floor(sec);
                            ballMeshes.splice(i,1);
                            balls.splice(i,1);
                            particles.splice(i,1);
                            enemyBodies.splice(j,1);
                            enemyMeshes.splice(j,1);
                            i--;
                            j--;
                        }
                    }
                }
            }
        }
    }
}