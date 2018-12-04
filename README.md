# Homebridge Toggle Switch

Physical buttons are a great way to control accessories or scenes in HomeKit, using the *Automations* tab of the Home app. Unfortunately, it's not possible to set a button to toggle the state of an accessory of scene: you must program the button to either turn something *on* or *off*. As most buttons come with more than one action (e.g. single press, double press and long press), you end up assigning one action to turn an accessory *on* and another one to turn it *off*. This means wasting two actions with something that should've been done with one.

If you use [Homebridge](https://github.com/nfarina/homebridge), this plugin allows you to create switches that act as toggles, meaning that they turn *on* when they receive the *on* command for the first time, but turn *off* when they receive it for the second time. In practice, this means that if you program a physical button to turn on this toggle switch, pressing the button a second time will turn it off, then pressing it again will turn it back on, etc. If you then associate the toggle switch with any accessory or scene of your choice, you can toggle them with your physical button. Yay!

## Installation

```
[sudo] npm install -g homebridge-toggle-switch
```

## Configuration

To add a toggle switch, add an entry simila to the one below to your configuration file. You can add as many switches as you want.

```json
"accessories": [
  {
    "accessory": "ToggleSwitch",
    "name": "POP Switch 1"
  }
]
```
