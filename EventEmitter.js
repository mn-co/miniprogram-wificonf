Object.defineProperty(exports, "__esModule", {
	value: !0
});

function invokeEventCallback(callback, event){
    if(callback.handleEvent) 
        callback.handleEvent(event);
    else callback(event)
}

function insertHandler(collection, type, listener){
    if(!collection[type]) collection[type] = [];

    var list = collection[type];

    if(!list.includes(listener)) list.push(listener);
}

function removeHandler(collection, type, listener){
    var list = collection[type];
    if(list){
        var index = list.indexOf(listener);
        index!==-1 && list.splice(index, 1);
    }
}


function invokeHandler(collection, type, event){
    if(!collection[type]) return;

    collection[type].forEach(function(handler){
        invokeEventCallback(handler, event);
    });
}

function EventEmitter(){
    this._destroy = false;
    this.handlers = {};
    this.onceHandlers = {};
}

Object.assign(EventEmitter.prototype, {
    destroyWarn: function(){
        if(this._destroy){
            console.warn('this event emitter instance was destroyed!!');
            return true;
        }
        return false;
    },
    addEventListener: function(type, handler){
        if(this.destroyWarn()) return;
        insertHandler(this.handlers, type.toString(), handler);
    },
    removeEventListener: function(type, handler){
        if(this.destroyWarn()) return;
        removeHandler(this.handlers, type, handler);
        removeHandler(this.onceHandlers, type, handler);
    },
    once: function(type, handler){
        if(this.destroyWarn()) return;
        insertHandler(this.onceHandlers, type, handler);
    },
    on: function(type, handler){
        if(this.destroyWarn()) return;
        this.addEventListener(type, handler);
    },
    off: function(type, handler){
        if(this.destroyWarn()) return;
        this.removeEventListener(type, handler);
    },
    trigger: function(type, event){
        if(this.destroyWarn()) return;
        invokeHandler(this.handlers, type, event);
        invokeHandler(this.onceHandlers, type, event);
    },
    destory: function(){
        this._destroy = true;
        this.handlers = this.onceHandlers = null;
    }
});

exports.EventEmitter = EventEmitter;