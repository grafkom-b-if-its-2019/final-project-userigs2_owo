var Enemies = []

var enemyBodies = []
var enemyMeshes = []

function InitEnemy() {
    // placeholder
    coord = [   [50,10,50],
                [50,0,50],
                [-50,0,47]]


    for(var i=0; i<coord.length; i++) {
        Enemies[i] = new enemy(coord[i][0],coord[i][1],coord[i][2]);
    }
}

// Area 1: 30 (min 0), 0, 69 (min 40)
// Area 2:

var enemy = function(x,y,z) {

    //placeholder model
    var EnemyShape = new CANNON.Sphere(1.3);
    var EnemyBody = new CANNON.Body({mass:5});
    EnemyBody.addShape(EnemyShape);

    var EnemyGeometry = new THREE.SphereGeometry(EnemyShape.radius, 32, 32);
    var EnemyMaterial = new THREE.MeshPhongMaterial({color: '#ff0000'});    
    var EnemyMesh = new THREE.Mesh( EnemyGeometry, EnemyMaterial );

    EnemyMesh.castShadow = true;
    EnemyMesh.receiveShadow = true;
    
    EnemyBody.position.set(x,y,z);
    EnemyMesh.position.copy(EnemyBody.position);
    
    EnemyBody.linearDamping = 0.9;
    
    scene.add(EnemyMesh);
    world.addBody(EnemyBody);

    enemyBodies.push(EnemyBody);
    enemyMeshes.push(enemyMeshes);
}