module PowerTables {
    export class Dependency {
        constructor() {
            this._instances['_container'] = {
                Instance: this,
                Requirements: {},
                Satisficator: '_container'
            };
        }

        private static _requirers: Function[] = [];
        private static _requirements: { [_: string]: any }[] = [];
        private _instances: { [_: string]: IInstanceInfo } = {};

        public static requires(classFunction: Function, requirements: { [_: string]: any }) {
            this._requirers.push(classFunction);
            this._requirements.push(requirements);
        }

        private instanceId(classFunction: any,create:boolean = true): string {
            if (typeof classFunction == "function") {
                var idx = Dependency._requirers.indexOf(classFunction);
                if (idx < 0) {
                    if (create) {
                        Dependency.requires(classFunction, {});
                        return Dependency._requirers.length.toString();
                    } else {
                        return null;
                    }
                } else {
                    return idx.toString();
                }
            }
            return classFunction.toString();
        }

        public createInstance(classFunction: Function, instance: any) {
            if (instance == null || instance == undefined) throw new Error("Cannot register undefined instance");
            var id = this.instanceId(classFunction);
            var requirements = Dependency._requirements[parseInt(id)];
            this._instances[id] = {
                Instance: instance,
                Requirements: requirements,
                Satisficator: classFunction
            };

            this.provide(classFunction, this._instances[id]);
            this.buildUp(instance,requirements);
        }

        private buildUp(instance: any, requirements: { [_: string]: any }) {
            for (var k in requirements) {
                var rq = this.instanceId(requirements[k],false);
                if (rq != null) {
                    instance[k] = this._instances[rq].Instance;
                }
            }
        }

        private provide(requirement: any, instance: IInstanceInfo) {
            for (var k in this._instances) {
                var target = this._instances[k].Instance;

                for (var rk in this._instances[k].Requirements) {
                    var req = this._instances[k].Requirements[rk];
                    if (req === requirement) {
                        target[rk] = instance.Instance;
                    }
                }
            }
        }

        public createNamedInstance(name: string, instance: any) {
            if (instance == null || instance == undefined) instance = null;
            this._instances[name] = {
                Instance: instance,
                Satisficator: name,
                Requirements: {}
            };
            this.provide(name, this._instances[name]);
        }

        public resolve(classFunction: any): any {
            var id = this.instanceId(classFunction, false);
            if (!id) throw new Error(`Instance of ${classFunction} is not registered as dependency`);
            if (this._instances.hasOwnProperty(id)) {
                return this._instances[id];
            }
            var dep = this;
            var _ = function () { this.constructor = classFunction; };
            _.prototype = classFunction.prototype;

            var fn = function() {
                dep.createInstance(classFunction, this);
                classFunction.call(this);
            }
            fn.prototype = new _();
            var instance = new fn();

            var ret = classFunction.toString();
            ret = ret.substr('function '.length);
            ret = ret.substr(0, ret.indexOf('('));
            instance.__dependencyOf = ret;
            this._instances[id] = instance;
            return instance;
        }

    }

    interface IInstanceInfo {
        Instance: any;
        Requirements: { [_: string]: any };
        Satisficator: any;
    }


    
} 