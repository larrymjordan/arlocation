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
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera();
    const userLocation = new THREE.Object3D;
    scene.add(camera);
    scene.add(userLocation);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        logarithmicDepthBuffer: true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    app.view.element.appendChild(renderer.domElement);
    //this.initThreeScene();
  }

  initThreeScene() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild(this.renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
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
