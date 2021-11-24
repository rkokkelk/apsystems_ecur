# APSystems ECU-R
NodeJS module for reading data locally from APsystems ECU-R systems

## Installation

Install using `npm`:

```bash
npm install apsystems
```

## Example

```js
const apsystems = require('apsystems')

const ecur = apsystems.ECUR('10.10.10.10', 8899);
ecur.getECUdata(function(err, result){
    if (err) return console.error('Error occurred: ' + err);

    console.log(result)

// ----------------
{
  cmdPrefix: 'APS1201120001',
  ecu_id: '216200000000',
  unknown1: '01',
  lifetime_energy: 8.8,  # kWh
  current_power: 0,      # W
  today_energy: 0.65,    # kWh
  unknown2: ' !\x11$\x17!V',
  qty_of_inverters: 1,
  unknown3: '\x00\x0010015',
  firmware: 'ECU_R_PRO_2.0.3012',
  timezone: 'Europe/Paris'
}
```

## Acknowledgement

This couldn't have been done without the hardwork of @checking12 and @HAEdwin on the home assistant forum, and all the other people from this [forum](https://gathering.tweakers.net/forum/list_messages/2032302/1).
