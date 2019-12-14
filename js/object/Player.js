function InitPlayer(){
      // Create Sphere
      sphereShape = new CANNON.Sphere(radius);
      sphereBody = new CANNON.Body({mass:mass});
      sphereBody.addShape(sphereShape);
      sphereBody.position.set(0,100,0);
      sphereBody.linearDamping = 0.9;
      world.addBody(sphereBody);
      PlayerShoot();

}

function PlayerShoot(){
    var ballShape = new CANNON.Sphere(0.2);
    var ballGeometry = new THREE.SphereGeometry(ballShape.radius, 32, 32);
    var shootDirection = new THREE.Vector3();
    var shootVelo = 90;
    var projector = new THREE.Projector();
    function getShootDir(targetVec){
        var vector = targetVec;
        targetVec.set(0,0,1);
        vector.unproject(camera)
        var ray = new THREE.Ray(sphereBody.position, vector.sub(sphereBody.position).normalize() );
        targetVec.copy(ray.direction);
    }

    window.addEventListener("click",function(e){
        if(controls.enabled==true){
            var x = sphereBody.position.x;
            var y = sphereBody.position.y;
            var z = sphereBody.position.z;
            var ballBody = new CANNON.Body({ mass: 1 });
            ballBody.addShape(ballShape);
            var ballMesh = new THREE.Mesh( ballGeometry, material );
            world.addBody(ballBody);
            scene.add(ballMesh);
            ballMesh.castShadow = true;
            ballMesh.receiveShadow = true;
            balls.push(ballBody);
            ballMeshes.push(ballMesh);
            getShootDir(shootDirection);
            ballBody.velocity.set(  shootDirection.x * shootVelo,
                                    shootDirection.y * shootVelo,
                                    shootDirection.z * shootVelo);

            // Move the ball outside the player sphere
            x += shootDirection.x * (sphereShape.radius*1.02 + ballShape.radius);
            y += shootDirection.y * (sphereShape.radius*1.02 + ballShape.radius);
            z += shootDirection.z * (sphereShape.radius*1.02 + ballShape.radius);
            ballBody.position.set(x,y,z);
            ballMesh.position.set(x,y,z);
        }
    });
}

function BulletMovement(){
    for(var i=0; i<balls.length; i++){
        ballMeshes[i].position.copy(balls[i].position);
        ballMeshes[i].quaternion.copy(balls[i].quaternion);
        for(j = 0;j<cityBlocks.length;j++){
            if(ballMeshes[i].position.x+0.2>=cityBlocks[j][0]-cityBlocks[j][3] && ballMeshes[i].position.x-0.2<=cityBlocks[j][0]+cityBlocks[j][3]){
                if(ballMeshes[i].position.y+0.2>=cityBlocks[j][1]-cityBlocks[j][4] && ballMeshes[i].position.y-0.2<=cityBlocks[j][1]+cityBlocks[j][4]){
                    if(ballMeshes[i].position.z+0.2>=cityBlocks[j][2]-cityBlocks[j][5] && ballMeshes[i].position.z-0.2<=cityBlocks[j][2]+cityBlocks[j][5]){
                        scene.remove(ballMeshes[i]);
                        world.removeBody(balls[i]);
                    }
                }
            }
        }
        // if(ballMeshes[i].position.x>=0 && ballMeshes.position.x<=300){
        //     if(ballMeshes[i].position.z>=0 && ballMeshes.position.z<=300){
        //         scene.remove(ballMeshes[i]);
        //         world.remove(balls[i]);
        //     }
        // }
    }
}