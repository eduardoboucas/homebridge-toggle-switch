'use strict'

const packageJSON = require('./package.json')

let Service, Characteristic, HomebridgeAPI

module.exports = function (homebridge) {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  HomebridgeAPI = homebridge
  homebridge.registerAccessory('homebridge-toggle-switch', 'ToggleSwitch', ToggleSwitch)
}

function ToggleSwitch(log, config) {
  this.log = log
  this.name = config.name
  this._service = new Service.Switch(this.name)
  this._state = false

  this.storageDirectory = HomebridgeAPI.user.persistPath()
  this.storage = require('node-persist')
  this.storage.initSync({
    dir: this.storageDirectory,
    forgiveParseErrors: true
  })

  this._service.getCharacteristic(Characteristic.On)
    .on('set', this.setState.bind(this))

  let storedState = this.storage.getItemSync(this.name)

  if (storedState !== undefined) {
    setTimeout(() => {
      this.log(
        `Restoring persisted state: ${this.getStringFromState(storedState)}`
      )

      this._service.setCharacteristic(
        Characteristic.On,
        Boolean(storedState)
      )  
    }, 250)
  }
}

ToggleSwitch.prototype.getServices = function () {
  const informationService = new Service.AccessoryInformation()

  informationService
    .setCharacteristic(Characteristic.Manufacturer, 'Eduardo Bouças')
    .setCharacteristic(Characteristic.Model, 'Toggle Switch')
    .setCharacteristic(Characteristic.SerialNumber, 'TSW01')
    .setCharacteristic(Characteristic.FirmwareRevision, packageJSON.version)

  return [informationService, this._service]
}

ToggleSwitch.prototype.getStringFromState = function (state) {
  return state ? 'ON' : 'OFF'
}

ToggleSwitch.prototype.setState = function (turnOn, callback) {
  if (turnOn && this._state) {
    this.log('Switch is ON, setting to OFF.')

    setTimeout(() => {
      this._service.setCharacteristic(Characteristic.On, false)  
    }, 100)
  } else {
    this.log(`Setting switch to ${this.getStringFromState(turnOn)}.`)

    this._state = turnOn

    this.storage.setItemSync(this.name, turnOn)
  }

  callback()
}