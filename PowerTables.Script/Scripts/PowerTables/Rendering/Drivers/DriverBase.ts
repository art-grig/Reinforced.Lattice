module PowerTables.Rendering.Drivers {
    export class DriverBase {
        public track(w: IWriteFn) { throw Error('Method track must be implemented'); }
    }
}