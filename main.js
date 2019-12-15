var controls, time = Date.now();
var balls = [], ballMeshes = [];
var dt = 1/60;
var stat, scene;
var renderer, topRenderer;
var g=[];
for(i=0,a=1;i<3;i++){
    g.push(a);
    a=a*2;
}

// var enemyMaterial = new CANNON.Material("enemyMaterial");
// var wallMaterial = new CANNON.Material("wallMaterial");
// var enemy_wall_contact = new CANNON.ContactMaterial(wallMaterial,enemyMaterial, {
//     friction: 0,
//     restitution: 0
// })

function Init(){
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.shadowMapEnabled = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;
    renderer.autoClear = false

    Start();
    InitWorld();
    InitScene();
    InitGameObject();

    stat = InitStats();

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0.5);
    // renderer.vr.enabled = true;
    
    document.body.appendChild(WEBVR.createButton(renderer));
    document.body.appendChild(renderer.domElement);

    // renderer.setAnimationLoop(Update);
    
    Update();
}

function Start(){
    var blocker = document.getElementById( 'blocker' );
    var instructions = document.getElementById( 'instructions' );

    havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

    if ( havePointerLock ) {

        var element = document.body;


        var pointerlockchange = function ( event ) {

            if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

                controls.enabled = true;

                blocker.style.display = 'none';

            } else {

                controls.enabled = false;

                blocker.style.display = '-webkit-box';
                blocker.style.display = '-moz-box';
                blocker.style.display = 'box';

                instructions.style.display = '';

            }

        }

        var pointerlockerror = function ( event ) {
            instructions.style.display = '';
        }

        // Hook pointer lock state change events
        document.addEventListener( 'pointerlockchange', pointerlockchange, false );
        document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
        document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

        document.addEventListener( 'pointerlockerror', pointerlockerror, false );
        document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
        document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

        instructions.addEventListener( 'click', function ( event ) {
            instructions.style.display = 'none';

            // Ask the browser to lock the pointer
            element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

            if ( /Firefox/i.test( navigator.userAgent ) ) {

                var fullscreenchange = function ( event ) {

                    if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                        document.removeEventListener( 'fullscreenchange', fullscreenchange );
                        document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                        element.requestPointerLock();
                    }

                }

                document.addEventListener( 'fullscreenchange', fullscreenchange, false );
                document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

                element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

                element.requestFullscreen();

            } else {

                element.requestPointerLock();

            }

        }, false );

    } else {

        instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

    }
    var onKeyDown = function ( event ) {
        if(event.keyCode==27){
            window.location.reload();
        }
    }
    document.addEventListener( 'keydown', onKeyDown, false );
}

function Restart() {
    window.removeEventListener("click",Click);
    Start();
    InitGameObject();
    SceneUpdate();
    alert("Your Score is " + score + " with survival time " + Math.floor(sec) + " second");

    score = 0;
    time = 0;
    
    document.getElementById("score").innerHTML="Score<br>" + score +"<br>Time<br>" + Math.floor(sec);
}

function InitStats() {

    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.right = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById("Stats-output").appendChild(stats.domElement);

    return stats;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function Update() {
    requestAnimationFrame( Update );
    
    SceneUpdate();
    
    stat.update();

}
Init();