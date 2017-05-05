import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import * as Argon from '@argonjs/argon';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app works!';
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.PerspectiveCamera;
  cube: THREE.Mesh;

  ngOnInit() {
    // initialize Argon
    let app = Argon.init();
    app.context.setDefaultReferenceFrame(app.context.localOriginEastUpSouth);

    // initialize THREE
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera();
    let userLocation = new THREE.Object3D;
    scene.add(camera);
    scene.add(userLocation);
    let renderer = new THREE.WebGLRenderer({
      alpha: true,
      logarithmicDepthBuffer: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    app.view.element.appendChild(renderer.domElement);

    //Create an 3D Object.
    let boxGeoObject = new THREE.Object3D();
    let box = new THREE.Object3D();
    let loader = new THREE.TextureLoader();
    loader.load("box.png", function (texture) {
      let geometry = new THREE.BoxGeometry(2, 2, 2);
      let material = new THREE.MeshBasicMaterial({ map: texture });
      let mesh = new THREE.Mesh(geometry, material);
      box.add(mesh);
    });
    boxGeoObject.add(box);

    let boxGeoEntity = new Argon.Cesium.Entity({
      name: "I have a box",
      position: Argon.Cesium.Cartesian3.ZERO,
      orientation: Argon.Cesium.Quaternion.IDENTITY
    });

    // the updateEvent is called each time the 3D world should be
    // rendered, before the renderEvent.  The state of your application
    // should be updated here.
    let boxInit = false;

    app.updateEvent.addEventListener((frame) => {
      // get the position and orientation (the 'pose') of the user
      // in the local coordinate frame.
      let userPose = app.context.getEntityPose(app.context.user);

      // assuming we know the user's pose, set the position of our 
      // THREE user object to match it
      if (userPose.poseStatus & Argon.PoseStatus.KNOWN) {
        userLocation.position.copy(userPose.position);
      } else {
        // if we don't know the user pose we can't do anything
        return;
      }

      // the first time through, we create a geospatial position for
      // the box somewhere near us 
      if (!boxInit) {
        const defaultFrame = app.context.getDefaultReferenceFrame();

        // set the box's position to 10 meters away from the user.
        // First, clone the userPose postion, and add 10 to the X
        const boxPos = userPose.position.clone();
        boxPos.x += 10;

        // set the value of the box Entity to this local position, by
        // specifying the frame of reference to our local frame
        boxGeoEntity.position.setValue(boxPos, defaultFrame);

        // orient the box according to the local world frame
        boxGeoEntity.orientation.setValue(Cesium.Quaternion.IDENTITY);

        // now, we want to move the box's coordinates to the FIXED frame, so
        // the box doesn't move if the local coordinate system origin changes.
        if (Argon.convertEntityReferenceFrame(boxGeoEntity, frame.time,
          ReferenceFrame.FIXED)) {
          scene.add(boxGeoObject);
          boxInit = true;
        }
      }

      // get the local coordinates of the local box, and set the THREE object
      let boxPose = app.context.getEntityPose(boxGeoEntity);
      boxGeoObject.position.copy(boxPose.position);
      boxGeoObject.quaternion.copy(boxPose.orientation);

      // rotate the box at a constant speed, independent of frame rates     
      // to make it a little less boring
      box.rotateY(3 * frame.deltaTime / 10000);
    })

    //this.initThreeScene();
  }

  initThreeScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(this.renderer.domElement );

    let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    let material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    this.cube = new THREE.Mesh( geometry, material );
    this.scene.add( this.cube );

    this.camera.position.z = 5;
    this.render();
  }

  render() {
    requestAnimationFrame( ()=>{this.render()} );
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;
    this.renderer.render(this.scene, this.camera );
  }
}
