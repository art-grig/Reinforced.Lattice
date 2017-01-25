module PowerTables {
    export class Q {
        public static contains<T>(arr: T[], element: T) : boolean {
            return arr.indexOf(element) >= 0;
        }
    }
}