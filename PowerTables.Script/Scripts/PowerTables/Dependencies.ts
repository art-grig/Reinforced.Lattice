module PowerTables {
    var Configuration = 'Configuration';
    var Master = 'Master';

    Dependency.requires(InstanceManagerService,
    {
        'Configuration': Configuration,
        '_events': PowerTables.EventsService,
        '_masterTable': Master
    });

    Dependency.requires(EventsService,
    {
        '_masterTable': Master
    });

    Dependency.requires(DataHolderService,
    {
        '_events': PowerTables.EventsService,
        '_instances': PowerTables.InstanceManagerService,
        '_date': PowerTables.DateService
    });

    Dependency.requires(DateService, {
        '_datepickerOptions': 'DatepickerOptions'
    });
}
