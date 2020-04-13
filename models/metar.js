
class Metar {
    constructor() {
        this.type = null;
        this.station = null;
        this.time = null;
        this.wind = null;
        this.temperature = null;
    }

    toHumanFriendly() {
        let data = {};
        data.station = this.station;
        data.observationTime = this.time;

        if (this.wind) {
            data.wind = this.wind.toString();
        }

        if (this.temperature) {
            data.temperature = this.temperature.toString();
        }

        return data;
    }
}

class Wind {
    constructor() {
        this.direction = null;
        this.speed = null;
        this.unit = 'KT';
        this.guts = null;
        this.variation = {
            min: null,
            max: null,
        };
    }

    toString() {
        if (this.direction === 0 && this.speed === 0) {
            return 'Calm';
        }
        let str = '';
        if (this.direction === 'VRB') {
            str += ' variable';
        } else {
            str += 'from ' + this.direction + ' degree';
        }
        if (this.variation.min) {
            str += ' to ' + this.variation.min; 
        }
        if (this.variation.max) {
            str += '-' + this.variation.max + ' degree';
        }
        str += ' at ' + this.speed + ' knots';
        if (this.guts) {
            str += ', gusting to ' + this.guts + ' knots';
        }
        return str;
    }
}

class Temperature {
    constructor() {
        this.value = null;
        this.unit = 'C';
        this.modifier = null;
        this.fahrenheit = '';

    }

    toString() {
        let str = '';
        if (this.modifier === 'M') {
            str += '-';
        }
        const modifier = this.modifier === 'M' ? -1 : 1
        this.fahrenheit = (modifier * (this.value) * 9 / 5) + 32;

        return `${str}${this.value} C (${this.fahrenheit} F)`;
    }
}





module.exports = {
    Metar,
    Wind,
    Temperature
};
