module PowerTables {
    /**
     * API responsible for dates operations
     */
    export class DateService {
        constructor(datepickerOptions: IDatepickerOptions) {
            this._datepickerOptions = datepickerOptions;
        }

        private _datepickerOptions: IDatepickerOptions;
        private ensureDpo() {
            if (this._datepickerOptions == null || this._datepickerOptions == undefined) {
                throw new Error('For this functionality you need 3rd-party datepicker. Please connect one using .Datepicker method');
            }
        }
        /**
         * Determines is passed object valid Date object
         * @param date 
         * @returns {} 
         */
        public isValidDate(date: Date): boolean {
            if (date === null) return true;
            if (date == undefined) return false;
            if (Object.prototype.toString.call(date) === "[object Date]") {
                if (isNaN(date.getTime())) return false;
                else return true;
            }
            return false;
        }

        /**
         * Converts jsDate object to server's understandable format
         * 
         * @param date Date object
         * @returns {string} Date in ISO 8601 format
         */
        public serialize(date?: Date) {
            if (date === null || date == undefined) return '';

            if (Object.prototype.toString.call(date) === "[object Date]") {
                if (isNaN(date.getTime())) return '';
                else return Date.prototype.toISOString.call(date);
            }
            else throw new Error(`${date} is not a date at all`);
        }

        /**
         * Parses ISO date string to regular Date object
         * 
         * @param dateString Date string containing date in ISO 8601
         * @returns {} 
         */
        public parse(dateString: string): Date {
            var date = new Date(dateString);
            if (Object.prototype.toString.call(date) === "[object Date]") {
                if (isNaN(date.getTime())) return null;
                else return date;
            }
            throw new Error(`${dateString} is not a date at all`);
        }

        /**
         * Retrieves Date object from 3rd party datepicker exposed by HTML element
         * 
         * @param element HTML element containing datepicker componen
         * @returns {Date} Date object or null
         */
        public getDateFromDatePicker(element: HTMLElement): Date {
            this.ensureDpo();
            if (!element) return null;
            var date = this._datepickerOptions.GetFromDatePicker(element);
            if (date == null) return null;
            if (Object.prototype.toString.call(date) === "[object Date]") {
                if (isNaN(date.getTime())) return null;
                else return date;
            }
            throw new Error(`${date} from datepicker is not a date at all`);
        }

        /**
         * Creates datepicker object of HTML element using configured function
         * 
         * @param element HTML element that should be converted to datepicker
         */
        public createDatePicker(element: HTMLElement, isNullableDate?: boolean): void {
            this.ensureDpo();
            if (!element) return;
            this._datepickerOptions.CreateDatePicker(element, isNullableDate);
        }

        /**
         * Passes Date object to datepicker element
         * 
         * @param element HTML element containing datepicker componen
         * @param date Date object to supply to datepicker or null
         */
        public putDateToDatePicker(element: HTMLElement, date: Date): void {
            this.ensureDpo();
            if (!element) return;
            this._datepickerOptions.PutToDatePicker(element, date);
        }
    }
}

if (!Date.prototype.toISOString) {
    (function () {
        function pad(number) {
            if (number < 10) {
                return '0' + number;
            }
            return number;
        }
        Date.prototype.toISOString = function () {
            return this.getUTCFullYear() +
                '-' + pad(this.getUTCMonth() + 1) +
                '-' + pad(this.getUTCDate()) +
                'T' + pad(this.getUTCHours()) +
                ':' + pad(this.getUTCMinutes()) +
                ':' + pad(this.getUTCSeconds()) +
                '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                'Z';
        };
    } ());
}