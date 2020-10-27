import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener, Renderer2, NgZone, OnInit } from '@angular/core';
import * as THREE from 'three';

import { SceneService } from './scene.service';



@Component({
  selector: 'app-page2',
  templateUrl: './page2.component.html',
  styleUrls: ['./page2.component.scss']
})
export class Page2Component implements AfterViewInit {

  @ViewChild('myCanvas', { static: true }) private canvasRef: ElementRef;

  private innerBox: THREE.Mesh;
  private outerBox: THREE.Mesh;
  private contorolBox: THREE.Mesh;

  private isEdite: boolean;
  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  constructor(private ngZone: NgZone,
              private scene: SceneService) {
    THREE.Object3D.DefaultUp.set(0, 0, 1);
  }

  ngAfterViewInit() {

    this.scene.OnInit(this.getAspectRatio(),
                      this.canvas,
                      devicePixelRatio,
                      window.innerWidth,
                      window.innerHeight - 150);

    // ラベルを表示する用のレンダラーを HTML に配置する
    const element = this.scene.labelRendererDomElement();
    const div = document.getElementById('myCanvas');        // ボタンを置きたい場所の手前の要素を取得
    div.parentNode.insertBefore(element, div.nextSibling);  // ボタンを置きたい場所にaタグを追加

    this.myInit();

    // レンダリングする
    this.animate();

    this.isEdite = false;
  }

  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('DOMContentLoaded', () => {
      this.scene.render();
      });
    });
  }

  // マウスクリック時のイベント
  @HostListener('mousedown', ['$event'])
  public onMouseDown(event: MouseEvent) {
    const mouse: THREE.Vector2 = this.getMousePosition(event);
    this.detectObject(mouse, 'click');

  }

  // マウスクリック時のイベント
  @HostListener('mouseup', ['$event'])
  public onMouseUp(event: MouseEvent) {
    const mouse: THREE.Vector2 = this.getMousePosition(event);
    this.detectObject(mouse, 'select');

  }

  // マウス移動時のイベント
  @HostListener('mousemove', ['$event'])
  public onMouseMove(event: MouseEvent) {
    const mouse: THREE.Vector2 = this.getMousePosition(event);
    this.detectObject(mouse, 'hover');

  }

  // マウス位置とぶつかったオブジェクトを検出する
  private getMousePosition(event: MouseEvent): THREE.Vector2 {
    event.preventDefault();
    const rect = this.scene.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
    return mouse;
  }

  // ウインドウがリサイズした時のイベント処理
  @HostListener('window:resize', ['$event'])
  public onResize(event: Event) {
    this.scene.onResize(this.getAspectRatio(),
                        window.innerWidth,
                        window.innerHeight - 120);
  }

  private getAspectRatio(): number {
    if (this.canvas.clientHeight === 0) {
      return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  //////////////////////////////////////////////////////
  // 初期化
  //////////////////////////////////////////////////////
  private myInit( ): void {

    // 内空寸法
    const innerArea = new THREE.BoxBufferGeometry( 20, 60, 20 );
    const material1 = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, transparent: true, opacity: 0.2 } );
    this.innerBox = new THREE.Mesh( innerArea , material1 );

    this.innerBox.position.x = 0;
    this.innerBox.position.y = 0;
    this.innerBox.position.z = -20;

    this.scene.add( this.innerBox);

    // 外郭寸法
    const outerArea = new THREE.BoxBufferGeometry( 25, 59, 25 );
    const material2 = new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff, transparent: true, opacity: 0.5 } );
    this.outerBox = new THREE.Mesh( outerArea , material2 );

    this.outerBox.position.x = 0;
    this.outerBox.position.y = 0;
    this.outerBox.position.z = -20;

    this.scene.add( this.outerBox);

    // コントロール
    const geometry = new THREE.BoxBufferGeometry( 5, 5, 5 );

    const material = new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } );
    this.contorolBox = new THREE.Mesh( geometry, material );

    this.contorolBox.position.x = 7.5;
    this.contorolBox.position.y = -27.5;
    this.contorolBox.position.z = -27.5;

    this.scene.add( this.contorolBox );

  }

  //////////////////////////////////////////////////////
  // マウス位置とぶつかったオブジェクトを検出する
  //////////////////////////////////////////////////////
  public detectObject(mouse: THREE.Vector2, action: string): void {

    const raycaster = this.scene.getRaycaster(mouse);

    // 交差しているオブジェクトを取得
    const intersects = raycaster.intersectObjects([this.contorolBox]);
    if (intersects.length ===0){
      return;
    }

    switch (action) {
      case 'click':
        break;

      case 'select':
        if (this.contorolBox === intersects[0].object) {
          this.scene.transformControl_attach( this.contorolBox)
          this.isEdite = true;
        }else{
          this.scene.transformControl_detach()
          this.isEdite = false;
        }
        break;

      case 'hover':
        if (this.contorolBox === intersects[0].object) {
          if(this.isEdite===true){
            const pos = this.contorolBox.position;
      
            console.log(pos.x, pos.z)

            this.innerBox.scale.x = Math.abs((pos.x+2.5) * 2 / 20);
            this.innerBox.scale.z = Math.abs((pos.z+17.5) * 2 / 20);

            this.outerBox.scale.x = Math.abs((pos.x+2.5) * 2 / 20);
            this.outerBox.scale.z = Math.abs((pos.z+17.5) * 2 / 20);

            this.scene.render();
          }
        }
        break;
      }

    // 再描画
    this.scene.render();
  }

}


