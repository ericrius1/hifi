print('KINETIC INCLUDING WRAPPER')

var BOOKS_URL = 'atp:/JSON/books.json';
var UPPER_BOOKSHELF_URL = 'atp:/JSON/upperBookShelf.json';
var LOWER_BOOKSHELF_URL = 'atp:/JSON/lowerBookShelf.json';
var RIGHT_DESK_DRAWER_URL = 'http://hifi-content.s3.amazonaws.com/DomainContent/Home/kineticObjects/rightDeskDrawer.json' + "?" + Math.random();
var LEFT_DESK_DRAWER_URL = 'http://hifi-content.s3.amazonaws.com/DomainContent/Home/kineticObjects/leftDeskDrawer.json' + "?" + Math.random();
var CHAIR_URL = 'atp:/JSON/chair.json';
var DESK_DRAWERS_URL = 'http://hifi-content.s3.amazonaws.com/DomainContent/Home/kineticObjects/deskDrawers.json' + "?" + Math.random();
var FRUIT_BOWL_URL = 'atp:/JSON/fruit.json';
var LAB_LAMP_URL = 'http://hifi-content.s3.amazonaws.com/DomainContent/Home/kineticObjects/deskLamp.json' + "?" + Math.random();
var LIVING_ROOM_LAMP_URL = 'atp:/JSON/deskLamp.json';
var TRASHCAN_URL = 'atp:/JSON/trashcan.json'; 
var BLOCKS_URL = 'http://hifi-content.s3.amazonaws.com/DomainContent/Home/kineticObjects/blocks.json' + "?" + Math.random();
var PLAYA_POSTER_URL = 'atp:/JSON/postersPlaya.json';
var CELL_POSTER_URL = 'atp:/JSON/postersCell.json';

FruitBowl = function(spawnLocation, spawnRotation) {
    print('CREATE FRUIT BOWL')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(FRUIT_BOWL_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;

}

LabLamp = function(spawnLocation, spawnRotation) {

    print('CREATE LAB LAMP')


    var created = [];

    function create() {
        var success = Clipboard.importEntities(LAB_LAMP_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

LivingRoomLamp = function(spawnLocation, spawnRotation) {
    print('CREATE LIVING ROOM LAMP')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(LIVING_ROOM_LAMP_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

UpperBookShelf = function(spawnLocation, spawnRotation) {
    print('CREATE UPPER SHELF')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(UPPER_BOOKSHELF_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}


LowerBookShelf = function(spawnLocation, spawnRotation) {
    print('CREATE LOWER SHELF')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(LOWER_BOOKSHELF_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

RightDeskDrawer = function(spawnLocation, spawnRotation) {
    print('CREATE RIGHT DRAWER')

    var created = [];

    function create() {
        var success = Clipboard.importEntities(RIGHT_DESK_DRAWER_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

LeftDeskDrawer = function(spawnLocation, spawnRotation) {
    print('CREATE LEFT DRAWER')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(LEFT_DESK_DRAWER_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

Chair = function(spawnLocation, spawnRotation) {
    print('CREATE CHAIR')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(CHAIR_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

Trashcan = function(spawnLocation, spawnRotation) {
    print('CREATE TRASHCAN')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(TRASHCAN_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;

}

Books = function(spawnLocation, spawnRotation) {
    print('CREATE BOOKS')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(BOOKS_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

Blocks = function(spawnLocation, spawnRotation) {
    print('CREATE BLOCKS')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(BLOCKS_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;

}

PosterCell = function(spawnLocation, spawnRotation) {
    print('CREATE CELL POSTER')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(CELL_POSTER_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}

PosterPlaya = function(spawnLocation, spawnRotation) {
    print('CREATE PLAYA POSTER')
    var created = [];

    function create() {
        var success = Clipboard.importEntities(PLAYA_POSTER_URL);
        if (success === true) {
            created = Clipboard.pasteEntities(spawnLocation)
            print('created ' + created);
        }
    };

    function cleanup() {
        created.forEach(function(obj) {
            Entities.deleteEntity(obj);
        })
    };

    create();

    this.cleanup = cleanup;
}