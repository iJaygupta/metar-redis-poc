const { Metar, Wind, Temperature } = require('./metar');

class MetarParser {
    constructor(data, date) {
        this.raw = data;
        this.date = date;
        this.metar = new Metar();
        this.tokens = [];
        this.index = 0;
    }

    getToken(index) {
        if (this.tokens.length > index) {
            return this.tokens[index];
        } else {
            return null;
        }
    }

    parseStationIdentifier(tokenIndex) {
        let token = this.getToken(tokenIndex);
        let stationRegx = /^[a-zA-Z0-9]{4}$/;
        if (token.match(stationRegx)) {
            this.metar.station = token;
        } else {
            throw new Error('Invalid station code :' + token);
        }
        return this;
    }

    parseDateAndTime(tokenIndex) {
        let token = this.getToken(tokenIndex);
        let dateRegx = /^(\d{2})(\d{2})(\d{2})Z$/;
        let values = token.match(dateRegx);

        if (values) {
            let d = this.date.split(" ")
            this.metar.time = `${d[0]} at ${d[1]}`;

        } else {
            throw new Error('Invalid date received. Token: ' + token);
        }
        return this;
    }

    parseTemperature(tokenIndex) {
        let token = this.getToken(tokenIndex);
        if (!token) {
            return this;
        }

        let tempAndDewRegx = /^(M)?(\d{2})\/(M)?(\d{2})?$/
        let values = token.match(tempAndDewRegx);
        if (values) {
            let temp = new Temperature();
            temp.value = parseInt(values[2]);
            temp.unit = 'C';
            temp.modifier = values[1] ? values[1] : '';
            this.metar.temperature = temp;

        }
        return this;
    }

    parseWind(tokenIndex) {
        let token = this.getToken(tokenIndex);
        if (!token) {
            return this;
        }

        let windRegx = /^(\d{3}||VRB)(\d{2,3})(G)?(\d{2,3})?KT$/;
        let values = token.match(windRegx);
        if (values) {

            let wind = new Wind();
            let direction = values[1];
            wind.direction = direction === 'VRB' ? 'VRB' : parseInt(values[1]);
            wind.speed = parseInt(values[2]);
            wind.unit = 'KT';
            wind.guts = (values[3] && values[4]) ? parseInt(values[4]) : null;

            this.metar.wind = wind;

            token = this.getToken(tokenIndex);
            if (!token) {
                return this;
            }
            // parse wind variation if available
            let variableWindDirRegx = /^(\d{3})V(\d{3})$/;
            values = token.match(variableWindDirRegx);
            if (values) {
                this.metar.wind.variation.min = parseInt(values[1]);
                this.metar.wind.variation.max = parseInt(values[2]);
            }
        }
        if (token.match(/^\/+(KT)?$/)) {
        }
        return this;
    }

    parse() {
        this.tokens = this.raw
            .split(' ')
            .map((val) => {
                return val.trim();
            })
            .filter((val) => {
                return !!val;

            });

        this.parseStationIdentifier(0)
            .parseDateAndTime(1)
            .parseWind(3)
            .parseTemperature(6)



    }

}

exports.metarParser = function (data, date) {
    data = data.trim();
    if (data) {
        try {
            let metarParser = new MetarParser(data, date);
            metarParser.parse();

            return metarParser.metar.toHumanFriendly();
        } catch (err) {
            throw new Error('Metar Parser failed to parse data: ' + data);
        }
    } else {
        throw new Error('Invalid Metar data: ' + data);

    }
}