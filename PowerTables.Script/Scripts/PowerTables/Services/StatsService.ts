module PowerTables.Services {
    export class StatsService implements PowerTables.IStatsModel {
        constructor(master: IMasterTable) { this._master = master; }

        private _master: PowerTables.IMasterTable;

        
        public IsSetFinite(): boolean { return this._master.Partition.isAmountFinite(); }

        public Mode(): PartitionType { return this._master.Configuration.Partition.Type; }

        public ServerCount(): number { return this._master.Partition.totalAmount(); }

        public Stored(): number { return this._master.DataHolder.StoredData.length; }

        public Filtered(): number { return (!this._master.DataHolder.Filtered) ? 0 : this._master.DataHolder.Filtered.length; }

        public Displayed(): number { return (!this._master.DataHolder.DisplayedData) ? 0 : this._master.DataHolder.DisplayedData.length; }

        public Ordered(): number { return (!this._master.DataHolder.Ordered) ? 0 : this._master.DataHolder.Ordered.length; }

        public Skip(): number { return this._master.Partition.Skip; }

        public Take(): number { return this._master.Partition.Take; }

        public Pages(): number {
            if (this._master.Partition.Take === 0) return 1;
            var tp: number = this._master.Partition.amount() / this._master.Partition.Take;
            if (tp !== Math.floor(tp)) {
                tp = Math.floor(tp) + 1;
            }
            return tp;
        }

        public CurrentPage(): number {
            if (this._master.Partition.Skip + this._master.Partition.Take >= this._master.Partition.amount()) {
                return this.Pages() - 1;
            }

            if (this._master.Partition.Take === 0) return 0;
            if (this._master.Partition.Skip < this._master.Partition.Take) return 0;
            var sp = this._master.Partition.Skip / this._master.Partition.Take;
            return Math.floor(sp);
        }

        public IsAllDataLoaded(): boolean {
            if (this._master.Configuration.Partition.Type === PowerTables.PartitionType.Client) return true;

        }
    }
}