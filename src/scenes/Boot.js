import Phaser from 'phaser'
import { POLICE } from '../config.js'

export default class Boot extends Phaser.Scene {
  constructor() { super('Boot') }

  create() {
    this.add.text(this.scale.width / 2, this.scale.height / 2, 'Boot OK', { fontFamily: POLICE, fontSize: 20, color: '#e8731a' }).setOrigin(0.5)
  }
}
