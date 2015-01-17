/// <reference path="avm2.d.ts" />
/// <reference path="swf.d.ts" />
/// <reference path="../../src/flash/avm1.d.ts" />
declare module Shumway {
    interface HTMLParserHandler {
        comment?: (text: string) => void;
        chars?: (text: string) => void;
        start?: (tag: string, attrs: any, unary: boolean) => void;
        end?: (tag: string) => void;
    }
    function HTMLParser(html: string, handler: HTMLParserHandler): void;
}
declare module Shumway {
    import Bounds = Shumway.Bounds;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import flash = Shumway.AVM2.AS.flash;
    enum TextContentFlags {
        None = 0,
        DirtyBounds = 1,
        DirtyContent = 2,
        DirtyStyle = 4,
        DirtyFlow = 8,
        Dirty,
    }
    class TextContent implements Remoting.IRemotable {
        _id: number;
        private _bounds;
        private _plainText;
        private _backgroundColor;
        private _borderColor;
        private _autoSize;
        private _wordWrap;
        private _scrollV;
        private _scrollH;
        flags: number;
        defaultTextFormat: flash.text.TextFormat;
        textRuns: flash.text.TextRun[];
        textRunData: DataBuffer;
        matrix: flash.geom.Matrix;
        coords: number[];
        constructor(defaultTextFormat?: flash.text.TextFormat);
        parseHtml(htmlText: string, multiline?: boolean): void;
        plainText: string;
        bounds: Bounds;
        autoSize: number;
        wordWrap: boolean;
        scrollV: number;
        scrollH: number;
        backgroundColor: number;
        borderColor: number;
        private _serializeTextRuns();
        private _writeTextRun(textRun);
        appendText(newText: string, format?: flash.text.TextFormat): void;
        prependText(newText: string, format?: flash.text.TextFormat): void;
        replaceText(beginIndex: number, endIndex: number, newText: string, format?: flash.text.TextFormat): void;
    }
}
declare module Shumway.AVM2.AS {
    var flashOptions: any;
    var traceLoaderOption: any;
    var disableAudioOption: any;
    var webAudioOption: any;
    var webAudioMP3Option: any;
    var mediaSourceOption: any;
    var mediaSourceMP3Option: any;
}
declare module Shumway.Timeline {
    import Bounds = Shumway.Bounds;
    interface IAssetResolver {
        registerFontOrImage(symbol: EagerlyResolvedSymbol, data: any): void;
    }
    interface EagerlyResolvedSymbol {
        syncId: number;
        id: number;
        ready: boolean;
        resolveAssetPromise: PromiseWrapper<any>;
        resolveAssetCallback: (data: any) => void;
    }
    interface SymbolData {
        id: number;
        className: string;
    }
    class Symbol {
        ready: boolean;
        resolveAssetPromise: PromiseWrapper<any>;
        data: any;
        isAVM1Object: boolean;
        avm1Context: AVM1.AVM1Context;
        symbolClass: ASClass;
        constructor(data: SymbolData, symbolDefaultClass: ASClass);
        id: number;
    }
    class DisplaySymbol extends Symbol {
        fillBounds: Bounds;
        lineBounds: Bounds;
        scale9Grid: Bounds;
        dynamic: boolean;
        constructor(data: SymbolData, symbolClass: ASClass, dynamic: boolean);
        _setBoundsFromData(data: any): void;
    }
    class BinarySymbol extends Symbol {
        buffer: Uint8Array;
        byteLength: number;
        constructor(data: SymbolData);
        static FromData(data: any): BinarySymbol;
    }
    class SoundStart {
        soundId: number;
        soundInfo: any;
        constructor(soundId: number, soundInfo: any);
    }
}
declare module Shumway.AVM2.AS.flash.geom {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import Bounds = Shumway.Bounds;
    class Matrix extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number);
        static FromUntyped(object: any): Matrix;
        static FromDataBuffer(input: DataBuffer): Matrix;
        static FROZEN_IDENTITY_MATRIX: Matrix;
        static TEMP_MATRIX: Matrix;
        _data: Float64Array;
        a: number;
        b: number;
        c: number;
        d: number;
        tx: number;
        ty: number;
        concat(other: Matrix): void;
        preMultiply(other: Matrix): void;
        preMultiplyInto(other: Matrix, target: Matrix): void;
        invert(): void;
        invertInto(target: Matrix): void;
        identity(): void;
        createBox(scaleX: number, scaleY: number, rotation?: number, tx?: number, ty?: number): void;
        createGradientBox(width: number, height: number, rotation?: number, tx?: number, ty?: number): void;
        rotate(angle: number): void;
        translate(dx: number, dy: number): void;
        scale(sx: number, sy: number): void;
        deltaTransformPoint(point: Point): Point;
        transformX(x: number, y: number): number;
        transformY(x: number, y: number): number;
        transformPoint(point: Point): Point;
        transformPointInPlace(point: any): Point;
        transformBounds(bounds: Bounds): void;
        getDeterminant(): number;
        getScaleX(): number;
        getScaleY(): number;
        getAbsoluteScaleX(): number;
        getAbsoluteScaleY(): number;
        getSkewX(): number;
        getSkewY(): number;
        copyFrom(other: Matrix): void;
        copyFromUntyped(object: any): void;
        setTo(a: number, b: number, c: number, d: number, tx: number, ty: number): void;
        toTwipsInPlace(): Matrix;
        toPixelsInPlace(): Matrix;
        copyRowTo(row: number, vector3D: Vector3D): void;
        copyColumnTo(column: number, vector3D: Vector3D): void;
        copyRowFrom(row: number, vector3D: Vector3D): void;
        copyColumnFrom(column: number, vector3D: Vector3D): void;
        updateScaleAndRotation(scaleX: number, scaleY: number, skewX: number, skewY: number): void;
        clone(): Matrix;
        equals(other: Matrix): boolean;
        toString(): string;
        writeExternal(output: DataBuffer): void;
    }
}
declare module Shumway.AVM2.AS.flash.geom {
    class Matrix3D extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        _matrix: Float32Array;
        constructor(v?: any);
        static interpolate(thisMat: Matrix3D, toMat: Matrix3D, percent: number): Matrix3D;
        rawData: any;
        position: Vector3D;
        determinant: number;
        clone(): Matrix3D;
        copyToMatrix3D(dest: Matrix3D): void;
        append(lhs: Matrix3D): void;
        prepend(rhs: Matrix3D): void;
        invert(): boolean;
        identity(): void;
        decompose(orientationStyle?: string): ASVector<any>;
        recompose(components: ASVector<any>, orientationStyle?: string): boolean;
        appendTranslation(x: number, y: number, z: number): void;
        appendRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D): void;
        appendScale(xScale: number, yScale: number, zScale: number): void;
        prependTranslation(x: number, y: number, z: number): void;
        prependRotation(degrees: number, axis: Vector3D, pivotPoint?: Vector3D): void;
        prependScale(xScale: number, yScale: number, zScale: number): void;
        transformVector(v: Vector3D): Vector3D;
        deltaTransformVector(v: Vector3D): Vector3D;
        transformVectors(vin: any, vout: any): void;
        transpose(): void;
        pointAt(pos: Vector3D, at?: Vector3D, up?: Vector3D): void;
        interpolateTo(toMat: Matrix3D, percent: number): void;
        copyFrom(sourceMatrix3D: Matrix3D): void;
        copyRawDataTo(vector: any, index?: number, transpose?: boolean): void;
        copyRawDataFrom(vector: ASVector<any>, index?: number, transpose?: boolean): void;
        copyRowTo(row: number, vector3D: Vector3D): void;
        copyColumnTo(column: number, vector3D: Vector3D): void;
        copyRowFrom(row: number, vector3D: Vector3D): void;
        copyColumnFrom(column: number, vector3D: Vector3D): void;
    }
}
declare module Shumway.AVM2.AS.flash.geom {
    class Orientation3D extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static EULER_ANGLES: string;
        static AXIS_ANGLE: string;
        static QUATERNION: string;
    }
}
declare module Shumway.AVM2.AS.flash.geom {
    class PerspectiveProjection extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        fieldOfView: number;
        projectionCenter: Point;
        focalLength: number;
        toMatrix3D(): Matrix3D;
    }
}
declare module Shumway.AVM2.AS.flash.geom {
    class Point extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(x?: number, y?: number);
        x: number;
        y: number;
        native_x: number;
        native_y: number;
        Point(x?: number, y?: number): void;
        length: number;
        static interpolate(p1: Point, p2: Point, f: number): Point;
        static distance(p1: Point, p2: Point): number;
        static polar(length: number, angle: number): Point;
        clone(): Point;
        offset(dx: number, dy: number): void;
        equals(toCompare: Point): Boolean;
        subtract(v: Point): Point;
        add(v: Point): Point;
        normalize(thickness: number): void;
        copyFrom(sourcePoint: Point): void;
        setTo(x: number, y: number): void;
        toTwips(): Point;
        toPixels(): Point;
        round(): Point;
        toString(): string;
    }
}
declare module Shumway.AVM2.AS.flash.geom {
    import Bounds = Shumway.Bounds;
    class Rectangle extends ASNative implements utils.IExternalizable {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        x: number;
        y: number;
        width: number;
        height: number;
        constructor(x?: number, y?: number, width?: number, height?: number);
        static FromBounds(bounds: Bounds): Rectangle;
        native_x: number;
        native_y: number;
        native_width: number;
        native_height: number;
        left: number;
        right: number;
        top: number;
        bottom: number;
        topLeft: Point;
        bottomRight: Point;
        size: Point;
        area: number;
        clone(): Rectangle;
        isEmpty(): boolean;
        setEmpty(): void;
        inflate(dx: number, dy: number): void;
        inflatePoint(point: Point): void;
        offset(dx: number, dy: number): void;
        offsetPoint(point: Point): void;
        contains(x: number, y: number): boolean;
        containsPoint(point: Point): boolean;
        containsRect(rect: Rectangle): boolean;
        intersection(toIntersect: Rectangle): Rectangle;
        intersects(toIntersect: Rectangle): boolean;
        intersectInPlace(clipRect: Rectangle): Rectangle;
        intersectInPlaceInt32(clipRect: Rectangle): Rectangle;
        union(toUnion: Rectangle): Rectangle;
        unionInPlace(toUnion: Rectangle): Rectangle;
        equals(toCompare: Rectangle): boolean;
        copyFrom(sourceRect: Rectangle): void;
        setTo(x: number, y: number, width: number, height: number): void;
        toTwips(): Rectangle;
        getBaseWidth(angle: number): number;
        getBaseHeight(angle: number): number;
        toPixels(): Rectangle;
        snapInPlace(): Rectangle;
        roundInPlace(): Rectangle;
        toString(): string;
        writeExternal(output: utils.IDataOutput): void;
        readExternal(input: utils.IDataInput): void;
    }
}
declare module Shumway.AVM2.AS.flash.geom {
    class Transform extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        private _displayObject;
        constructor(displayObject: display.DisplayObject);
        matrix: Matrix;
        colorTransform: ColorTransform;
        concatenatedMatrix: Matrix;
        concatenatedColorTransform: ColorTransform;
        pixelBounds: Rectangle;
        matrix3D: Matrix3D;
        getRelativeMatrix3D(relativeTo: display.DisplayObject): Matrix3D;
        perspectiveProjection: PerspectiveProjection;
    }
}
declare module Shumway.AVM2.AS.flash.geom {
    class Utils3D extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static projectVector(m: Matrix3D, v: Vector3D): Vector3D;
        static projectVectors(m: Matrix3D, verts: ASVector<any>, projectedVerts: ASVector<any>, uvts: ASVector<any>): void;
        static pointTowards(percent: number, mat: Matrix3D, pos: Vector3D, at?: Vector3D, up?: Vector3D): Matrix3D;
    }
}
declare module Shumway.AVM2.AS.flash.geom {
    class Vector3D extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static X_AXIS: Vector3D;
        static Y_AXIS: Vector3D;
        static Z_AXIS: Vector3D;
        constructor(x?: number, y?: number, z?: number, w?: number);
        x: number;
        y: number;
        z: number;
        w: number;
        native_x: number;
        native_y: number;
        native_z: number;
        native_w: number;
        length: number;
        lengthSquared: number;
        static angleBetween(a: Vector3D, b: Vector3D): number;
        static distance(pt1: Vector3D, pt2: Vector3D): number;
        dotProduct(a: Vector3D): number;
        crossProduct(a: Vector3D): Vector3D;
        normalize(): number;
        scaleBy(s: number): void;
        incrementBy(a: Vector3D): void;
        decrementBy(a: Vector3D): void;
        add(a: Vector3D): Vector3D;
        subtract(a: Vector3D): Vector3D;
        negate(): void;
        equals(toCompare: Vector3D, allFour?: boolean): boolean;
        nearEquals(toCompare: Vector3D, tolerance: number, allFour?: boolean): boolean;
        project(): void;
        copyFrom(sourceVector3D: Vector3D): void;
        setTo(xa: number, ya: number, za: number): void;
        clone(): Vector3D;
        toString(): string;
    }
}
declare module Shumway.AVM2.AS.flash.accessibility {
    class Accessibility extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        private static _active;
        static active: boolean;
        static sendEvent(source: display.DisplayObject, childID: number, eventType: number, nonHTML?: boolean): void;
        static updateProperties(): void;
    }
}
declare module Shumway.AVM2.AS.flash.accessibility {
    class AccessibilityImplementation extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        stub: boolean;
        errno: number;
        get_accRole: (childID: number) => number;
        get_accName: (childID: number) => string;
        get_accValue: (childID: number) => string;
        get_accState: (childID: number) => number;
        get_accDefaultAction: (childID: number) => string;
        accDoDefaultAction: (childID: number) => void;
        isLabeledBy: (labelBounds: geom.Rectangle) => boolean;
        getChildIDArray: () => any[];
        accLocation: (childID: number) => any;
        get_accSelection: () => any[];
        get_accFocus: () => number;
        accSelect: (operation: number, childID: number) => void;
        get_selectionAnchorIndex: () => any;
        get_selectionActiveIndex: () => any;
    }
}
declare module Shumway.AVM2.AS.flash.accessibility {
    class AccessibilityProperties extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        name: string;
        description: string;
        shortcut: string;
        silent: boolean;
        forceSimple: boolean;
        noAutoLabeling: boolean;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class Event extends ASNative {
        static _instances: Map<Event>;
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static getInstance(type: string, bubbles?: boolean, cancelable?: boolean): Event;
        static getBroadcastInstance(type: string, bubbles?: boolean, cancelable?: boolean): Event;
        static isBroadcastEventType(type: string): boolean;
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        static ACTIVATE: string;
        static ADDED: string;
        static ADDED_TO_STAGE: string;
        static CANCEL: string;
        static CHANGE: string;
        static CLEAR: string;
        static CLOSE: string;
        static COMPLETE: string;
        static CONNECT: string;
        static COPY: string;
        static CUT: string;
        static DEACTIVATE: string;
        static ENTER_FRAME: string;
        static FRAME_CONSTRUCTED: string;
        static EXIT_FRAME: string;
        static FRAME_LABEL: string;
        static ID3: string;
        static INIT: string;
        static MOUSE_LEAVE: string;
        static OPEN: string;
        static PASTE: string;
        static REMOVED: string;
        static REMOVED_FROM_STAGE: string;
        static RENDER: string;
        static RESIZE: string;
        static SCROLL: string;
        static TEXT_INTERACTION_MODE_CHANGE: string;
        static SELECT: string;
        static SELECT_ALL: string;
        static SOUND_COMPLETE: string;
        static TAB_CHILDREN_CHANGE: string;
        static TAB_ENABLED_CHANGE: string;
        static TAB_INDEX_CHANGE: string;
        static UNLOAD: string;
        static FULLSCREEN: string;
        static CONTEXT3D_CREATE: string;
        static TEXTURE_READY: string;
        static VIDEO_FRAME: string;
        static SUSPEND: string;
        static AVM1_INIT: string;
        static AVM1_CONSTRUCT: string;
        static AVM1_LOAD: string;
        _type: string;
        _bubbles: boolean;
        _cancelable: boolean;
        _target: Object;
        _currentTarget: Object;
        _eventPhase: number;
        _stopPropagation: boolean;
        _stopImmediatePropagation: boolean;
        _isDefaultPrevented: boolean;
        private _isBroadcastEvent;
        type: string;
        bubbles: boolean;
        cancelable: boolean;
        target: Object;
        currentTarget: Object;
        eventPhase: number;
        stopPropagation(): void;
        stopImmediatePropagation(): void;
        preventDefault(): void;
        isDefaultPrevented(): boolean;
        isBroadcastEvent(): boolean;
        clone(): Event;
        toString(): string;
        formatToString(className: string, ...args: string[]): string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class BroadcastEventDispatchQueue {
        private _queues;
        constructor();
        reset(): void;
        add(type: string, target: EventDispatcher): void;
        remove(type: string, target: EventDispatcher): void;
        dispatchEvent(event: Event): void;
        getQueueLength(type: string): number;
    }
    class EventDispatcher extends ASNative implements IEventDispatcher {
        static broadcastEventDispatchQueue: BroadcastEventDispatchQueue;
        static classInitializer: any;
        private _target;
        private _captureListeners;
        private _targetOrBubblingListeners;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(target?: IEventDispatcher);
        private _getListenersForType(useCapture, type);
        private _getListeners(useCapture);
        addEventListener(type: string, listener: EventHandler, useCapture?: boolean, priority?: number, useWeakReference?: boolean): void;
        removeEventListener(type: string, listener: EventHandler, useCapture?: boolean): void;
        private _hasTargetOrBubblingEventListener(type);
        private _hasCaptureEventListener(type);
        private _hasEventListener(type);
        hasEventListener(type: string): boolean;
        willTrigger(type: string): boolean;
        private _skipDispatchEvent(event);
        dispatchEvent(event: Event): boolean;
        private static callListeners(list, event, target, currentTarget, eventPhase);
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class EventPhase extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static CAPTURING_PHASE: number;
        static AT_TARGET: number;
        static BUBBLING_PHASE: number;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class TextEvent extends Event {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string);
        static LINK: string;
        static TEXT_INPUT: string;
        copyNativeData(event: TextEvent): void;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class ErrorEvent extends TextEvent {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string, id?: number);
        static ERROR: string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class GameInputEvent extends Event {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, device?: ui.GameInputDevice);
        static DEVICE_ADDED: string;
        static DEVICE_REMOVED: string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class GestureEvent extends Event {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, phase?: string, localX?: number, localY?: number, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean);
        static GESTURE_TWO_FINGER_TAP: string;
        private _phase;
        private _localX;
        private _localY;
        private _ctrlKey;
        private _altKey;
        private _shiftKey;
        localX: number;
        localY: number;
        stageX: number;
        stageY: number;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
        phase: string;
        updateAfterEvent(): void;
        NativeCtor(phase: string, localX: number, localY: number, ctrlKey: boolean, altKey: boolean, shiftKey: boolean): void;
        clone(): Event;
        toString(): string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class HTTPStatusEvent extends Event {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, status?: number);
        static HTTP_STATUS: string;
        static HTTP_RESPONSE_STATUS: string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    interface EventHandler {
        (event: Event): void;
    }
    interface IEventDispatcher {
        addEventListener: (type: string, listener: EventHandler, useCapture?: boolean, priority?: number, useWeakReference?: boolean) => void;
        removeEventListener: (type: string, listener: EventHandler, useCapture?: boolean) => void;
        hasEventListener: (type: string) => boolean;
        willTrigger: (type: string) => boolean;
        dispatchEvent: (event: Event) => boolean;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class IOErrorEvent extends ErrorEvent {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string, id?: number);
        static IO_ERROR: string;
        static NETWORK_ERROR: string;
        static DISK_ERROR: string;
        static VERIFY_ERROR: string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class KeyboardEvent extends Event {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, charCodeValue?: number, keyCodeValue?: number, keyLocationValue?: number, ctrlKeyValue?: boolean, altKeyValue?: boolean, shiftKeyValue?: boolean);
        static KEY_DOWN: string;
        static KEY_UP: string;
        updateAfterEvent(): void;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class MouseEvent extends Event {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, localX?: number, localY?: number, relatedObject?: display.InteractiveObject, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean, buttonDown?: boolean, delta?: number);
        static CLICK: string;
        static DOUBLE_CLICK: string;
        static MOUSE_DOWN: string;
        static MOUSE_MOVE: string;
        static MOUSE_OUT: string;
        static MOUSE_OVER: string;
        static MOUSE_UP: string;
        static RELEASE_OUTSIDE: string;
        static MOUSE_WHEEL: string;
        static ROLL_OUT: string;
        static ROLL_OVER: string;
        static MIDDLE_CLICK: string;
        static MIDDLE_MOUSE_DOWN: string;
        static MIDDLE_MOUSE_UP: string;
        static RIGHT_CLICK: string;
        static RIGHT_MOUSE_DOWN: string;
        static RIGHT_MOUSE_UP: string;
        static CONTEXT_MENU: string;
        static typeFromDOMType(name: string): string;
        private _localX;
        private _localY;
        private _movementX;
        private _movementY;
        private _delta;
        private _position;
        private _ctrlKey;
        private _altKey;
        private _shiftKey;
        private _buttonDown;
        private _relatedObject;
        private _isRelatedObjectInaccessible;
        localX: number;
        localY: number;
        stageX: Number;
        stageY: Number;
        movementX: number;
        movementY: number;
        delta: number;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
        buttonDown: boolean;
        relatedObject: display.InteractiveObject;
        isRelatedObjectInaccessible: boolean;
        updateAfterEvent(): void;
        private _getGlobalPoint();
        clone(): Event;
        toString(): string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class NetStatusEvent extends Event {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, info?: Object);
        private _info;
        info: Object;
        static NET_STATUS: string;
        clone(): Event;
        toString(): string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class ProgressEvent extends Event {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, bytesLoaded?: number, bytesTotal?: number);
        static PROGRESS: string;
        static SOCKET_DATA: string;
        private _bytesLoaded;
        private _bytesTotal;
        bytesLoaded: number;
        bytesTotal: number;
        clone(): Event;
        toString(): string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class SecurityErrorEvent extends ErrorEvent {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, text?: string, id?: number);
        static SECURITY_ERROR: string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class TimerEvent extends Event {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean);
        static TIMER: string;
        static TIMER_COMPLETE: string;
        updateAfterEvent(): void;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class TouchEvent extends Event {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type: string, bubbles?: boolean, cancelable?: boolean, touchPointID?: number, isPrimaryTouchPoint?: boolean, localX?: number, localY?: number, sizeX?: number, sizeY?: number, pressure?: number, relatedObject?: display.InteractiveObject, ctrlKey?: boolean, altKey?: boolean, shiftKey?: boolean);
        static TOUCH_BEGIN: string;
        static TOUCH_END: string;
        static TOUCH_MOVE: string;
        static TOUCH_OVER: string;
        static TOUCH_OUT: string;
        static TOUCH_ROLL_OVER: string;
        static TOUCH_ROLL_OUT: string;
        static TOUCH_TAP: string;
        static PROXIMITY_BEGIN: string;
        static PROXIMITY_END: string;
        static PROXIMITY_MOVE: string;
        static PROXIMITY_OUT: string;
        static PROXIMITY_OVER: string;
        static PROXIMITY_ROLL_OUT: string;
        static PROXIMITY_ROLL_OVER: string;
        updateAfterEvent(): void;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class UncaughtErrorEvent extends ErrorEvent {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type?: string, bubbles?: boolean, cancelable?: boolean, error_in?: any);
        static UNCAUGHT_ERROR: string;
    }
}
declare module Shumway.AVM2.AS.flash.events {
    class UncaughtErrorEvents extends EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
    }
}
declare module Shumway.AVM2.AS.flash.display {
    import Bounds = Shumway.Bounds;
    import geom = flash.geom;
    import events = flash.events;
    enum DisplayObjectFlags {
        None = 0,
        Visible = 1,
        InvalidLineBounds = 2,
        InvalidFillBounds = 4,
        InvalidMatrix = 8,
        InvalidInvertedMatrix = 16,
        InvalidConcatenatedMatrix = 32,
        InvalidInvertedConcatenatedMatrix = 64,
        InvalidConcatenatedColorTransform = 128,
        Constructed = 256,
        Destroyed = 512,
        NeedsLoadEvent = 1024,
        OwnedByTimeline = 2048,
        AnimatedByTimeline = 4096,
        HasFrameScriptPending = 8192,
        ContainsFrameScriptPendingChildren = 16384,
        ContainsMorph = 32768,
        CacheAsBitmap = 65536,
        DirtyMatrix = 1048576,
        DirtyChildren = 2097152,
        DirtyGraphics = 4194304,
        DirtyTextContent = 8388608,
        DirtyBitmapData = 16777216,
        DirtyNetStream = 33554432,
        DirtyColorTransform = 67108864,
        DirtyMask = 134217728,
        DirtyClipDepth = 268435456,
        DirtyDescendents = 536870912,
        DirtyMiscellaneousProperties = 1073741824,
        Dirty,
        Bubbling,
    }
    enum VisitorFlags {
        None = 0,
        Continue = 0,
        Stop = 1,
        Skip = 2,
        FrontToBack = 8,
        Filter = 16,
    }
    enum HitTestingType {
        HitTestBounds = 0,
        HitTestBoundsAndMask = 1,
        HitTestShape = 2,
        Mouse = 3,
        ObjectsUnderPoint = 4,
        Drop = 5,
    }
    enum HitTestingResult {
        None = 0,
        Bounds = 1,
        Shape = 2,
    }
    interface IAdvancable extends IReferenceCountable {
        _initFrame(advance: boolean): void;
        _constructFrame(): void;
    }
    class DisplayObject extends events.EventDispatcher implements IBitmapDrawable, Remoting.IRemotable {
        static _syncID: number;
        static getNextSyncID(): number;
        static _instanceID: number;
        static _advancableInstances: WeakList<IAdvancable>;
        static classInitializer: any;
        static reset(): void;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        createAnimatedDisplayObject(symbol: Timeline.DisplaySymbol, placeObjectTag: SWF.PlaceObjectTag, callConstructor: boolean): DisplayObject;
        private static _runScripts;
        static _stage: Stage;
        static performFrameNavigation(mainLoop: boolean, runScripts: boolean): void;
        static _broadcastFrameEvent(type: string): void;
        constructor();
        _setInitialName(): void;
        _setParent(parent: DisplayObjectContainer, depth: number): void;
        _setDepth(value: number): void;
        _setFillAndLineBoundsFromWidthAndHeight(width: number, height: number): void;
        _setFillAndLineBoundsFromSymbol(symbol: Timeline.DisplaySymbol): void;
        _setFlags(flags: DisplayObjectFlags): void;
        _setDirtyFlags(flags: DisplayObjectFlags): void;
        _toggleFlags(flags: DisplayObjectFlags, on: boolean): void;
        _removeFlags(flags: DisplayObjectFlags): void;
        _hasFlags(flags: DisplayObjectFlags): boolean;
        _hasAnyFlags(flags: DisplayObjectFlags): boolean;
        _propagateFlagsUp(flags: DisplayObjectFlags): void;
        _propagateFlagsDown(flags: DisplayObjectFlags): void;
        _id: number;
        private _displayObjectFlags;
        _root: DisplayObject;
        _stage: Stage;
        _name: string;
        _parent: DisplayObjectContainer;
        _mask: DisplayObject;
        _scaleX: number;
        _scaleY: number;
        _skewX: number;
        _skewY: number;
        _z: number;
        _scaleZ: number;
        _rotation: number;
        _rotationX: number;
        _rotationY: number;
        _rotationZ: number;
        _mouseX: number;
        _mouseY: number;
        _width: number;
        _height: number;
        _opaqueBackground: ASObject;
        _scrollRect: geom.Rectangle;
        _filters: any[];
        _blendMode: string;
        _scale9Grid: Bounds;
        _loaderInfo: LoaderInfo;
        _accessibilityProperties: accessibility.AccessibilityProperties;
        _fillBounds: Bounds;
        _lineBounds: Bounds;
        _clipDepth: number;
        _matrix: geom.Matrix;
        _invertedMatrix: geom.Matrix;
        _concatenatedMatrix: geom.Matrix;
        _invertedConcatenatedMatrix: geom.Matrix;
        _colorTransform: geom.ColorTransform;
        _concatenatedColorTransform: geom.ColorTransform;
        _matrix3D: geom.Matrix3D;
        _depth: number;
        _ratio: number;
        _index: number;
        _isContainer: boolean;
        _maskedObject: DisplayObject;
        _mouseOver: boolean;
        _mouseDown: boolean;
        _symbol: Timeline.Symbol;
        _graphics: Graphics;
        _children: DisplayObject[];
        _referenceCount: number;
        private _findNearestAncestor(flags, on);
        _findFurthestAncestorOrSelf(): DisplayObject;
        _isAncestor(child: DisplayObject): boolean;
        private static _clampRotation(value);
        private static _path;
        private static _getAncestors(node, last);
        _getConcatenatedMatrix(): geom.Matrix;
        _getInvertedConcatenatedMatrix(): geom.Matrix;
        _setMatrix(matrix: geom.Matrix, toTwips: boolean): void;
        _getMatrix(): geom.Matrix;
        _getInvertedMatrix(): geom.Matrix;
        _getConcatenatedColorTransform(): geom.ColorTransform;
        _setColorTransform(colorTransform: geom.ColorTransform): void;
        _invalidateFillAndLineBounds(fill: boolean, line: boolean): void;
        _invalidateParentFillAndLineBounds(fill: boolean, line: boolean): void;
        _getContentBounds(includeStrokes?: boolean): Bounds;
        _getChildBounds(bounds: Bounds, includeStrokes: boolean): void;
        _getTransformedBounds(targetCoordinateSpace: DisplayObject, includeStroke: boolean): Bounds;
        private _stopTimelineAnimation();
        private _invalidateMatrix();
        _invalidatePosition(): void;
        _animate(placeObjectTag: SWF.PlaceObjectTag): void;
        _propagateEvent(event: events.Event): void;
        x: number;
        y: number;
        scaleX: number;
        scaleY: number;
        scaleZ: number;
        rotation: number;
        rotationX: number;
        rotationY: number;
        rotationZ: number;
        width: number;
        height: number;
        mask: DisplayObject;
        transform: geom.Transform;
        private destroy();
        root: DisplayObject;
        stage: Stage;
        name: string;
        parent: DisplayObjectContainer;
        visible: boolean;
        alpha: number;
        blendMode: string;
        scale9Grid: geom.Rectangle;
        cacheAsBitmap: boolean;
        filters: filters.BitmapFilter[];
        z: number;
        getBounds(targetCoordinateSpace: DisplayObject): geom.Rectangle;
        getRect(targetCoordinateSpace: DisplayObject): geom.Rectangle;
        globalToLocal(point: geom.Point): geom.Point;
        localToGlobal(point: geom.Point): geom.Point;
        globalToLocal3D(point: geom.Point): geom.Vector3D;
        localToGlobal3D(point: geom.Point): geom.Vector3D;
        local3DToGlobal(point3d: geom.Vector3D): geom.Point;
        visit(visitor: (DisplayObject: any) => VisitorFlags, visitorFlags: VisitorFlags, displayObjectFlags?: DisplayObjectFlags): void;
        loaderInfo: LoaderInfo;
        _canHaveGraphics(): boolean;
        _getGraphics(): Graphics;
        _canHaveTextContent(): boolean;
        _getTextContent(): TextContent;
        _ensureGraphics(): Graphics;
        _setStaticContentFromSymbol(symbol: Timeline.DisplaySymbol): void;
        hitTestObject(other: DisplayObject): boolean;
        hitTestPoint(globalX: number, globalY: number, shapeFlag: boolean): boolean;
        _containsPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        _containsGlobalPoint(globalX: number, globalY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        _boundsAndMaskContainPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType): HitTestingResult;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
        scrollRect: geom.Rectangle;
        opaqueBackground: any;
        private _getDistance(ancestor);
        findNearestCommonAncestor(node: DisplayObject): DisplayObject;
        _getLocalMousePosition(): geom.Point;
        mouseX: number;
        mouseY: number;
        debugName(withFlags?: boolean): string;
        debugTrace(maxDistance?: number, name?: string): void;
        _addReference(): void;
        _removeReference(): void;
        accessibilityProperties: accessibility.AccessibilityProperties;
        blendShader: any;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class Bitmap extends DisplayObject {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(bitmapData?: BitmapData, pixelSnapping?: string, smoothing?: boolean);
        _pixelSnapping: string;
        _smoothing: boolean;
        _bitmapData: BitmapData;
        pixelSnapping: string;
        smoothing: boolean;
        bitmapData: BitmapData;
        _getContentBounds(includeStrokes?: boolean): Bounds;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class Shape extends DisplayObject {
        static classSymbols: string[];
        static instanceSymbols: string[];
        static classInitializer: any;
        static initializer: any;
        constructor();
        _canHaveGraphics(): boolean;
        _getGraphics(): Graphics;
        graphics: Graphics;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
    }
    class ShapeSymbol extends Timeline.DisplaySymbol {
        graphics: Graphics;
        constructor(data: Timeline.SymbolData, symbolClass: ASClass);
        static FromData(data: Timeline.SymbolData, loaderInfo: LoaderInfo): ShapeSymbol;
        processRequires(dependencies: any[], loaderInfo: LoaderInfo): void;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    import DisplayObject = flash.display.DisplayObject;
    class InteractiveObject extends DisplayObject {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        _tabEnabled: boolean;
        _tabIndex: number;
        _focusRect: any;
        _mouseEnabled: boolean;
        _doubleClickEnabled: boolean;
        _accessibilityImplementation: accessibility.AccessibilityImplementation;
        _softKeyboardInputAreaOfInterest: geom.Rectangle;
        _needsSoftKeyboard: boolean;
        _contextMenu: ui.ContextMenu;
        tabEnabled: boolean;
        tabIndex: number;
        focusRect: any;
        mouseEnabled: boolean;
        doubleClickEnabled: boolean;
        accessibilityImplementation: accessibility.AccessibilityImplementation;
        softKeyboardInputAreaOfInterest: geom.Rectangle;
        needsSoftKeyboard: boolean;
        contextMenu: ui.ContextMenu;
        requestSoftKeyboard(): boolean;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class SimpleButton extends InteractiveObject {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(upState?: DisplayObject, overState?: DisplayObject, downState?: DisplayObject, hitTestState?: DisplayObject);
        _initFrame(advance: boolean): void;
        _constructFrame(): void;
        private _useHandCursor;
        private _enabled;
        private _trackAsMenu;
        private _upState;
        private _overState;
        private _downState;
        private _hitTestState;
        private _currentState;
        _symbol: ButtonSymbol;
        useHandCursor: boolean;
        enabled: boolean;
        trackAsMenu: boolean;
        upState: DisplayObject;
        overState: DisplayObject;
        downState: DisplayObject;
        hitTestState: DisplayObject;
        soundTransform: media.SoundTransform;
        _containsPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        _getChildBounds(bounds: Bounds, includeStrokes: boolean): void;
        _propagateFlagsDown(flags: DisplayObjectFlags): void;
        _updateButton(): void;
    }
    class ButtonState {
        symbol: Timeline.DisplaySymbol;
        placeObjectTag: SWF.PlaceObjectTag;
        constructor(symbol: Timeline.DisplaySymbol, placeObjectTag: SWF.PlaceObjectTag);
    }
    class ButtonSymbol extends Timeline.DisplaySymbol {
        upState: ButtonState;
        overState: ButtonState;
        downState: ButtonState;
        hitTestState: ButtonState;
        loaderInfo: LoaderInfo;
        constructor(data: Timeline.SymbolData, loaderInfo: LoaderInfo);
        static FromData(data: any, loaderInfo: LoaderInfo): ButtonSymbol;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class DisplayObjectContainer extends InteractiveObject {
        static bindings: string[];
        static classSymbols: string[];
        static classInitializer: any;
        static initializer: any;
        constructor();
        private _tabChildren;
        private _mouseChildren;
        private _invalidateChildren();
        _propagateFlagsDown(flags: DisplayObjectFlags): void;
        _constructChildren(): void;
        _enqueueFrameScripts(): void;
        numChildren: number;
        textSnapshot: text.TextSnapshot;
        tabChildren: boolean;
        mouseChildren: boolean;
        addChild(child: DisplayObject): DisplayObject;
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        addTimelineObjectAtDepth(child: DisplayObject, depth: number): void;
        removeChild(child: DisplayObject): DisplayObject;
        removeChildAt(index: number): DisplayObject;
        getChildIndex(child: DisplayObject): number;
        setChildIndex(child: DisplayObject, index: number): void;
        getChildAt(index: number): DisplayObject;
        getTimelineObjectAtDepth(depth: number): DisplayObject;
        getClipDepthIndex(depth: number): number;
        getChildByName(name: string): DisplayObject;
        _lookupChildByIndex(index: number): DisplayObject;
        _lookupChildByName(name: string): DisplayObject;
        _containsPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        _containsPointImpl(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[], skipBoundsCheck: boolean): HitTestingResult;
        private _getUnclippedChildren(testingType, globalX, globalY);
        _getChildBounds(bounds: Bounds, includeStrokes: boolean): void;
        getObjectsUnderPoint(globalPoint: geom.Point): DisplayObject[];
        areInaccessibleObjectsUnderPoint(point: geom.Point): boolean;
        contains(child: DisplayObject): boolean;
        swapChildrenAt(index1: number, index2: number): void;
        private _swapChildrenAt(index1, index2);
        swapChildren(child1: DisplayObject, child2: DisplayObject): void;
        removeChildren(beginIndex?: number, endIndex?: number): void;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class JointStyle extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static ROUND: string;
        static BEVEL: string;
        static MITER: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class CapsStyle extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static ROUND: string;
        static NONE: string;
        static SQUARE: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class LineScaleMode extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static NORMAL: string;
        static VERTICAL: string;
        static HORIZONTAL: string;
        static NONE: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class GradientType extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static LINEAR: string;
        static RADIAL: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class SpreadMethod extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static PAD: string;
        static REFLECT: string;
        static REPEAT: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class InterpolationMethod extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static RGB: string;
        static LINEAR_RGB: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class GraphicsBitmapFill extends ASNative implements IGraphicsFill, IGraphicsData {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(bitmapData?: BitmapData, matrix?: geom.Matrix, repeat?: boolean, smooth?: boolean);
        bitmapData: BitmapData;
        matrix: geom.Matrix;
        repeat: boolean;
        smooth: boolean;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class GraphicsEndFill extends ASNative implements IGraphicsFill, IGraphicsData {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class GraphicsGradientFill extends ASNative implements IGraphicsFill, IGraphicsData {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(type?: string, colors?: any[], alphas?: any[], ratios?: any[], matrix?: any, spreadMethod?: any, interpolationMethod?: string, focalPointRatio?: number);
        colors: any[];
        alphas: any[];
        ratios: any[];
        matrix: geom.Matrix;
        focalPointRatio: number;
        type: string;
        spreadMethod: any;
        interpolationMethod: string;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class GraphicsPath extends ASNative implements IGraphicsPath, IGraphicsData {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(commands?: ASVector<number>, data?: ASVector<number>, winding?: string);
        commands: ASVector<number>;
        data: ASVector<number>;
        _winding: string;
        winding: string;
        moveTo: (x: number, y: number) => void;
        lineTo: (x: number, y: number) => void;
        curveTo: (controlX: number, controlY: number, anchorX: number, anchorY: number) => void;
        cubicCurveTo: (controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number) => void;
        wideLineTo: (x: number, y: number) => void;
        wideMoveTo: (x: number, y: number) => void;
        ensureLists: () => void;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class GraphicsPathCommand extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static NO_OP: number;
        static MOVE_TO: number;
        static LINE_TO: number;
        static CURVE_TO: number;
        static WIDE_MOVE_TO: number;
        static WIDE_LINE_TO: number;
        static CUBIC_CURVE_TO: number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class GraphicsPathWinding extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static EVEN_ODD: string;
        static NON_ZERO: string;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class GraphicsSolidFill extends ASNative implements IGraphicsFill, IGraphicsData {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(color?: number, alpha?: number);
        color: number;
        alpha: number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class GraphicsStroke extends ASNative implements IGraphicsStroke, IGraphicsData {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(thickness?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number, fill?: IGraphicsFill);
        thickness: number;
        pixelHinting: boolean;
        miterLimit: number;
        fill: IGraphicsFill;
        scaleMode: string;
        caps: string;
        joints: string;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class GraphicsTrianglePath extends ASNative implements IGraphicsPath, IGraphicsData {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(vertices?: ASVector<number>, indices?: ASVector<number>, uvtData?: ASVector<number>, culling?: string);
        indices: ASVector<number>;
        vertices: ASVector<number>;
        uvtData: ASVector<number>;
        _culling: string;
        culling: string;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    interface IDrawCommand {
    }
}
declare module Shumway.AVM2.AS.flash.display {
    interface IGraphicsData {
    }
}
declare module Shumway.AVM2.AS.flash.display {
    interface IGraphicsFill {
    }
}
declare module Shumway.AVM2.AS.flash.display {
    interface IGraphicsPath {
    }
}
declare module Shumway.AVM2.AS.flash.display {
    interface IGraphicsStroke {
    }
}
declare module Shumway.AVM2.AS.flash.display {
    import Bounds = Shumway.Bounds;
    import DisplayObject = flash.display.DisplayObject;
    import ShapeData = Shumway.ShapeData;
    import geom = flash.geom;
    class Graphics extends ASNative implements Remoting.IRemotable {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static FromData(data: any): Graphics;
        getGraphicsData(): ShapeData;
        getUsedTextures(): BitmapData[];
        _id: number;
        private _graphicsData;
        private _textures;
        private _lastX;
        private _lastY;
        private _boundsIncludeLastCoordinates;
        private _topLeftStrokeWidth;
        private _bottomRightStrokeWidth;
        _isDirty: boolean;
        private _setStrokeWidth(width);
        private _fillBounds;
        private _lineBounds;
        _parent: DisplayObject;
        _setParent(parent: DisplayObject): void;
        _invalidate(): void;
        _getContentBounds(includeStrokes?: boolean): Bounds;
        clear(): void;
        beginFill(color: number, alpha?: number): void;
        beginGradientFill(type: string, colors: number[], alphas: number[], ratios: number[], matrix?: geom.Matrix, spreadMethod?: string, interpolationMethod?: string, focalPointRatio?: number): void;
        beginBitmapFill(bitmap: BitmapData, matrix?: geom.Matrix, repeat?: boolean, smooth?: boolean): void;
        endFill(): void;
        lineStyle(thickness: number, color?: number, alpha?: number, pixelHinting?: boolean, scaleMode?: string, caps?: string, joints?: string, miterLimit?: number): void;
        lineGradientStyle(type: string, colors: any[], alphas: any[], ratios: any[], matrix?: geom.Matrix, spreadMethod?: string, interpolationMethod?: string, focalPointRatio?: number): void;
        lineBitmapStyle(bitmap: BitmapData, matrix?: geom.Matrix, repeat?: boolean, smooth?: boolean): void;
        drawRect(x: number, y: number, width: number, height: number): void;
        drawRoundRect(x: number, y: number, width: number, height: number, ellipseWidth: number, ellipseHeight: number): void;
        drawRoundRectComplex(x: number, y: number, width: number, height: number, topLeftRadius: number, topRightRadius: number, bottomLeftRadius: number, bottomRightRadius: number): void;
        drawCircle(x: number, y: number, radius: number): void;
        drawEllipse(x: number, y: number, width: number, height: number): void;
        moveTo(x: number, y: number): void;
        lineTo(x: number, y: number): void;
        curveTo(controlX: number, controlY: number, anchorX: number, anchorY: number): void;
        cubicCurveTo(controlX1: number, controlY1: number, controlX2: number, controlY2: number, anchorX: number, anchorY: number): void;
        copyFrom(sourceGraphics: Graphics): void;
        drawPath(commands: ASVector<any>, data: ASVector<any>, winding?: string): void;
        drawTriangles(vertices: ASVector<any>, indices?: ASVector<any>, uvtData?: ASVector<any>, culling?: string): void;
        drawGraphicsData(graphicsData: ASVector<any>): void;
        _containsPoint(x: number, y: number, includeLines: boolean, ratio: number): boolean;
        private _fillContainsPoint(x, y, ratio);
        private _linesContainsPoint(x, y, ratio);
        private _writeBitmapStyle(pathCommand, bitmap, matrix, repeat, smooth, skipWrite);
        private _writeGradientStyle(pathCommand, type, colors, alphas, ratios, matrix, spreadMethod, interpolationMethod, focalPointRatio, skipWrite);
        private _extendBoundsByPoint(x, y);
        private _extendBoundsByX(x);
        private _extendBoundsByY(y);
        private _applyLastCoordinates(x, y);
    }
}
declare module Shumway.AVM2.AS.flash.display {
    import Timeline = Shumway.Timeline;
    class Sprite extends DisplayObjectContainer {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        private _buttonMode;
        private _dropTarget;
        private _hitArea;
        private _useHandCursor;
        private _dragMode;
        private _dragDeltaX;
        private _dragDeltaY;
        private _dragBounds;
        _hitTarget: Sprite;
        _addFrame(frame: SWF.SWFFrame): void;
        _initializeChildren(frame: SWF.SWFFrame): void;
        _processControlTags(tags: any[], backwards: boolean): void;
        _removeAnimatedChild(child: DisplayObject): void;
        _canHaveGraphics(): boolean;
        _getGraphics(): Graphics;
        graphics: Graphics;
        buttonMode: boolean;
        dropTarget: DisplayObject;
        hitArea: Sprite;
        useHandCursor: boolean;
        soundTransform: media.SoundTransform;
        startDrag(lockCenter?: boolean, bounds?: geom.Rectangle): void;
        stopDrag(): void;
        _updateDragState(dropTarget?: DisplayObject): void;
        startTouchDrag(touchPointID: number, lockCenter?: boolean, bounds?: geom.Rectangle): void;
        stopTouchDrag(touchPointID: number): void;
        _containsPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
    }
    class SpriteSymbol extends Timeline.DisplaySymbol {
        numFrames: number;
        frames: any[];
        labels: FrameLabel[];
        frameScripts: any[];
        isRoot: boolean;
        avm1Name: string;
        avm1SymbolClass: any;
        loaderInfo: LoaderInfo;
        constructor(data: Timeline.SymbolData, loaderInfo: LoaderInfo);
        static FromData(data: any, loaderInfo: LoaderInfo): SpriteSymbol;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    enum FrameNavigationModel {
        SWF1 = 1,
        SWF9 = 2,
        SWF10 = 3,
    }
    class MovieClip extends Sprite implements IAdvancable {
        static frameNavigationModel: FrameNavigationModel;
        private static _callQueue;
        static classInitializer: any;
        static reset(): void;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static runFrameScripts(): void;
        constructor();
        _addFrame(frameInfo: any): void;
        _initFrame(advance: boolean): void;
        _constructFrame(): void;
        _enqueueFrameScripts(): void;
        private _currentFrame;
        private _nextFrame;
        private _totalFrames;
        private _frames;
        private _frameScripts;
        private _scenes;
        private _enabled;
        private _isPlaying;
        private _stopped;
        private _trackAsMenu;
        private _allowFrameNavigation;
        private _sounds;
        private _buttonFrames;
        private _currentButtonState;
        currentFrame: number;
        framesLoaded: number;
        totalFrames: number;
        trackAsMenu: boolean;
        scenes: Scene[];
        currentScene: Scene;
        currentLabel: string;
        currentFrameLabel: string;
        enabled: boolean;
        isPlaying: boolean;
        play(): void;
        stop(): void;
        _getAbsFrameNumber(frame: string, sceneName: string): number;
        private _gotoFrame(frame, sceneName);
        private _gotoFrameAbs(frame);
        private _advanceFrame();
        private _seekToFrame(frame);
        private _sceneForFrameIndex(frameIndex);
        private _labelForFrame(frame);
        callFrame(frame: number): void;
        nextFrame(): void;
        prevFrame(): void;
        gotoAndPlay(frame: any, scene?: string): void;
        gotoAndStop(frame: any, scene?: string): void;
        addFrameScript(frameIndex: number, script: (any?: any) => any): void;
        _avm1SymbolClass: any;
        _isFullyLoaded: boolean;
        _registerStartSounds(frameNum: number, soundStartInfo: any): void;
        _initSoundStream(streamInfo: any): void;
        _addSoundStreamBlock(frameNum: number, streamBlock: any): void;
        private _syncSounds(frameNum);
        addScene(name: string, labels: any[], offset: number, numFrames: number): void;
        addFrameLabel(name: string, frame: number): void;
        prevScene(): void;
        nextScene(): void;
        _containsPointImpl(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[], skipBoundsCheck: boolean): HitTestingResult;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class MovieClipSoundStream {
        private movieClip;
        private data;
        private seekIndex;
        private position;
        private element;
        private soundStreamAdapter;
        private wasFullyLoaded;
        private decode;
        private expectedFrame;
        private waitFor;
        constructor(streamInfo: SWF.Parser.SoundStream, movieClip: MovieClip);
        appendBlock(frameNum: number, streamBlock: Uint8Array): void;
        playFrame(frameNum: number): void;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class Stage extends DisplayObjectContainer {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static initializer: any;
        constructor();
        private _frameRate;
        private _scaleMode;
        private _align;
        private _stageWidth;
        private _stageHeight;
        private _showDefaultContextMenu;
        private _focus;
        private _colorCorrection;
        private _colorCorrectionSupport;
        private _stageFocusRect;
        private _quality;
        private _displayState;
        private _fullScreenSourceRect;
        private _mouseLock;
        private _stageVideos;
        private _stage3Ds;
        private _colorARGB;
        private _fullScreenWidth;
        private _fullScreenHeight;
        private _wmodeGPU;
        private _softKeyboardRect;
        private _allowsFullScreen;
        private _allowsFullScreenInteractive;
        private _contentsScaleFactor;
        private _displayContextInfo;
        private _timeout;
        private _stageContainerWidth;
        private _stageContainerHeight;
        private _invalidated;
        frameRate: number;
        scaleMode: string;
        align: string;
        stageWidth: number;
        _setInitialName(): void;
        setStageWidth(value: number): void;
        stageHeight: number;
        setStageHeight(value: number): void;
        setStageColor(value: number): void;
        setStageContainerSize(width: number, height: number, pixelRatio: number): void;
        showDefaultContextMenu: boolean;
        focus: InteractiveObject;
        colorCorrection: string;
        colorCorrectionSupport: string;
        stageFocusRect: boolean;
        quality: string;
        displayState: string;
        fullScreenSourceRect: geom.Rectangle;
        mouseLock: boolean;
        stageVideos: any;
        stage3Ds: ASVector<any>;
        color: number;
        alpha: number;
        fullScreenWidth: number;
        fullScreenHeight: number;
        wmodeGPU: boolean;
        softKeyboardRect: geom.Rectangle;
        allowsFullScreen: boolean;
        allowsFullScreenInteractive: boolean;
        contentsScaleFactor: number;
        displayContextInfo: string;
        removeChildAt(index: number): DisplayObject;
        swapChildrenAt(index1: number, index2: number): void;
        invalidate(): void;
        isInvalidated(): boolean;
        isFocusInaccessible(): boolean;
        requireOwnerPermissions(): void;
        render(): void;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class ActionScriptVersion extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static ACTIONSCRIPT2: number;
        static ACTIONSCRIPT3: number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class BlendMode extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static NORMAL: string;
        static LAYER: string;
        static MULTIPLY: string;
        static SCREEN: string;
        static LIGHTEN: string;
        static DARKEN: string;
        static ADD: string;
        static SUBTRACT: string;
        static DIFFERENCE: string;
        static INVERT: string;
        static OVERLAY: string;
        static HARDLIGHT: string;
        static ALPHA: string;
        static ERASE: string;
        static SHADER: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class ColorCorrection extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static DEFAULT: string;
        static ON: string;
        static OFF: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class ColorCorrectionSupport extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static UNSUPPORTED: string;
        static DEFAULT_ON: string;
        static DEFAULT_OFF: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class FocusDirection extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static TOP: string;
        static BOTTOM: string;
        static NONE: string;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class FrameLabel extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(name: string, frame: number);
        private _name;
        private _frame;
        name: string;
        frame: number;
        clone(): FrameLabel;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import Rectangle = flash.geom.Rectangle;
    class BitmapData extends ASNative implements IBitmapDrawable, Remoting.IRemotable {
        static classInitializer: any;
        _symbol: BitmapSymbol;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static MAXIMUM_WIDTH: number;
        static MAXIMUM_HEIGHT: number;
        static MAXIMUM_DIMENSION: number;
        constructor(width: number, height: number, transparent?: boolean, fillColorARGB?: number);
        private _setData(data, type);
        private _bitmapReferrers;
        _addBitmapReferrer(bitmap: Bitmap): void;
        _removeBitmapReferrer(bitmap: Bitmap): void;
        private _invalidate();
        _transparent: boolean;
        _rect: Rectangle;
        _id: number;
        _locked: boolean;
        _type: ImageType;
        _data: Uint8Array;
        _dataBuffer: DataBuffer;
        _view: Int32Array;
        _isDirty: boolean;
        _isRemoteDirty: boolean;
        _solidFillColorPBGRA: any;
        private static _temporaryRectangles;
        private _getTemporaryRectangleFrom(rect, index?);
        getDataBuffer(): DataBuffer;
        _getContentBounds(): Bounds;
        private _getPixelData(rect);
        private _putPixelData(rect, input);
        width: number;
        height: number;
        rect: Rectangle;
        transparent: boolean;
        clone(): BitmapData;
        getPixel(x: number, y: number): number;
        getPixel32(x: number, y: number): number;
        setPixel(x: number, y: number, uARGB: number): void;
        setPixel32(x: number, y: number, uARGB: number): void;
        applyFilter(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: geom.Point, filter: filters.BitmapFilter): void;
        colorTransform(rect: Rectangle, colorTransform: geom.ColorTransform): void;
        compare(otherBitmapData: BitmapData): ASObject;
        copyChannel(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: geom.Point, sourceChannel: number, destChannel: number): void;
        copyPixels(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: geom.Point, alphaBitmapData?: BitmapData, alphaPoint?: geom.Point, mergeAlpha?: boolean): void;
        private _copyPixelsAndMergeAlpha(s, sX, sY, sStride, t, tX, tY, tStride, tW, tH);
        dispose(): void;
        draw(source: IBitmapDrawable, matrix?: geom.Matrix, colorTransform?: geom.ColorTransform, blendMode?: string, clipRect?: Rectangle, smoothing?: boolean): void;
        drawWithQuality(source: IBitmapDrawable, matrix?: geom.Matrix, colorTransform?: geom.ColorTransform, blendMode?: string, clipRect?: Rectangle, smoothing?: boolean, quality?: string): void;
        fillRect(rect: Rectangle, uARGB: number): void;
        floodFill(x: number, y: number, color: number): void;
        generateFilterRect(sourceRect: Rectangle, filter: filters.BitmapFilter): Rectangle;
        getColorBoundsRect(mask: number, color: number, findColor?: boolean): Rectangle;
        getPixels(rect: Rectangle): utils.ByteArray;
        copyPixelsToByteArray(rect: Rectangle, data: utils.ByteArray): void;
        getVector(rect: Rectangle): Uint32Vector;
        hitTest(firstPoint: geom.Point, firstAlphaThreshold: number, secondObject: ASObject, secondBitmapDataPoint?: geom.Point, secondAlphaThreshold?: number): boolean;
        merge(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: geom.Point, redMultiplier: number, greenMultiplier: number, blueMultiplier: number, alphaMultiplier: number): void;
        noise(randomSeed: number, low?: number, high?: number, channelOptions?: number, grayScale?: boolean): void;
        paletteMap(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: geom.Point, redArray?: any[], greenArray?: any[], blueArray?: any[], alphaArray?: any[]): void;
        perlinNoise(baseX: number, baseY: number, numOctaves: number, randomSeed: number, stitch: boolean, fractalNoise: boolean, channelOptions?: number, grayScale?: boolean, offsets?: any[]): void;
        pixelDissolve(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: geom.Point, randomSeed?: number, numPixels?: number, fillColor?: number): number;
        scroll(x: number, y: number): void;
        setPixels(rect: Rectangle, inputByteArray: utils.ByteArray): void;
        setVector(rect: Rectangle, inputVector: Uint32Vector): void;
        threshold(sourceBitmapData: BitmapData, sourceRect: Rectangle, destPoint: geom.Point, operation: string, threshold: number, color?: number, mask?: number, copySource?: boolean): number;
        lock(): void;
        unlock(changeRect?: Rectangle): void;
        histogram(hRect?: Rectangle): ASVector<any>;
        encode(rect: Rectangle, compressor: ASObject, byteArray?: utils.ByteArray): utils.ByteArray;
        private _ensureBitmapData();
    }
    interface IBitmapDataSerializer {
        drawToBitmap(bitmapData: BitmapData, source: IBitmapDrawable, matrix: geom.Matrix, colorTransform: geom.ColorTransform, blendMode: string, clipRect: Rectangle, smoothing: boolean): any;
    }
    class BitmapSymbol extends Timeline.DisplaySymbol implements Timeline.EagerlyResolvedSymbol {
        width: number;
        height: number;
        syncId: number;
        data: Uint8Array;
        type: ImageType;
        private sharedInstance;
        constructor(data: Timeline.SymbolData);
        static FromData(data: any): BitmapSymbol;
        getSharedInstance(): BitmapData;
        createSharedInstance(): BitmapData;
        resolveAssetCallback: any;
        private _unboundResolveAssetCallback(data);
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class BitmapDataChannel extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static RED: number;
        static GREEN: number;
        static BLUE: number;
        static ALPHA: number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class BitmapEncodingColorSpace extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static COLORSPACE_AUTO: string;
        static COLORSPACE_4_4_4: string;
        static COLORSPACE_4_2_2: string;
        static COLORSPACE_4_2_0: string;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    interface IBitmapDrawable {
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class JPEGEncoderOptions extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(quality?: number);
        quality: number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    import LoaderContext = flash.system.LoaderContext;
    import events = flash.events;
    import ILoadListener = Shumway.ILoadListener;
    class Loader extends DisplayObjectContainer implements IAdvancable, ILoadListener {
        static runtimeStartTime: number;
        private static _rootLoader;
        private static _loadQueue;
        private static _embeddedContentLoadCount;
        static getRootLoader(): Loader;
        static reset(): void;
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static progress(): void;
        constructor();
        _initFrame(advance: boolean): void;
        _constructFrame(): void;
        addChild(child: DisplayObject): DisplayObject;
        addChildAt(child: DisplayObject, index: number): DisplayObject;
        removeChild(child: DisplayObject): DisplayObject;
        removeChildAt(index: number): DisplayObject;
        setChildIndex(child: DisplayObject, index: number): void;
        private _content;
        private _contentLoaderInfo;
        _uncaughtErrorEvents: events.UncaughtErrorEvents;
        private _fileLoader;
        private _loadStatus;
        private _loadingType;
        private _queuedLoadUpdate;
        _startPromise: PromiseWrapper<any>;
        private _describeData(data);
        content: DisplayObject;
        contentLoaderInfo: LoaderInfo;
        _getJPEGLoaderContextdeblockingfilter(context: LoaderContext): number;
        uncaughtErrorEvents: events.UncaughtErrorEvents;
        load(request: net.URLRequest, context?: LoaderContext): void;
        loadBytes(data: utils.ByteArray, context?: LoaderContext): void;
        close(): void;
        _unload(stopExecution: boolean, gc: boolean): void;
        unload(): void;
        unloadAndStop(gc: boolean): void;
        private _applyLoaderContext(context);
        onLoadOpen(file: any): void;
        onLoadProgress(update: LoadProgressUpdate): void;
        onNewEagerlyParsedSymbols(dictionaryEntries: SWF.EagerlyParsedDictionaryEntry[], delta: number): Promise<any>;
        onImageBytesLoaded(): void;
        private _applyDecodedImage(symbol);
        private _applyLoadUpdate(update);
        onLoadComplete(): void;
        onLoadError(): void;
        private onFileStartupReady();
        private createContentRoot(symbol, sceneData);
        private _initAvm1();
        private _initAvm1Root(root);
    }
}
declare module Shumway.AVM2.AS.flash.display {
    import SWFFile = Shumway.SWF.SWFFile;
    import SWFFrame = Shumway.SWF.SWFFrame;
    class LoaderInfo extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        setFile(file: SWFFile): void;
        uncaughtErrorEvents: events.UncaughtErrorEvents;
        static getLoaderInfoByDefinition(object: Object): LoaderInfo;
        _loaderURL: string;
        _url: string;
        _file: SWFFile;
        _isURLInaccessible: boolean;
        _bytesLoaded: number;
        _newBytesLoaded: number;
        _bytesTotal: number;
        _applicationDomain: system.ApplicationDomain;
        _swfVersion: number;
        _actionScriptVersion: number;
        _frameRate: number;
        _parameters: Object;
        _width: number;
        _height: number;
        _contentType: string;
        _sharedEvents: events.EventDispatcher;
        _parentSandboxBridge: Object;
        _childSandboxBridge: Object;
        _sameDomain: boolean;
        _childAllowsParent: boolean;
        _parentAllowsChild: boolean;
        _loader: Loader;
        _content: DisplayObject;
        _bytes: utils.ByteArray;
        _abcBlocksLoaded: number;
        _mappedSymbolsLoaded: number;
        _fontsLoaded: number;
        _uncaughtErrorEvents: events.UncaughtErrorEvents;
        _allowCodeExecution: boolean;
        _colorRGBA: number;
        _dictionary: Timeline.Symbol[];
        _avm1Context: AVM1.AVM1Context;
        loaderURL: string;
        url: string;
        isURLInaccessible: boolean;
        bytesLoaded: number;
        bytesTotal: number;
        applicationDomain: system.ApplicationDomain;
        swfVersion: number;
        actionScriptVersion: number;
        frameRate: number;
        width: number;
        height: number;
        contentType: string;
        sharedEvents: events.EventDispatcher;
        parentSandboxBridge: Object;
        childSandboxBridge: Object;
        sameDomain: boolean;
        childAllowsParent: boolean;
        parentAllowsChild: boolean;
        loader: Loader;
        content: DisplayObject;
        bytes: utils.ByteArray;
        parameters: Object;
        _getUncaughtErrorEvents(): events.UncaughtErrorEvents;
        _setUncaughtErrorEvents(value: events.UncaughtErrorEvents): void;
        getSymbolResolver(classDefinition: ASClass, symbolId: number): () => any;
        getSymbolById(id: number): Timeline.Symbol;
        getRootSymbol(): SpriteSymbol;
        private _syncAVM1Attributes(symbol);
        getFrame(sprite: {
            frames: SWFFrame[];
        }, index: number): SWFFrame;
        private resolveClassSymbol(classDefinition, symbolId);
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class MorphShape extends DisplayObject {
        static classSymbols: string[];
        static instanceSymbols: string[];
        static classInitializer: any;
        static initializer: any;
        constructor();
        _canHaveGraphics(): boolean;
        _getGraphics(): Graphics;
        graphics: Graphics;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
    }
    class MorphShapeSymbol extends ShapeSymbol {
        morphFillBounds: Bounds;
        morphLineBounds: Bounds;
        constructor(data: Timeline.SymbolData);
        static FromData(data: any, loaderInfo: LoaderInfo): MorphShapeSymbol;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class NativeMenu extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class NativeMenuItem extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        _enabled: boolean;
        enabled: boolean;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class PNGEncoderOptions extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(fastCompression?: boolean);
        fastCompression: boolean;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class PixelSnapping extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static NEVER: string;
        static ALWAYS: string;
        static AUTO: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class SWFVersion extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static FLASH1: number;
        static FLASH2: number;
        static FLASH3: number;
        static FLASH4: number;
        static FLASH5: number;
        static FLASH6: number;
        static FLASH7: number;
        static FLASH8: number;
        static FLASH9: number;
        static FLASH10: number;
        static FLASH11: number;
        static FLASH12: number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class Scene extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(name: string, labels: FrameLabel[], offset: number, numFrames: number);
        _name: string;
        offset: number;
        _numFrames: number;
        _labels: FrameLabel[];
        name: string;
        labels: FrameLabel[];
        numFrames: number;
        clone(): Scene;
        getLabelByName(name: string, ignoreCase: boolean): FrameLabel;
        getLabelByFrame(frame: number): FrameLabel;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class StageAlign extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static TOP: string;
        static LEFT: string;
        static BOTTOM: string;
        static RIGHT: string;
        static TOP_LEFT: string;
        static TOP_RIGHT: string;
        static BOTTOM_LEFT: string;
        static BOTTOM_RIGHT: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class StageDisplayState extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static FULL_SCREEN: string;
        static FULL_SCREEN_INTERACTIVE: string;
        static NORMAL: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class StageQuality extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static LOW: string;
        static MEDIUM: string;
        static HIGH: string;
        static BEST: string;
        static HIGH_8X8: string;
        static HIGH_8X8_LINEAR: string;
        static HIGH_16X16: string;
        static HIGH_16X16_LINEAR: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class StageScaleMode extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static SHOW_ALL: string;
        static EXACT_FIT: string;
        static NO_BORDER: string;
        static NO_SCALE: string;
        static SHOW_ALL_LOWERCASE: string;
        static EXACT_FIT_LOWERCASE: string;
        static NO_BORDER_LOWERCASE: string;
        static NO_SCALE_LOWERCASE: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class TriangleCulling extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static NONE: string;
        static POSITIVE: string;
        static NEGATIVE: string;
    }
}
declare module Shumway.AVM2.AS.flash.display {
    class AVM1Movie extends DisplayObject implements IAdvancable {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        private _content;
        private _constructed;
        initializeContent(content: MovieClip): void;
        call(functionName: string): any;
        addCallback(functionName: string, closure: ASFunction): void;
        _initFrame(advance: boolean): void;
        _constructFrame(): void;
        _enqueueFrameScripts(): void;
        _propagateFlagsDown(flags: DisplayObjectFlags): void;
        _containsPoint(globalX: number, globalY: number, localX: number, localY: number, testingType: HitTestingType, objects: DisplayObject[]): HitTestingResult;
        _getChildBounds(bounds: Bounds, includeStrokes: boolean): void;
    }
}
declare module Shumway.AVM2.AS.flash.external {
    class ExternalInterface extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static marshallExceptions: boolean;
        static ensureInitialized: () => void;
        static addCallback: (functionName: string, closure: ASFunction) => void;
        static convertToXML: (s: string) => ASXML;
        static convertToXMLString: (obj: any) => string;
        static convertFromXML: (xml: ASXML) => ASObject;
        static convertToJSString: (obj: any) => string;
        private static initialized;
        private static registeredCallbacks;
        private static _getAvailable();
        static _initJS(): void;
        private static _callIn(functionName, args);
        static _getPropNames(obj: ASObject): any[];
        static _addCallback(functionName: string, closure: (request: string, args: any[]) => any, hasNullCallback: boolean): void;
        static _evalJS(expression: string): string;
        static _callOut(request: string): string;
        static available: boolean;
        static objectID: string;
        static activeX: boolean;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    class BitmapFilterQuality extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static LOW: number;
        static MEDIUM: number;
        static HIGH: number;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    class BitmapFilterType extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static INNER: string;
        static OUTER: string;
        static FULL: string;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class BitmapFilter extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        private static EPS;
        private static blurFilterStepWidths;
        static _updateBlurBounds(bounds: Rectangle, blurX: number, blurY: number, quality: number, isBlurFilter?: boolean): void;
        constructor();
        _updateFilterBounds(bounds: Rectangle): void;
        _serialize(message: any): void;
        clone(): BitmapFilter;
    }
    class GradientArrays {
        static colors: any[];
        static alphas: any[];
        static ratios: any[];
        static sanitize(colors: any[], alphas: any[], ratios: any[]): void;
        static sanitizeColors(colors: number[], maxLen?: number): number[];
        static sanitizeAlphas(alphas: number[], maxLen?: number, minLen?: number, value?: number): number[];
        static sanitizeRatios(ratios: number[], maxLen?: number, minLen?: number, value?: number): number[];
        static initArray(len: number, value?: number): number[];
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class BevelFilter extends BitmapFilter {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static FromUntyped(obj: any): BevelFilter;
        constructor(distance?: number, angle?: number, highlightColor?: number, highlightAlpha?: number, shadowColor?: number, shadowAlpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, type?: string, knockout?: boolean);
        _updateFilterBounds(bounds: Rectangle): void;
        private _distance;
        private _angle;
        private _highlightColor;
        private _highlightAlpha;
        private _shadowColor;
        private _shadowAlpha;
        private _blurX;
        private _blurY;
        private _knockout;
        private _quality;
        private _strength;
        private _type;
        distance: number;
        angle: number;
        highlightColor: number;
        highlightAlpha: number;
        shadowColor: number;
        shadowAlpha: number;
        blurX: number;
        blurY: number;
        knockout: boolean;
        quality: number;
        strength: number;
        type: string;
        clone(): BitmapFilter;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class BlurFilter extends BitmapFilter {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static FromUntyped(obj: any): BlurFilter;
        constructor(blurX?: number, blurY?: number, quality?: number);
        _updateFilterBounds(bounds: Rectangle): void;
        _serialize(message: any): void;
        private _blurX;
        private _blurY;
        private _quality;
        blurX: number;
        blurY: number;
        quality: number;
        clone(): BitmapFilter;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    class ColorMatrixFilter extends BitmapFilter {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static FromUntyped(obj: any): ColorMatrixFilter;
        constructor(matrix?: any[]);
        _serialize(message: any): void;
        private _matrix;
        matrix: any[];
        clone(): BitmapFilter;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    class ConvolutionFilter extends BitmapFilter {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static FromUntyped(obj: any): ConvolutionFilter;
        constructor(matrixX?: number, matrixY?: number, matrix?: any[], divisor?: number, bias?: number, preserveAlpha?: boolean, clamp?: boolean, color?: number, alpha?: number);
        private _expandArray(a, newLen, value?);
        private _matrix;
        private _matrixX;
        private _matrixY;
        private _divisor;
        private _bias;
        private _preserveAlpha;
        private _clamp;
        private _color;
        private _alpha;
        matrix: any[];
        matrixX: number;
        matrixY: number;
        divisor: number;
        bias: number;
        preserveAlpha: boolean;
        clamp: boolean;
        color: number;
        alpha: number;
        clone(): BitmapFilter;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    class DisplacementMapFilterMode extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static WRAP: string;
        static CLAMP: string;
        static IGNORE: string;
        static COLOR: string;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    class DisplacementMapFilter extends BitmapFilter {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static FromUntyped(obj: any): DisplacementMapFilter;
        constructor(mapBitmap?: display.BitmapData, mapPoint?: geom.Point, componentX?: number, componentY?: number, scaleX?: number, scaleY?: number, mode?: string, color?: number, alpha?: number);
        private _mapBitmap;
        private _mapPoint;
        private _componentX;
        private _componentY;
        private _scaleX;
        private _scaleY;
        private _mode;
        private _color;
        private _alpha;
        mapBitmap: display.BitmapData;
        mapPoint: geom.Point;
        componentX: number;
        componentY: number;
        scaleX: number;
        scaleY: number;
        mode: string;
        color: number;
        alpha: number;
        clone(): BitmapFilter;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class DropShadowFilter extends BitmapFilter {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static FromUntyped(obj: any): DropShadowFilter;
        constructor(distance?: number, angle?: number, color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean, hideObject?: boolean);
        _updateFilterBounds(bounds: Rectangle): void;
        private _distance;
        private _angle;
        private _color;
        private _alpha;
        private _blurX;
        private _blurY;
        private _hideObject;
        private _inner;
        private _knockout;
        private _quality;
        private _strength;
        distance: number;
        angle: number;
        color: number;
        alpha: number;
        blurX: number;
        blurY: number;
        hideObject: boolean;
        inner: boolean;
        knockout: boolean;
        quality: number;
        strength: number;
        clone(): BitmapFilter;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class GlowFilter extends BitmapFilter {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static FromUntyped(obj: any): GlowFilter;
        constructor(color?: number, alpha?: number, blurX?: number, blurY?: number, strength?: number, quality?: number, inner?: boolean, knockout?: boolean);
        _updateFilterBounds(bounds: Rectangle): void;
        private _color;
        private _alpha;
        private _blurX;
        private _blurY;
        private _inner;
        private _knockout;
        private _quality;
        private _strength;
        color: number;
        alpha: number;
        blurX: number;
        blurY: number;
        inner: boolean;
        knockout: boolean;
        quality: number;
        strength: number;
        clone(): BitmapFilter;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class GradientBevelFilter extends BitmapFilter {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static FromUntyped(obj: any): GradientBevelFilter;
        constructor(distance?: number, angle?: number, colors?: any[], alphas?: any[], ratios?: any[], blurX?: number, blurY?: number, strength?: number, quality?: number, type?: string, knockout?: boolean);
        _updateFilterBounds(bounds: Rectangle): void;
        private _distance;
        private _angle;
        private _colors;
        private _alphas;
        private _ratios;
        private _blurX;
        private _blurY;
        private _knockout;
        private _quality;
        private _strength;
        private _type;
        distance: number;
        angle: number;
        colors: any[];
        alphas: any[];
        ratios: any[];
        blurX: number;
        blurY: number;
        knockout: boolean;
        quality: number;
        strength: number;
        type: string;
        clone(): BitmapFilter;
    }
}
declare module Shumway.AVM2.AS.flash.filters {
    import Rectangle = flash.geom.Rectangle;
    class GradientGlowFilter extends BitmapFilter {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static FromUntyped(obj: any): GradientGlowFilter;
        constructor(distance?: number, angle?: number, colors?: any[], alphas?: any[], ratios?: any[], blurX?: number, blurY?: number, strength?: number, quality?: number, type?: string, knockout?: boolean);
        _updateFilterBounds(bounds: Rectangle): void;
        private _distance;
        private _angle;
        private _colors;
        private _alphas;
        private _ratios;
        private _blurX;
        private _blurY;
        private _knockout;
        private _quality;
        private _strength;
        private _type;
        distance: number;
        angle: number;
        colors: any[];
        alphas: any[];
        ratios: any[];
        blurX: number;
        blurY: number;
        knockout: boolean;
        quality: number;
        strength: number;
        type: string;
        clone(): BitmapFilter;
    }
}
declare module Shumway.AVM2.AS.flash.geom {
    class ColorTransform extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaMultiplier?: number, redOffset?: number, greenOffset?: number, blueOffset?: number, alphaOffset?: number);
        static FROZEN_IDENTITY_COLOR_TRANSFORM: ColorTransform;
        static TEMP_COLOR_TRANSFORM: ColorTransform;
        redMultiplier: number;
        greenMultiplier: number;
        blueMultiplier: number;
        alphaMultiplier: number;
        redOffset: number;
        greenOffset: number;
        blueOffset: number;
        alphaOffset: number;
        native_redMultiplier: number;
        native_greenMultiplier: number;
        native_blueMultiplier: number;
        native_alphaMultiplier: number;
        native_redOffset: number;
        native_greenOffset: number;
        native_blueOffset: number;
        native_alphaOffset: number;
        ColorTransform(redMultiplier?: number, greenMultiplier?: number, blueMultiplier?: number, alphaMultiplier?: number, redOffset?: number, greenOffset?: number, blueOffset?: number, alphaOffset?: number): void;
        color: number;
        concat(second: ColorTransform): void;
        preMultiply(second: ColorTransform): void;
        copyFrom(sourceColorTransform: ColorTransform): void;
        copyFromUntyped(object: any): void;
        setTo(redMultiplier: number, greenMultiplier: number, blueMultiplier: number, alphaMultiplier: number, redOffset: number, greenOffset: number, blueOffset: number, alphaOffset: number): void;
        clone(): ColorTransform;
        convertToFixedPoint(): ColorTransform;
        toString(): string;
    }
}
declare module Shumway.AVM2.AS.flash.media {
    class Camera extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        names: any[];
        isSupported: boolean;
        static getCamera(name?: string): Camera;
        static _scanHardware(): void;
        activityLevel: number;
        bandwidth: number;
        currentFPS: number;
        fps: number;
        height: number;
        index: number;
        keyFrameInterval: number;
        loopback: boolean;
        motionLevel: number;
        motionTimeout: number;
        muted: boolean;
        name: string;
        position: string;
        quality: number;
        width: number;
        setCursor(value: boolean): void;
        setKeyFrameInterval(keyFrameInterval: number): void;
        setLoopback(compress?: boolean): void;
        setMode(width: number, height: number, fps: number, favorArea?: boolean): void;
        setMotionLevel(motionLevel: number, timeout?: number): void;
        setQuality(bandwidth: number, quality: number): void;
        drawToBitmapData(destination: display.BitmapData): void;
        copyToByteArray(rect: geom.Rectangle, destination: utils.ByteArray): void;
        copyToVector(rect: geom.Rectangle, destination: ASVector<any>): void;
    }
}
declare module Shumway.AVM2.AS.flash.media {
    class ID3Info extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        songName: string;
        artist: string;
        album: string;
        year: string;
        comment: string;
        genre: string;
        track: string;
    }
}
declare module Shumway.AVM2.AS.flash.media {
    class Microphone extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        names: any[];
        isSupported: boolean;
        static getMicrophone(index?: number): Microphone;
        static getEnhancedMicrophone(index?: number): Microphone;
        rate: number;
        codec: string;
        framesPerPacket: number;
        encodeQuality: number;
        noiseSuppressionLevel: number;
        enableVAD: boolean;
        activityLevel: number;
        gain: number;
        index: number;
        muted: boolean;
        name: string;
        silenceLevel: number;
        silenceTimeout: number;
        useEchoSuppression: boolean;
        soundTransform: SoundTransform;
        setSilenceLevel(silenceLevel: number, timeout?: number): void;
        setUseEchoSuppression(useEchoSuppression: boolean): void;
        setLoopBack(state?: boolean): void;
    }
}
declare module Shumway.AVM2.AS.flash.media {
    class Sound extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(stream?: net.URLRequest, context?: SoundLoaderContext);
        private _playQueue;
        private _soundData;
        private _stream;
        load: (stream: net.URLRequest, context?: SoundLoaderContext) => void;
        private _url;
        private _length;
        private _bytesLoaded;
        private _bytesTotal;
        private _id3;
        url: string;
        isURLInaccessible: boolean;
        length: number;
        isBuffering: boolean;
        bytesLoaded: number;
        bytesTotal: number;
        id3: ID3Info;
        loadCompressedDataFromByteArray(bytes: utils.ByteArray, bytesLength: number): void;
        loadPCMFromByteArray(bytes: utils.ByteArray, samples: number, format?: string, stereo?: boolean, sampleRate?: number): void;
        play(startTime?: number, loops?: number, sndTransform?: SoundTransform): SoundChannel;
        close(): void;
        extract(target: utils.ByteArray, length: number, startPosition?: number): number;
        _load(request: net.URLRequest, checkPolicyFile: boolean, bufferTime: number): void;
    }
    class SoundSymbol extends Timeline.Symbol {
        channels: number;
        sampleRate: number;
        pcm: Float32Array;
        packaged: any;
        constructor(data: Timeline.SymbolData);
        static FromData(data: any): SoundSymbol;
    }
}
declare module Shumway.AVM2.AS.flash.media {
    class SoundChannel extends events.EventDispatcher implements ISoundSource {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        _element: any;
        _sound: Sound;
        private _audioChannel;
        private _pcmData;
        private _position;
        _soundTransform: SoundTransform;
        private _leftPeak;
        private _rightPeak;
        position: number;
        soundTransform: SoundTransform;
        leftPeak: number;
        rightPeak: number;
        stop(): void;
        _playSoundDataViaAudio(soundData: any, startTime: any, loops: any): void;
        _playSoundDataViaChannel(soundData: any, startTime: any, loops: any): void;
        stopSound(): void;
        updateSoundLevels(volume: number): void;
    }
}
declare module Shumway.AVM2.AS.flash.media {
    class SoundLoaderContext extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(bufferTime?: number, checkPolicyFile?: boolean);
        bufferTime: number;
        checkPolicyFile: boolean;
    }
}
declare module Shumway.AVM2.AS.flash.media {
    interface ISoundSource {
        soundTransform: SoundTransform;
        updateSoundLevels(volume: number): any;
        stopSound(): any;
    }
    class SoundMixer extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        private static _masterVolume;
        private static _registeredSoundSources;
        private static _bufferTime;
        static _soundTransform: SoundTransform;
        static bufferTime: number;
        static soundTransform: SoundTransform;
        static audioPlaybackMode: string;
        static useSpeakerphoneForVoice: boolean;
        static stopAll(): void;
        static computeSpectrum(outputArray: utils.ByteArray, FFTMode?: boolean, stretchFactor?: number): void;
        static areSoundsInaccessible(): boolean;
        static _getMasterVolume(): number;
        static _setMasterVolume(volume: any): void;
        static _registerSoundSource(source: ISoundSource): void;
        static _unregisterSoundSource(source: ISoundSource): void;
        static _updateSoundSource(source: ISoundSource): void;
        static _updateAllSoundSources(): void;
    }
}
declare module Shumway.AVM2.AS.flash.media {
    class SoundTransform extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(vol?: number, panning?: number);
        private _volume;
        private _leftToLeft;
        private _leftToRight;
        private _rightToRight;
        private _rightToLeft;
        volume: number;
        leftToLeft: number;
        leftToRight: number;
        rightToRight: number;
        rightToLeft: number;
        pan: number;
        _updateTransform(): void;
    }
}
declare module Shumway.AVM2.AS.flash.media {
    class Video extends display.DisplayObject {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(width?: number, height?: number);
        _deblocking: number;
        _smoothing: boolean;
        _videoWidth: number;
        _videoHeight: number;
        _netStream: net.NetStream;
        _camera: Camera;
        deblocking: number;
        smoothing: boolean;
        videoWidth: number;
        videoHeight: number;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
        clear(): void;
        attachNetStream(netStream: net.NetStream): void;
        attachCamera(camera: Camera): void;
    }
}
declare module Shumway.AVM2.AS.flash.media {
    class VideoStreamSettings extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        width: number;
        height: number;
        fps: number;
        quality: number;
        bandwidth: number;
        keyFrameInterval: number;
        codec: string;
        setMode: (width: number, height: number, fps: number) => void;
        setQuality: (bandwidth: number, quality: number) => void;
        setKeyFrameInterval: (keyFrameInterval: number) => void;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class FileFilter extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(description: string, extension: string, macType?: string);
        private _description;
        private _extension;
        private _macType;
        description: string;
        extension: string;
        macType: string;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class LocalConnection extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static isSupported: boolean;
        close(): void;
        connect(connectionName: string): void;
        domain: string;
        send(connectionName: string, methodName: string): void;
        client: ASObject;
        isPerUser: boolean;
        allowDomain(): void;
        allowInsecureDomain(): void;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    import events = Shumway.AVM2.AS.flash.events;
    class NetConnection extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        close: () => void;
        addHeader: (operation: string, mustUnderstand?: boolean, param?: ASObject) => void;
        call: (command: string, responder: Responder) => void;
        static _defaultObjectEncoding: number;
        static defaultObjectEncoding: number;
        private _connected;
        private _uri;
        private _client;
        private _objectEncoding;
        private _proxyType;
        private _usingTLS;
        connected: boolean;
        uri: string;
        connect(command: string): void;
        client: ASObject;
        objectEncoding: number;
        proxyType: string;
        connectedProxyType: string;
        usingTLS: boolean;
        protocol: string;
        maxPeerConnections: number;
        nearID: string;
        farID: string;
        nearNonce: string;
        farNonce: string;
        unconnectedPeerStreams: any[];
        ctor(): void;
        invoke(index: number): any;
        invokeWithArgsArray(index: number, p_arguments: any[]): any;
        private _invoke(index, args);
    }
}
declare module Shumway.AVM2.AS.flash.net {
    import events = Shumway.AVM2.AS.flash.events;
    import net = Shumway.AVM2.AS.flash.net;
    import utils = Shumway.AVM2.AS.flash.utils;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    import ISoundSource = flash.media.ISoundSource;
    class NetStream extends events.EventDispatcher implements ISoundSource {
        _isDirty: boolean;
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(connection: net.NetConnection, peerID?: string);
        _connection: net.NetConnection;
        _peerID: string;
        _id: number;
        _videoReferrer: media.Video;
        private _videoStream;
        private _contentTypeHint;
        static DIRECT_CONNECTIONS: string;
        static CONNECT_TO_FMS: string;
        attach: (connection: net.NetConnection) => void;
        close: () => void;
        attachAudio: (microphone: media.Microphone) => void;
        attachCamera: (theCamera: media.Camera, snapshotMilliseconds?: number) => void;
        send: (handlerName: string) => void;
        bufferTime: number;
        maxPauseBufferTime: number;
        backBufferTime: number;
        backBufferLength: number;
        step: (frames: number) => void;
        bufferTimeMax: number;
        receiveAudio: (flag: boolean) => void;
        receiveVideo: (flag: boolean) => void;
        receiveVideoFPS: (FPS: number) => void;
        pause: () => void;
        resume: () => void;
        togglePause: () => void;
        seek: (offset: number) => void;
        publish: (name?: string, type?: string) => void;
        time: number;
        currentFPS: number;
        bufferLength: number;
        liveDelay: number;
        bytesLoaded: number;
        bytesTotal: number;
        decodedFrames: number;
        videoCodec: number;
        audioCodec: number;
        onPeerConnect: (subscriber: net.NetStream) => boolean;
        call: () => void;
        _inBufferSeek: boolean;
        private _soundTransform;
        private _checkPolicyFile;
        private _client;
        private _objectEncoding;
        dispose(): void;
        _getVideoStreamURL(): string;
        play(url: string): void;
        play2(param: net.NetStreamPlayOptions): void;
        info: net.NetStreamInfo;
        multicastInfo: net.NetStreamMulticastInfo;
        soundTransform: media.SoundTransform;
        checkPolicyFile: boolean;
        client: ASObject;
        objectEncoding: number;
        multicastPushNeighborLimit: number;
        multicastWindowDuration: number;
        multicastRelayMarginDuration: number;
        multicastAvailabilityUpdatePeriod: number;
        multicastFetchPeriod: number;
        multicastAvailabilitySendToAll: boolean;
        farID: string;
        nearNonce: string;
        farNonce: string;
        peerStreams: any[];
        audioReliable: boolean;
        videoReliable: boolean;
        dataReliable: boolean;
        audioSampleAccess: boolean;
        videoSampleAccess: boolean;
        appendBytes(bytes: utils.ByteArray): void;
        appendBytesAction(netStreamAppendBytesAction: string): void;
        useHardwareDecoder: boolean;
        useJitterBuffer: boolean;
        videoStreamSettings: media.VideoStreamSettings;
        invoke(index: number): any;
        invokeWithArgsArray(index: number, p_arguments: any[]): any;
        inBufferSeek: boolean;
        private _invoke(index, args);
        private _notifyVideoControl(eventType, data);
        processVideoEvent(eventType: VideoPlaybackEvent, data: any): void;
        stopSound(): void;
        updateSoundLevels(volume: number): void;
    }
    interface IVideoElementService {
        registerEventListener(id: number, listener: (eventType: VideoPlaybackEvent, data: any) => void): any;
        notifyVideoControl(id: number, eventType: VideoControlEvent, data: any): any;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class NetStreamInfo extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(curBPS: number, byteCount: number, maxBPS: number, audioBPS: number, audioByteCount: number, videoBPS: number, videoByteCount: number, dataBPS: number, dataByteCount: number, playbackBPS: number, droppedFrames: number, audioBufferByteLength: number, videoBufferByteLength: number, dataBufferByteLength: number, audioBufferLength: number, videoBufferLength: number, dataBufferLength: number, srtt: number, audioLossRate: number, videoLossRate: number, metaData?: ASObject, xmpData?: ASObject, uri?: string, resourceName?: string, isLive?: boolean);
        currentBytesPerSecond: number;
        byteCount: number;
        maxBytesPerSecond: number;
        audioBytesPerSecond: number;
        audioByteCount: number;
        videoBytesPerSecond: number;
        videoByteCount: number;
        dataBytesPerSecond: number;
        dataByteCount: number;
        playbackBytesPerSecond: number;
        droppedFrames: number;
        audioBufferByteLength: number;
        videoBufferByteLength: number;
        dataBufferByteLength: number;
        audioBufferLength: number;
        videoBufferLength: number;
        dataBufferLength: number;
        SRTT: number;
        audioLossRate: number;
        videoLossRate: number;
        metaData: ASObject;
        xmpData: ASObject;
        uri: string;
        resourceName: string;
        isLive: boolean;
        _curBPS: number;
        _byteCount: number;
        _maxBPS: number;
        _audioBPS: number;
        _audioByteCount: number;
        _videoBPS: number;
        _videoByteCount: number;
        _dataBPS: number;
        _dataByteCount: number;
        _playbackBPS: number;
        _droppedFrames: number;
        _audioBufferByteLength: number;
        _videoBufferByteLength: number;
        _dataBufferByteLength: number;
        _audioBufferLength: number;
        _videoBufferLength: number;
        _dataBufferLength: number;
        _srtt: number;
        _audioLossRate: number;
        _videoLossRate: number;
        _metaData: ASObject;
        _xmpData: ASObject;
        _uri: string;
        _resourceName: string;
        _isLive: boolean;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class NetStreamMulticastInfo extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(sendDataBytesPerSecond: number, sendControlBytesPerSecond: number, receiveDataBytesPerSecond: number, receiveControlBytesPerSecond: number, bytesPushedToPeers: number, fragmentsPushedToPeers: number, bytesRequestedByPeers: number, fragmentsRequestedByPeers: number, bytesPushedFromPeers: number, fragmentsPushedFromPeers: number, bytesRequestedFromPeers: number, fragmentsRequestedFromPeers: number, sendControlBytesPerSecondToServer: number, receiveDataBytesPerSecondFromServer: number, bytesReceivedFromServer: number, fragmentsReceivedFromServer: number, receiveDataBytesPerSecondFromIPMulticast: number, bytesReceivedFromIPMulticast: number, fragmentsReceivedFromIPMulticast: number);
        _sendDataBytesPerSecond: number;
        _sendControlBytesPerSecond: number;
        _receiveDataBytesPerSecond: number;
        _receiveControlBytesPerSecond: number;
        _bytesPushedToPeers: number;
        _fragmentsPushedToPeers: number;
        _bytesRequestedByPeers: number;
        _fragmentsRequestedByPeers: number;
        _bytesPushedFromPeers: number;
        _fragmentsPushedFromPeers: number;
        _bytesRequestedFromPeers: number;
        _fragmentsRequestedFromPeers: number;
        _sendControlBytesPerSecondToServer: number;
        _receiveDataBytesPerSecondFromServer: number;
        _bytesReceivedFromServer: number;
        _fragmentsReceivedFromServer: number;
        _receiveDataBytesPerSecondFromIPMulticast: number;
        _bytesReceivedFromIPMulticast: number;
        _fragmentsReceivedFromIPMulticast: number;
        sendDataBytesPerSecond: number;
        sendControlBytesPerSecond: number;
        receiveDataBytesPerSecond: number;
        receiveControlBytesPerSecond: number;
        bytesPushedToPeers: number;
        fragmentsPushedToPeers: number;
        bytesRequestedByPeers: number;
        fragmentsRequestedByPeers: number;
        bytesPushedFromPeers: number;
        fragmentsPushedFromPeers: number;
        bytesRequestedFromPeers: number;
        fragmentsRequestedFromPeers: number;
        sendControlBytesPerSecondToServer: number;
        receiveDataBytesPerSecondFromServer: number;
        bytesReceivedFromServer: number;
        fragmentsReceivedFromServer: number;
        receiveDataBytesPerSecondFromIPMulticast: number;
        bytesReceivedFromIPMulticast: number;
        fragmentsReceivedFromIPMulticast: number;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class NetStreamPlayOptions extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        streamName: string;
        oldStreamName: string;
        start: number;
        len: number;
        offset: number;
        transition: string;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class Responder extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(result: ASFunction, status?: ASFunction);
        private _result;
        private _status;
        ctor(result: ASFunction, status: ASFunction): void;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class SharedObject extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static _sharedObjects: any;
        private _path;
        connect: (myConnection: NetConnection, params?: string) => void;
        close: () => void;
        flush: (minDiskSpace?: number) => string;
        size: number;
        fps: number;
        send: () => void;
        clear: () => void;
        setProperty: (propertyName: string, value?: ASObject) => void;
        private static _defaultObjectEncoding;
        static deleteAll(url: string): number;
        static getDiskUsage(url: string): number;
        static _create(path: string, data: any): SharedObject;
        static getLocal(name: string, localPath?: string, secure?: boolean): SharedObject;
        static getRemote(name: string, remotePath?: string, persistence?: any, secure?: boolean): SharedObject;
        static defaultObjectEncoding: number;
        private _data;
        private _objectEncoding;
        data: Object;
        objectEncoding: number;
        client: ASObject;
        setDirty(propertyName: string): void;
        invoke(index: number): any;
        invokeWithArgsArray(index: number, args: any[]): any;
        private _invoke(index, args);
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class Socket extends events.EventDispatcher implements utils.IDataInput, utils.IDataOutput {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(host?: string, port?: number);
        timeout: number;
        connect: (host: string, port: number) => void;
        close: () => void;
        bytesAvailable: number;
        connected: boolean;
        objectEncoding: number;
        endian: string;
        bytesPending: number;
        readBytes(bytes: utils.ByteArray, offset?: number, length?: number): void;
        writeBytes(bytes: utils.ByteArray, offset?: number, length?: number): void;
        writeBoolean(value: boolean): void;
        writeByte(value: number): void;
        writeShort(value: number): void;
        writeInt(value: number): void;
        writeUnsignedInt(value: number): void;
        writeFloat(value: number): void;
        writeDouble(value: number): void;
        writeMultiByte(value: string, charSet: string): void;
        writeUTF(value: string): void;
        writeUTFBytes(value: string): void;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedByte(): number;
        readShort(): number;
        readUnsignedShort(): number;
        readInt(): number;
        readUnsignedInt(): number;
        readFloat(): number;
        readDouble(): number;
        readMultiByte(length: number, charSet: string): string;
        readUTF(): string;
        readUTFBytes(length: number): string;
        flush(): void;
        writeObject(object: any): void;
        readObject(): any;
        internalGetSecurityErrorMessage(host: any, port: any): string;
        internalConnect(host: any, port: any): void;
        didFailureOccur(): boolean;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class URLLoader extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(request?: URLRequest);
        private _areDecodeErrorsIgnored;
        data: any;
        dataFormat: string;
        bytesLoaded: number;
        bytesTotal: number;
        load: (request: URLRequest) => void;
        close: () => void;
        _stream: URLStream;
        _httpResponseEventBound: boolean;
        complete: () => any;
        onStreamOpen: (e: events.Event) => any;
        onStreamComplete: (e: events.Event) => any;
        onStreamProgress: (e: events.ProgressEvent) => any;
        onStreamIOError: (e: events.IOErrorEvent) => any;
        onStreamHTTPStatus: (e: events.HTTPStatusEvent) => any;
        onStreamHTTPResponseStatus: (e: events.HTTPStatusEvent) => any;
        onStreamSecurityError: (e: events.SecurityErrorEvent) => any;
        _setDecodeErrorsIgnored(value: boolean): void;
        _getDecodeErrorsIgnored(): boolean;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class URLRequest extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static bindings: string[];
        constructor(url?: string);
        _checkPolicyFile: boolean;
        private _url;
        private _data;
        private _method;
        private _contentType;
        private _requestHeaders;
        private _digest;
        url: string;
        data: ASObject;
        method: string;
        contentType: string;
        requestHeaders: any[];
        digest: string;
        _toFileRequest(): any;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class URLRequestHeader extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(name?: string, value?: string);
        name: string;
        value: string;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    import utils = Shumway.AVM2.AS.flash.utils;
    class URLStream extends events.EventDispatcher implements utils.IDataInput {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        private _buffer;
        private _writePosition;
        private _session;
        private _connected;
        connected: boolean;
        bytesAvailable: number;
        objectEncoding: number;
        endian: string;
        diskCacheEnabled: boolean;
        position: number;
        length: number;
        load(request: URLRequest): void;
        readBytes(bytes: utils.ByteArray, offset?: number, length?: number): void;
        readBoolean(): boolean;
        readByte(): number;
        readUnsignedByte(): number;
        readShort(): number;
        readUnsignedShort(): number;
        readUnsignedInt(): number;
        readInt(): number;
        readFloat(): number;
        readDouble(): number;
        readMultiByte(length: number, charSet: string): string;
        readUTF(): string;
        readUTFBytes(length: number): string;
        close(): void;
        readObject(): any;
        stop(): void;
    }
}
declare module Shumway.AVM2.AS.flash.net {
    class URLVariables extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(source?: string);
        private _areErrorsIgnored;
        decode: (source: string) => void;
        unescape: (s: string) => string;
        escape: (s: string) => string;
        _setErrorsIgnored(value: boolean): void;
        _getErrorsIgnored(): boolean;
    }
}
declare module Shumway.AVM2.AS.flash.sensors {
    class Accelerometer extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        isSupported: boolean;
        muted: boolean;
        setRequestedUpdateInterval(interval: number): void;
    }
}
declare module Shumway.AVM2.AS.flash.sensors {
    class Geolocation extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        isSupported: boolean;
        muted: boolean;
        setRequestedUpdateInterval(interval: number): void;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class ApplicationDomain extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        private _runtimeDomain;
        constructor(parentDomainOrRuntimeDomain?: any);
        static currentDomain: ApplicationDomain;
        static MIN_DOMAIN_MEMORY_LENGTH: number;
        parentDomain: ApplicationDomain;
        domainMemory: utils.ByteArray;
        getDefinition(name: string): Object;
        hasDefinition(name: string): boolean;
        getQualifiedDefinitionNames(): ASVector<any>;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class Capabilities extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        private static _hasAccessibility;
        private static _isDebugger;
        private static _language;
        private static _manufacturer;
        private static _os;
        private static _playerType;
        private static _version;
        private static _screenDPI;
        static isEmbeddedInAcrobat: boolean;
        static hasEmbeddedVideo: boolean;
        static hasAudio: boolean;
        static avHardwareDisable: boolean;
        static hasAccessibility: boolean;
        static hasAudioEncoder: boolean;
        static hasMP3: boolean;
        static hasPrinting: boolean;
        static hasScreenBroadcast: boolean;
        static hasScreenPlayback: boolean;
        static hasStreamingAudio: boolean;
        static hasStreamingVideo: boolean;
        static hasVideoEncoder: boolean;
        static isDebugger: boolean;
        static localFileReadDisable: boolean;
        static language: string;
        static manufacturer: string;
        static os: string;
        static cpuArchitecture: string;
        static playerType: string;
        static serverString: string;
        static version: string;
        static screenColor: string;
        static pixelAspectRatio: number;
        static screenDPI: number;
        static screenResolutionX: number;
        static screenResolutionY: number;
        static touchscreenType: string;
        static hasIME: boolean;
        static hasTLS: boolean;
        static maxLevelIDC: string;
        static supports32BitProcesses: boolean;
        static supports64BitProcesses: boolean;
        static _internal: number;
        static hasMultiChannelAudio(type: string): boolean;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class FSCommand extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static _fscommand(command: string, args: string): void;
    }
    interface IFSCommandListener {
        executeFSCommand(command: string, args: string): any;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class ImageDecodingPolicy extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static ON_DEMAND: string;
        static ON_LOAD: string;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class LoaderContext extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(checkPolicyFile?: boolean, applicationDomain?: ApplicationDomain, securityDomain?: SecurityDomain);
        checkPolicyFile: boolean;
        applicationDomain: ApplicationDomain;
        securityDomain: SecurityDomain;
        allowCodeImport: boolean;
        requestedContentParent: display.DisplayObjectContainer;
        parameters: ASObject;
        imageDecodingPolicy: string;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class JPEGLoaderContext extends LoaderContext {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(deblockingFilter?: number, checkPolicyFile?: boolean, applicationDomain?: ApplicationDomain, securityDomain?: SecurityDomain);
        deblockingFilter: number;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class MessageChannel extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        messageAvailable: boolean;
        state: string;
        send(arg: any, queueLimit?: number): void;
        receive(blockUntilReceived?: boolean): any;
        close(): void;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class MessageChannelState extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static OPEN: string;
        static CLOSING: string;
        static CLOSED: string;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class Security extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static REMOTE: string;
        static LOCAL_WITH_FILE: string;
        static LOCAL_WITH_NETWORK: string;
        static LOCAL_TRUSTED: string;
        static APPLICATION: string;
        private static _exactSettings;
        private static _sandboxType;
        static exactSettings: boolean;
        static disableAVM1Loading: boolean;
        static sandboxType: string;
        static pageDomain: string;
        static allowDomain(): void;
        static allowInsecureDomain(): void;
        static loadPolicyFile(url: string): void;
        static showSettings(panel?: string): void;
        static duplicateSandboxBridgeInputArguments(toplevel: ASObject, args: any[]): any[];
        static duplicateSandboxBridgeOutputArgument(toplevel: ASObject, arg: any): any;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class SecurityDomain extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        currentDomain: SecurityDomain;
        domainID: string;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class SecurityPanel extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static DEFAULT: string;
        static PRIVACY: string;
        static LOCAL_STORAGE: string;
        static MICROPHONE: string;
        static CAMERA: string;
        static DISPLAY: string;
        static SETTINGS_MANAGER: string;
    }
}
declare module Shumway.AVM2.AS.flash.system {
    class TouchscreenType extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static FINGER: string;
        static STYLUS: string;
        static NONE: string;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class AntiAliasType extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static NORMAL: string;
        static ADVANCED: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class FontStyle extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static REGULAR: string;
        static BOLD: string;
        static ITALIC: string;
        static BOLD_ITALIC: string;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class FontType extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static EMBEDDED: string;
        static EMBEDDED_CFF: string;
        static DEVICE: string;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class Font extends ASNative implements Remoting.IRemotable {
        private static _fonts;
        private static _fontsBySymbolId;
        private static _fontsByName;
        static DEVICE_FONT_METRICS_WIN: Object;
        static DEVICE_FONT_METRICS_LINUX: Object;
        static DEVICE_FONT_METRICS_MAC: Object;
        static DEVICE_FONT_METRICS_BUILTIN: Object;
        static DEFAULT_FONT_SANS: string;
        static DEFAULT_FONT_SERIF: string;
        static DEFAULT_FONT_TYPEWRITER: string;
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static initializer: any;
        private static _deviceFontMetrics;
        private static _getFontMetrics(name, style);
        static resolveFontName(name: string): string;
        constructor();
        static getBySymbolId(id: number): Font;
        static getByNameAndStyle(name: string, style: string): Font;
        static getDefaultFont(): Font;
        private _fontName;
        _fontFamily: string;
        private _fontStyle;
        private _fontType;
        _id: number;
        _symbol: FontSymbol;
        ascent: number;
        descent: number;
        leading: number;
        advances: number[];
        static enumerateFonts(enumerateDeviceFonts?: boolean): any[];
        static registerFont(font: ASClass): void;
        static registerEmbeddedFont(fontMapping: {
            name: string;
            style: string;
            id: number;
        }, loaderInfo: display.LoaderInfo): void;
        static resolveEmbeddedFont(loaderInfo: display.LoaderInfo, id: number, syncId: number): Font;
        fontName: string;
        fontStyle: string;
        fontType: string;
        hasGlyphs(str: string): boolean;
    }
    class FontSymbol extends Timeline.Symbol implements Timeline.EagerlyResolvedSymbol {
        name: string;
        bold: boolean;
        italic: boolean;
        codes: number[];
        originalSize: boolean;
        metrics: any;
        syncId: number;
        constructor(data: Timeline.SymbolData);
        static FromData(data: any): FontSymbol;
        resolveAssetCallback: any;
        private _unboundResolveAssetCallback(data);
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class GridFitType extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static NONE: string;
        static PIXEL: string;
        static SUBPIXEL: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class StaticText extends display.DisplayObject {
        static classInitializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static initializer: any;
        constructor();
        _canHaveTextContent(): boolean;
        _getTextContent(): TextContent;
        _textContent: TextContent;
        text: string;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class StyleSheet extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        _styles: ASObject;
        styleNames: any[];
        getStyle: (styleName: string) => ASObject;
        setStyle: (styleName: string, styleObject: ASObject) => void;
        clear: () => void;
        transform: (formatObject: ASObject) => TextFormat;
        parseCSS: (CSSText: string) => void;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class TextDisplayMode extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static LCD: string;
        static CRT: string;
        static DEFAULT: string;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    class TextField extends display.InteractiveObject {
        static classSymbols: string[];
        static instanceSymbols: string[];
        static classInitializer: any;
        static initializer: any;
        constructor();
        _setFillAndLineBoundsFromSymbol(symbol: Timeline.DisplaySymbol): void;
        _setFillAndLineBoundsFromWidthAndHeight(width: number, height: number): void;
        _canHaveTextContent(): boolean;
        _getTextContent(): TextContent;
        _getContentBounds(includeStrokes?: boolean): Bounds;
        _containsPointDirectly(localX: number, localY: number, globalX: number, globalY: number): boolean;
        private _invalidateContent();
        _textContent: TextContent;
        _lineMetricsData: DataBuffer;
        static isFontCompatible(fontName: string, fontStyle: string): boolean;
        _alwaysShowSelection: boolean;
        _antiAliasType: string;
        _autoSize: string;
        _background: boolean;
        _backgroundColor: number;
        _border: boolean;
        _borderColor: number;
        _bottomScrollV: number;
        _caretIndex: number;
        _condenseWhite: boolean;
        _embedFonts: boolean;
        _gridFitType: string;
        _htmlText: string;
        _length: number;
        _textInteractionMode: string;
        _maxChars: number;
        _maxScrollH: number;
        _maxScrollV: number;
        _mouseWheelEnabled: boolean;
        _multiline: boolean;
        _numLines: number;
        _displayAsPassword: boolean;
        _restrict: string;
        _scrollH: number;
        _scrollV: number;
        _selectable: boolean;
        _selectedText: string;
        _selectionBeginIndex: number;
        _selectionEndIndex: number;
        _sharpness: number;
        _styleSheet: StyleSheet;
        _textColor: number;
        _textHeight: number;
        _textWidth: number;
        _thickness: number;
        _type: string;
        _wordWrap: boolean;
        _useRichTextClipboard: boolean;
        alwaysShowSelection: boolean;
        antiAliasType: string;
        autoSize: string;
        background: boolean;
        backgroundColor: number;
        border: boolean;
        borderColor: number;
        bottomScrollV: number;
        caretIndex: number;
        condenseWhite: boolean;
        defaultTextFormat: TextFormat;
        embedFonts: boolean;
        gridFitType: string;
        htmlText: string;
        length: number;
        textInteractionMode: string;
        maxChars: number;
        maxScrollH: number;
        maxScrollV: number;
        mouseWheelEnabled: boolean;
        multiline: boolean;
        numLines: number;
        displayAsPassword: boolean;
        restrict: string;
        scrollH: number;
        scrollV: number;
        selectable: boolean;
        selectedText: string;
        selectionBeginIndex: number;
        selectionEndIndex: number;
        sharpness: number;
        styleSheet: StyleSheet;
        text: string;
        textColor: number;
        textHeight: number;
        textWidth: number;
        thickness: number;
        type: string;
        wordWrap: boolean;
        useRichTextClipboard: boolean;
        private _ensureLineMetrics();
        appendText(newText: string): void;
        getCharBoundaries(charIndex: number): geom.Rectangle;
        getCharIndexAtPoint(x: number, y: number): number;
        getFirstCharInParagraph(charIndex: number): number;
        getLineIndexAtPoint(x: number, y: number): number;
        getLineIndexOfChar(charIndex: number): number;
        getLineLength(lineIndex: number): number;
        getLineMetrics(lineIndex: number): TextLineMetrics;
        getLineOffset(lineIndex: number): number;
        getLineText(lineIndex: number): string;
        getParagraphLength(charIndex: number): number;
        getTextFormat(beginIndex?: number, endIndex?: number): TextFormat;
        getTextRuns(beginIndex?: number, endIndex?: number): any[];
        getRawText(): string;
        replaceSelectedText(value: string): void;
        replaceText(beginIndex: number, endIndex: number, newText: string): void;
        setSelection(beginIndex: number, endIndex: number): void;
        setTextFormat(format: TextFormat, beginIndex?: number, endIndex?: number): void;
        getImageReference(id: string): display.DisplayObject;
    }
    class TextSymbol extends Timeline.DisplaySymbol {
        color: number;
        size: number;
        face: string;
        bold: boolean;
        italic: boolean;
        align: string;
        leftMargin: number;
        rightMargin: number;
        indent: number;
        leading: number;
        multiline: boolean;
        wordWrap: boolean;
        embedFonts: boolean;
        selectable: boolean;
        border: boolean;
        initialText: string;
        html: boolean;
        displayAsPassword: boolean;
        type: string;
        maxChars: number;
        autoSize: string;
        variableName: string;
        textContent: TextContent;
        constructor(data: Timeline.SymbolData);
        static FromTextData(data: any, loaderInfo: display.LoaderInfo): TextSymbol;
        static FromLabelData(data: any, loaderInfo: display.LoaderInfo): TextSymbol;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class TextFieldAutoSize extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static NONE: string;
        static LEFT: string;
        static CENTER: string;
        static RIGHT: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class TextFieldType extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static INPUT: string;
        static DYNAMIC: string;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class TextFormat extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(font?: string, size?: Object, color?: Object, bold?: Object, italic?: Object, underline?: Object, url?: string, target?: string, align?: string, leftMargin?: Object, rightMargin?: Object, indent?: Object, leading?: Object);
        private static measureTextField;
        private _align;
        private _blockIndent;
        private _bold;
        private _bullet;
        private _color;
        private _display;
        private _font;
        private _indent;
        private _italic;
        private _kerning;
        private _leading;
        private _leftMargin;
        private _letterSpacing;
        private _rightMargin;
        private _size;
        private _tabStops;
        private _target;
        private _underline;
        private _url;
        align: string;
        blockIndent: Object;
        bold: Object;
        bullet: Object;
        color: Object;
        display: string;
        font: string;
        style: string;
        indent: Object;
        italic: Object;
        kerning: Object;
        leading: Object;
        leftMargin: Object;
        letterSpacing: Object;
        rightMargin: Object;
        size: Object;
        tabStops: any[];
        target: string;
        underline: Object;
        url: string;
        private static coerceNumber(value);
        private static coerceBoolean(value);
        clone(): TextFormat;
        equals(other: TextFormat): boolean;
        merge(other: TextFormat): void;
        intersect(other: TextFormat): void;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class TextFormatAlign extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static LEFT: string;
        static CENTER: string;
        static RIGHT: string;
        static JUSTIFY: string;
        static START: string;
        static END: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class TextFormatDisplay extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static INLINE: string;
        static BLOCK: string;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class TextInteractionMode extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static NORMAL: string;
        static SELECTION: string;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class TextLineMetrics extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(x: number, width: number, height: number, ascent: number, descent: number, leading: number);
        x: number;
        width: number;
        height: number;
        ascent: number;
        descent: number;
        leading: number;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class TextRun extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(beginIndex: number, endIndex: number, textFormat: TextFormat);
        _beginIndex: number;
        _endIndex: number;
        _textFormat: TextFormat;
        beginIndex: number;
        endIndex: number;
        textFormat: TextFormat;
        clone(): TextRun;
        containsIndex(index: number): boolean;
        intersects(beginIndex: number, endIndex: number): boolean;
    }
}
declare module Shumway.AVM2.AS.flash.text {
    class TextSnapshot extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        charCount: number;
        findText(beginIndex: number, textToFind: string, caseSensitive: boolean): number;
        getSelected(beginIndex: number, endIndex: number): boolean;
        getSelectedText(includeLineEndings?: boolean): string;
        getText(beginIndex: number, endIndex: number, includeLineEndings?: boolean): string;
        getTextRunInfo(beginIndex: number, endIndex: number): any[];
        hitTestTextNearPos(x: number, y: number, maxDistance?: number): number;
        setSelectColor(hexColor?: number): void;
        setSelected(beginIndex: number, endIndex: number, select: boolean): void;
    }
}
declare module Shumway.AVM2.AS.flash.trace {
    class Trace extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static OFF: number;
        static METHODS: number;
        static METHODS_WITH_ARGS: number;
        static METHODS_AND_LINES: number;
        static METHODS_AND_LINES_WITH_ARGS: number;
        static FILE: any;
        static LISTENER: any;
        static setLevel(l: number, target?: number): any;
        static getLevel(target?: number): number;
        static setListener(f: ASFunction): any;
        static getListener(): ASFunction;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class ContextMenu extends display.NativeMenu {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static isSupported: boolean;
        hideBuiltInItems: () => void;
        clone: () => ContextMenu;
        _builtInItems: ContextMenuBuiltInItems;
        _customItems: any[];
        builtInItems: ContextMenuBuiltInItems;
        customItems: any[];
        link: net.URLRequest;
        clipboardMenu: boolean;
        clipboardItems: ContextMenuClipboardItems;
        cloneLinkAndClipboardProperties(c: ContextMenu): void;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class ContextMenuBuiltInItems extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        _save: boolean;
        _zoom: boolean;
        _quality: boolean;
        _play: boolean;
        _loop: boolean;
        _rewind: boolean;
        _forwardAndBack: boolean;
        _print: boolean;
        save: boolean;
        zoom: boolean;
        quality: boolean;
        play: boolean;
        loop: boolean;
        rewind: boolean;
        forwardAndBack: boolean;
        print: boolean;
        clone: () => ContextMenuBuiltInItems;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class ContextMenuClipboardItems extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        cut: boolean;
        copy: boolean;
        paste: boolean;
        clear: boolean;
        selectAll: boolean;
        clone: () => ContextMenuClipboardItems;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class ContextMenuItem extends display.NativeMenuItem {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(caption: string, separatorBefore?: boolean, enabled?: boolean, visible?: boolean);
        clone: () => ContextMenuItem;
        _caption: string;
        _separatorBefore: boolean;
        _visible: boolean;
        _enabled: boolean;
        caption: string;
        separatorBefore: boolean;
        visible: boolean;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class GameInput extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        numDevices: number;
        isSupported: boolean;
        static getDeviceAt(index: number): GameInputDevice;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class GameInputControl extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        numValues: number;
        index: number;
        relative: boolean;
        type: string;
        hand: string;
        finger: string;
        device: GameInputDevice;
        getValueAt(index?: number): number;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class GameInputControlType extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static MOVEMENT: string;
        static ROTATION: string;
        static DIRECTION: string;
        static ACCELERATION: string;
        static BUTTON: string;
        static TRIGGER: string;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class GameInputDevice extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static MAX_BUFFER_SIZE: number;
        numControls: number;
        sampleInterval: number;
        enabled: boolean;
        id: string;
        name: string;
        getControlAt(i: number): GameInputControl;
        startCachingSamples(numSamples: number, controls: ASVector<any>): void;
        stopCachingSamples(): void;
        getCachedSamples(data: utils.ByteArray, append?: boolean): number;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class GameInputFinger extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static THUMB: string;
        static INDEX: string;
        static MIDDLE: string;
        static UNKNOWN: string;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class GameInputHand extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static RIGHT: string;
        static LEFT: string;
        static UNKNOWN: string;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class KeyboardEventDispatcher {
        private _lastKeyCode;
        private _captureKeyPress;
        private _charCodeMap;
        target: events.EventDispatcher;
        dispatchKeyboardEvent(event: KeyboardEventData): void;
    }
    interface KeyboardEventData {
        type: string;
        keyCode: number;
        charCode: number;
        location: number;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
    }
    class Keyboard extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static KEYNAME_UPARROW: string;
        static KEYNAME_DOWNARROW: string;
        static KEYNAME_LEFTARROW: string;
        static KEYNAME_RIGHTARROW: string;
        static KEYNAME_F1: string;
        static KEYNAME_F2: string;
        static KEYNAME_F3: string;
        static KEYNAME_F4: string;
        static KEYNAME_F5: string;
        static KEYNAME_F6: string;
        static KEYNAME_F7: string;
        static KEYNAME_F8: string;
        static KEYNAME_F9: string;
        static KEYNAME_F10: string;
        static KEYNAME_F11: string;
        static KEYNAME_F12: string;
        static KEYNAME_F13: string;
        static KEYNAME_F14: string;
        static KEYNAME_F15: string;
        static KEYNAME_F16: string;
        static KEYNAME_F17: string;
        static KEYNAME_F18: string;
        static KEYNAME_F19: string;
        static KEYNAME_F20: string;
        static KEYNAME_F21: string;
        static KEYNAME_F22: string;
        static KEYNAME_F23: string;
        static KEYNAME_F24: string;
        static KEYNAME_F25: string;
        static KEYNAME_F26: string;
        static KEYNAME_F27: string;
        static KEYNAME_F28: string;
        static KEYNAME_F29: string;
        static KEYNAME_F30: string;
        static KEYNAME_F31: string;
        static KEYNAME_F32: string;
        static KEYNAME_F33: string;
        static KEYNAME_F34: string;
        static KEYNAME_F35: string;
        static KEYNAME_INSERT: string;
        static KEYNAME_DELETE: string;
        static KEYNAME_HOME: string;
        static KEYNAME_BEGIN: string;
        static KEYNAME_END: string;
        static KEYNAME_PAGEUP: string;
        static KEYNAME_PAGEDOWN: string;
        static KEYNAME_PRINTSCREEN: string;
        static KEYNAME_SCROLLLOCK: string;
        static KEYNAME_PAUSE: string;
        static KEYNAME_SYSREQ: string;
        static KEYNAME_BREAK: string;
        static KEYNAME_RESET: string;
        static KEYNAME_STOP: string;
        static KEYNAME_MENU: string;
        static KEYNAME_USER: string;
        static KEYNAME_SYSTEM: string;
        static KEYNAME_PRINT: string;
        static KEYNAME_CLEARLINE: string;
        static KEYNAME_CLEARDISPLAY: string;
        static KEYNAME_INSERTLINE: string;
        static KEYNAME_DELETELINE: string;
        static KEYNAME_INSERTCHAR: string;
        static KEYNAME_DELETECHAR: string;
        static KEYNAME_PREV: string;
        static KEYNAME_NEXT: string;
        static KEYNAME_SELECT: string;
        static KEYNAME_EXECUTE: string;
        static KEYNAME_UNDO: string;
        static KEYNAME_REDO: string;
        static KEYNAME_FIND: string;
        static KEYNAME_HELP: string;
        static KEYNAME_MODESWITCH: string;
        static STRING_UPARROW: string;
        static STRING_DOWNARROW: string;
        static STRING_LEFTARROW: string;
        static STRING_RIGHTARROW: string;
        static STRING_F1: string;
        static STRING_F2: string;
        static STRING_F3: string;
        static STRING_F4: string;
        static STRING_F5: string;
        static STRING_F6: string;
        static STRING_F7: string;
        static STRING_F8: string;
        static STRING_F9: string;
        static STRING_F10: string;
        static STRING_F11: string;
        static STRING_F12: string;
        static STRING_F13: string;
        static STRING_F14: string;
        static STRING_F15: string;
        static STRING_F16: string;
        static STRING_F17: string;
        static STRING_F18: string;
        static STRING_F19: string;
        static STRING_F20: string;
        static STRING_F21: string;
        static STRING_F22: string;
        static STRING_F23: string;
        static STRING_F24: string;
        static STRING_F25: string;
        static STRING_F26: string;
        static STRING_F27: string;
        static STRING_F28: string;
        static STRING_F29: string;
        static STRING_F30: string;
        static STRING_F31: string;
        static STRING_F32: string;
        static STRING_F33: string;
        static STRING_F34: string;
        static STRING_F35: string;
        static STRING_INSERT: string;
        static STRING_DELETE: string;
        static STRING_HOME: string;
        static STRING_BEGIN: string;
        static STRING_END: string;
        static STRING_PAGEUP: string;
        static STRING_PAGEDOWN: string;
        static STRING_PRINTSCREEN: string;
        static STRING_SCROLLLOCK: string;
        static STRING_PAUSE: string;
        static STRING_SYSREQ: string;
        static STRING_BREAK: string;
        static STRING_RESET: string;
        static STRING_STOP: string;
        static STRING_MENU: string;
        static STRING_USER: string;
        static STRING_SYSTEM: string;
        static STRING_PRINT: string;
        static STRING_CLEARLINE: string;
        static STRING_CLEARDISPLAY: string;
        static STRING_INSERTLINE: string;
        static STRING_DELETELINE: string;
        static STRING_INSERTCHAR: string;
        static STRING_DELETECHAR: string;
        static STRING_PREV: string;
        static STRING_NEXT: string;
        static STRING_SELECT: string;
        static STRING_EXECUTE: string;
        static STRING_UNDO: string;
        static STRING_REDO: string;
        static STRING_FIND: string;
        static STRING_HELP: string;
        static STRING_MODESWITCH: string;
        static CharCodeStrings: any[];
        static NUMBER_0: number;
        static NUMBER_1: number;
        static NUMBER_2: number;
        static NUMBER_3: number;
        static NUMBER_4: number;
        static NUMBER_5: number;
        static NUMBER_6: number;
        static NUMBER_7: number;
        static NUMBER_8: number;
        static NUMBER_9: number;
        static A: number;
        static B: number;
        static C: number;
        static D: number;
        static E: number;
        static F: number;
        static G: number;
        static H: number;
        static I: number;
        static J: number;
        static K: number;
        static L: number;
        static M: number;
        static N: number;
        static O: number;
        static P: number;
        static Q: number;
        static R: number;
        static S: number;
        static T: number;
        static U: number;
        static V: number;
        static W: number;
        static X: number;
        static Y: number;
        static Z: number;
        static SEMICOLON: number;
        static EQUAL: number;
        static COMMA: number;
        static MINUS: number;
        static PERIOD: number;
        static SLASH: number;
        static BACKQUOTE: number;
        static LEFTBRACKET: number;
        static BACKSLASH: number;
        static RIGHTBRACKET: number;
        static QUOTE: number;
        static ALTERNATE: number;
        static BACKSPACE: number;
        static CAPS_LOCK: number;
        static COMMAND: number;
        static CONTROL: number;
        static DELETE: number;
        static DOWN: number;
        static END: number;
        static ENTER: number;
        static ESCAPE: number;
        static F1: number;
        static F2: number;
        static F3: number;
        static F4: number;
        static F5: number;
        static F6: number;
        static F7: number;
        static F8: number;
        static F9: number;
        static F10: number;
        static F11: number;
        static F12: number;
        static F13: number;
        static F14: number;
        static F15: number;
        static HOME: number;
        static INSERT: number;
        static LEFT: number;
        static NUMPAD: number;
        static NUMPAD_0: number;
        static NUMPAD_1: number;
        static NUMPAD_2: number;
        static NUMPAD_3: number;
        static NUMPAD_4: number;
        static NUMPAD_5: number;
        static NUMPAD_6: number;
        static NUMPAD_7: number;
        static NUMPAD_8: number;
        static NUMPAD_9: number;
        static NUMPAD_ADD: number;
        static NUMPAD_DECIMAL: number;
        static NUMPAD_DIVIDE: number;
        static NUMPAD_ENTER: number;
        static NUMPAD_MULTIPLY: number;
        static NUMPAD_SUBTRACT: number;
        static PAGE_DOWN: number;
        static PAGE_UP: number;
        static RIGHT: number;
        static SHIFT: number;
        static SPACE: number;
        static TAB: number;
        static UP: number;
        static RED: number;
        static GREEN: number;
        static YELLOW: number;
        static BLUE: number;
        static CHANNEL_UP: number;
        static CHANNEL_DOWN: number;
        static RECORD: number;
        static PLAY: number;
        static PAUSE: number;
        static STOP: number;
        static FAST_FORWARD: number;
        static REWIND: number;
        static SKIP_FORWARD: number;
        static SKIP_BACKWARD: number;
        static NEXT: number;
        static PREVIOUS: number;
        static LIVE: number;
        static LAST: number;
        static MENU: number;
        static INFO: number;
        static GUIDE: number;
        static EXIT: number;
        static BACK: number;
        static AUDIO: number;
        static SUBTITLE: number;
        static DVR: number;
        static VOD: number;
        static INPUT: number;
        static SETUP: number;
        static HELP: number;
        static MASTER_SHELL: number;
        static SEARCH: number;
        capsLock: boolean;
        numLock: boolean;
        hasVirtualKeyboard: boolean;
        physicalKeyboardType: string;
        static isAccessible(): boolean;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    import InteractiveObject = flash.display.InteractiveObject;
    class MouseEventDispatcher {
        stage: display.Stage;
        currentTarget: InteractiveObject;
        private _findTarget(point, testingType);
        private _dispatchMouseEvent(target, type, data, relatedObject?);
        handleMouseEvent(data: MouseEventAndPointData): InteractiveObject;
    }
    enum MouseButtonFlags {
        Left = 1,
        Middle = 2,
        Right = 4,
    }
    interface MouseEventAndPointData {
        type: string;
        point: geom.Point;
        ctrlKey: boolean;
        altKey: boolean;
        shiftKey: boolean;
        buttons: MouseButtonFlags;
    }
    class Mouse extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static _cursor: string;
        static supportsCursor: boolean;
        static cursor: string;
        static supportsNativeCursor: boolean;
        static hide(): void;
        static show(): void;
        static registerCursor(name: string, cursor: MouseCursorData): void;
        static unregisterCursor(name: string): void;
        static _currentPosition: geom.Point;
        static updateCurrentPosition(value: geom.Point): void;
        static draggableObject: display.Sprite;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class MouseCursor extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static AUTO: string;
        static ARROW: string;
        static BUTTON: string;
        static HAND: string;
        static IBEAM: string;
        static fromNumber(n: number): string;
        static toNumber(value: string): number;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class MouseCursorData extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        data: ASVector<any>;
        hotSpot: geom.Point;
        frameRate: number;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class Multitouch extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        inputMode: string;
        supportsTouchEvents: boolean;
        supportsGestureEvents: boolean;
        supportedGestures: ASVector<any>;
        maxTouchPoints: number;
        mapTouchToMouse: boolean;
    }
}
declare module Shumway.AVM2.AS.flash.ui {
    class MultitouchInputMode extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static NONE: string;
        static GESTURE: string;
        static TOUCH_POINT: string;
    }
}
declare module Shumway.AVM2.AS.flash.utils {
    class Endian extends ASNative {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor();
        static BIG_ENDIAN: string;
        static LITTLE_ENDIAN: string;
    }
}
declare module Shumway.AVM2.AS.flash.utils {
    interface IDataInput2 extends IDataInput {
    }
}
declare module Shumway.AVM2.AS.flash.utils {
    interface IDataOutput2 extends IDataOutput {
    }
}
declare module Shumway.AVM2.AS.flash.utils {
    interface IExternalizable {
        writeExternal: (output: IDataOutput) => void;
        readExternal: (input: IDataInput) => void;
    }
}
declare module Shumway.AVM2.AS.flash.utils {
    class Timer extends events.EventDispatcher {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        static dispatchingEnabled: boolean;
        constructor(delay: number, repeatCount?: number);
        _delay: number;
        _repeatCount: number;
        _iteration: number;
        _running: boolean;
        reset: () => void;
        start: () => void;
        tick: () => void;
        _interval: number;
        running: boolean;
        stop(): void;
        _start(delay: number, closure: ASFunction): void;
        _tick(): void;
    }
}
declare module Shumway.AVM2.AS.flash.utils {
    class SetIntervalTimer extends Timer {
        static classInitializer: any;
        static initializer: any;
        static classSymbols: string[];
        static instanceSymbols: string[];
        constructor(closure: ASFunction, delay: number, repeats: boolean, rest: any[]);
        static intervalArray: any[];
        static _clearInterval: (id: number) => void;
        reference: number;
        closure: ASFunction;
        rest: any[];
        onTimer: (event: events.Event) => void;
    }
}
declare module Shumway.AVM2.AS.flash.xml {
    class XMLNode extends ASNative {
        static initializer: any;
        constructor(type: number, value: string);
        static escapeXML(value: string): string;
        nodeType: number;
        previousSibling: XMLNode;
        nextSibling: XMLNode;
        parentNode: XMLNode;
        firstChild: XMLNode;
        lastChild: XMLNode;
        childNodes: any[];
        _childNodes: any[];
        attributes: ASObject;
        _attributes: ASObject;
        nodeName: string;
        nodeValue: string;
        init: (type: number, value: string) => void;
        hasChildNodes: () => boolean;
        cloneNode: (deep: boolean) => XMLNode;
        removeNode: () => void;
        insertBefore: (node: XMLNode, before: XMLNode) => void;
        appendChild: (node: XMLNode) => void;
        getNamespaceForPrefix: (prefix: string) => string;
        getPrefixForNamespace: (ns: string) => string;
        localName: string;
        prefix: string;
        namespaceURI: string;
    }
}
declare module Shumway.AVM2.AS.flash.xml {
    class XMLDocument extends XMLNode {
        static initializer: any;
        constructor(source?: string);
        xmlDecl: ASObject;
        docTypeDecl: ASObject;
        idMap: ASObject;
        ignoreWhite: boolean;
        createElement: (name: string) => XMLNode;
        createTextNode: (text: string) => XMLNode;
        parseXML: (source: string) => void;
    }
}
declare module Shumway.AVM2.AS.flash.xml {
    class XMLNodeType extends ASNative {
        static initializer: any;
        constructor();
    }
}
declare module Shumway.AVM2.AS.flash.xml {
    class XMLParser extends ASNative {
        static initializer: any;
        constructor();
        startParse(source: string, ignoreWhite: boolean): void;
        getNext(tag: XMLTag): number;
    }
}
declare module Shumway.AVM2.AS.flash.xml {
    class XMLTag extends ASNative {
        static initializer: any;
        constructor();
        type: number;
        empty: boolean;
        value: string;
        attrs: ASObject;
    }
}
declare module Shumway.AVM2.AS {
    function linkNatives(runtime: AVM2): void;
    function FlashUtilScript_getTimer(): number;
    function FlashNetScript_navigateToURL(request: any, window_: any): void;
}
