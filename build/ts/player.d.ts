/// <reference path="base.d.ts" />
/// <reference path="tools.d.ts" />
/// <reference path="swf.d.ts" />
/// <reference path="flash.d.ts" />
/// <reference path="../../src/flash/avm1.d.ts" />
declare module Shumway.Player {
    var timelineBuffer: Tools.Profiler.TimelineBuffer;
    var counter: Metrics.Counter;
    var writer: any;
    function enterTimeline(name: string, data?: any): void;
    function leaveTimeline(name: string, data?: any): void;
}
declare module Shumway {
    var playerOptions: any;
    var frameEnabledOption: any;
    var timerEnabledOption: any;
    var pumpEnabledOption: any;
    var pumpRateOption: any;
    var frameRateOption: any;
    var tracePlayerOption: any;
    var traceMouseEventOption: any;
    var frameRateMultiplierOption: any;
    var dontSkipFramesOption: any;
    var playAllSymbolsOption: any;
    var playSymbolOption: any;
    var playSymbolFrameDurationOption: any;
    var playSymbolCountOption: any;
}
declare module Shumway {
    class FrameScheduler {
        private static STATS_TO_REMEMBER;
        private static MAX_DRAWS_TO_SKIP;
        private static INTERVAL_PADDING_MS;
        private static SPEED_ADJUST_RATE;
        private _drawStats;
        private _drawStatsSum;
        private _drawStarted;
        private _drawsSkipped;
        private _expectedNextFrameAt;
        private _onTime;
        private _trackDelta;
        private _delta;
        private _onTimeDelta;
        constructor();
        shallSkipDraw: boolean;
        nextFrameIn: number;
        isOnTime: boolean;
        startFrame(frameRate: any): void;
        endFrame(): void;
        startDraw(): void;
        endDraw(): void;
        skipDraw(): void;
        setDelta(value: any): void;
        startTrackDelta(): void;
        endTrackDelta(): void;
    }
}
declare module Shumway.Remoting.Player {
    import flash = Shumway.AVM2.AS.flash;
    import Stage = flash.display.Stage;
    import Graphics = flash.display.Graphics;
    import NetStream = flash.net.NetStream;
    import display = flash.display;
    import Bounds = Shumway.Bounds;
    import IDataInput = Shumway.ArrayUtilities.IDataInput;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    class PlayerChannelSerializer {
        output: DataBuffer;
        outputAssets: any[];
        phase: RemotingPhase;
        roots: display.DisplayObject[];
        begin(displayObject: display.DisplayObject): void;
        remoteObjects(): void;
        remoteReferences(): void;
        writeDirtyDisplayObjects(displayObject: display.DisplayObject, clearDirtyDescendentsFlag?: boolean): void;
        writeStage(stage: Stage, currentMouseTarget: display.InteractiveObject): void;
        writeGraphics(graphics: Graphics): void;
        writeNetStream(netStream: NetStream, bounds: Bounds): void;
        writeBitmapData(bitmapData: display.BitmapData): void;
        writeTextContent(textContent: TextContent): void;
        writeClippedObjectsCount(displayObject: display.DisplayObject): void;
        writeUpdateFrame(displayObject: display.DisplayObject): void;
        writeDirtyAssets(displayObject: display.DisplayObject): void;
        writeDrawToBitmap(bitmapData: display.BitmapData, source: IRemotable, matrix?: flash.geom.Matrix, colorTransform?: flash.geom.ColorTransform, blendMode?: string, clipRect?: flash.geom.Rectangle, smoothing?: boolean): void;
        private _writeMatrix(matrix);
        private _writeRectangle(bounds);
        private _writeAsset(asset);
        private _writeFilters(filters);
        private _writeColorTransform(colorTransform);
        writeRequestBitmapData(bitmapData: display.BitmapData): void;
    }
    interface FocusEventData {
        type: FocusEventType;
    }
    class PlayerChannelDeserializer {
        input: IDataInput;
        inputAssets: any[];
        read(): any;
        private _readFocusEvent();
        private _readMouseEvent();
        private _readKeyboardEvent();
    }
}
declare module Shumway.Player {
    import flash = Shumway.AVM2.AS.flash;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import IExternalInterfaceService = Shumway.IExternalInterfaceService;
    import BitmapData = flash.display.BitmapData;
    import DisplayObject = flash.display.DisplayObject;
    import IBitmapDataSerializer = flash.display.IBitmapDataSerializer;
    import IAssetResolver = Timeline.IAssetResolver;
    import IFSCommandListener = flash.system.IFSCommandListener;
    import IVideoElementService = flash.net.IVideoElementService;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    import VideoPlaybackEvent = Shumway.Remoting.VideoPlaybackEvent;
    import DisplayParameters = Shumway.Remoting.DisplayParameters;
    class Player implements IBitmapDataSerializer, IFSCommandListener, IVideoElementService, IAssetResolver {
        private _stage;
        private _loader;
        private _loaderInfo;
        private _syncTimeout;
        private _frameTimeout;
        private _eventLoopIsRunning;
        private _rootInitialized;
        private _framesPlayed;
        private _writer;
        private _mouseEventDispatcher;
        private _keyboardEventDispatcher;
        private _videoEventListeners;
        private _pendingPromises;
        private _getNextAvailablePromiseId();
        externalCallback: (functionName: string, args: any[]) => any;
        defaultStageColor: number;
        movieParams: Map<string>;
        stageAlign: string;
        stageScale: string;
        displayParameters: DisplayParameters;
        private _lastPumpTime;
        private _isPageVisible;
        private _hasFocus;
        constructor();
        onSendUpdates(updates: DataBuffer, assets: DataBuffer[], async?: boolean): DataBuffer;
        private _shouldThrottleDownRendering();
        private _shouldThrottleDownFrameExecution();
        load(url: string, buffer?: ArrayBuffer): void;
        private createLoaderContext();
        processUpdates(updates: DataBuffer, assets: any[]): void;
        private _enterLoops();
        private _pumpDisplayListUpdates();
        syncDisplayObject(displayObject: DisplayObject, async?: boolean): DataBuffer;
        requestBitmapData(bitmapData: BitmapData): DataBuffer;
        drawToBitmap(bitmapData: BitmapData, source: Remoting.IRemotable, matrix?: flash.geom.Matrix, colorTransform?: flash.geom.ColorTransform, blendMode?: string, clipRect?: flash.geom.Rectangle, smoothing?: boolean): void;
        registerEventListener(id: number, listener: (eventType: VideoPlaybackEvent, data: any) => void): void;
        notifyVideoControl(id: number, eventType: VideoControlEvent, data: any): any;
        executeFSCommand(command: string, args: string): void;
        requestRendering(): void;
        private _pumpUpdates();
        private _leaveSyncLoop();
        private _getFrameInterval();
        private _enterEventLoop();
        private _eventLoopTick();
        private _tracePlayer();
        private _leaveEventLoop();
        private _playAllSymbols();
        processExternalCallback(request: any): void;
        processVideoEvent(id: number, eventType: VideoPlaybackEvent, data: any): void;
        processDisplayParameters(displayParameters: DisplayParameters): void;
        onExternalCommand(command: any): void;
        onFSCommand(command: string, args: string): void;
        onVideoControl(id: number, eventType: VideoControlEvent, data: any): any;
        onFrameProcessed(): void;
        registerFontOrImage(symbol: Timeline.EagerlyResolvedSymbol, data: any): void;
        protected registerFontOrImageImpl(symbol: Timeline.EagerlyResolvedSymbol, data: any): void;
        createExternalInterfaceService(): IExternalInterfaceService;
    }
}
declare module Shumway {
    import AVM2 = Shumway.AVM2.Runtime.AVM2;
    import ExecutionMode = Shumway.AVM2.Runtime.ExecutionMode;
    interface LibraryPathInfo {
        abcs: string;
        catalog: string;
    }
    function createAVM2(builtinPath: string, libraryPath: any, sysMode: ExecutionMode, appMode: ExecutionMode, next: (avm2: AVM2) => void): void;
}
declare module Shumway.Player.Window {
    import Player = Shumway.Player.Player;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    class WindowPlayer extends Player {
        private _window;
        private _parent;
        constructor(window: any, parent?: any);
        onSendUpdates(updates: DataBuffer, assets: DataBuffer[], async?: boolean): DataBuffer;
        onExternalCommand(command: any): void;
        onFSCommand(command: string, args: string): void;
        onVideoControl(id: number, eventType: VideoControlEvent, data: any): any;
        onFrameProcessed(): void;
        protected registerFontOrImageImpl(symbol: Timeline.EagerlyResolvedSymbol, data: any): void;
        private onWindowMessage(data, async);
    }
}
declare module Shumway.Player.Test {
    import Player = Shumway.Player.Player;
    import DataBuffer = Shumway.ArrayUtilities.DataBuffer;
    import VideoControlEvent = Shumway.Remoting.VideoControlEvent;
    class TestPlayer extends Player {
        private _worker;
        constructor();
        onSendUpdates(updates: DataBuffer, assets: DataBuffer[], async?: boolean): DataBuffer;
        onExternalCommand(command: any): void;
        onFSCommand(command: string, args: string): void;
        onVideoControl(id: number, eventType: VideoControlEvent, data: any): any;
        onFrameProcessed(): void;
        protected registerFontOrImageImpl(symbol: Timeline.EagerlyResolvedSymbol, data: any): any;
        private _onWorkerMessage(e);
        private _onSyncWorkerMessage(e);
    }
}
declare module Shumway.Player.Test {
    class FakeSyncWorker {
        static WORKER_PATH: string;
        private static _singelton;
        static instance: FakeSyncWorker;
        private _onmessageListeners;
        private _onsyncmessageListeners;
        constructor();
        addEventListener(type: string, listener: any, useCapture?: boolean): void;
        removeEventListener(type: string, listener: any, useCapture?: boolean): void;
        postMessage(message: any, ports?: any): any;
        postSyncMessage(message: any, ports?: any): any;
    }
}
