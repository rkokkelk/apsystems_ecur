const tcpSock = require('net')
const Parser = require('binary-parser').Parser

/**
 * @class
 */
class ECUR {
    /**
     * @constructor
     * @param {String} host - Host used for TCP connection
     * @param {Integer} port - Port used for TCP connection
     */
    constructor (host, port) {
        this.host = host
        this.port = port

        // TCP sock connections
        this.client = new tcpSock.Socket()

        // ECU-R cmd's, info see:
        // https://github.com/ksheumaker/homeassistant-apsystems_ecur/blob/main/custom_components/apsystems_ecur/APSystemsECUR.py#L39
        this.cmd_end = 'END\n'
        this.ecu_query = 'APS1100160001'
        this.inverter_query_prefix = 'APS1100280002'
        this.inverter_signal_prefix = 'APS1100280030'

        // Default structs
        this.ecu_query = new Parser()
            .string('cmdPrefix', { length: 13 })
            .string('ecu_id', { length: 12 })
            .string('unknown1', { length: 2 })
            .int32('lifetime_energy')
            .int32('current_power')
            .int32('today_energy')
            .string('unknown2', { length: 7 })
            .int16('qty_of_inverters')
            .string('unknown3', { length: 7 })
            .string('firmware', { length: 18 })
            .string('timezone', { length: 12 })
    }

    /**
     * Open TCP socket connection
     *
     * @param {connectBallback} - callback
     */
    connect (callback) {
        this.socket = this.client.connect(this.port, this.host, callback)
    }

    /**
     * Send CMD to tcp socket
     *
     * @param {String} cmd - Command to send
     * @param {Function} callback - function when data is written
     */
    write (cmd, callback) {
        const self = this

        this.connect(function (data) {
            self.socket.write(cmd, callback)
        })
    }

    /**
     * Get general ECU data
     *
     * @param {Function} callback - function when data is received and parsed
     */
    getECUdata (callback) {
        const cmd = 'APS1100160001' + this.cmd_end
        const self = this

        this.write(cmd, function () {
            // Set parsing socket
            self.socket.on('data', function (data) {
                const ecuData = self.ecu_query.parse(data)

                ecuData.today_energy /= 10
                ecuData.lifetime_energy /= 100

                callback(ecuData)
            })
        })
    }
}

module.exports = ECUR
