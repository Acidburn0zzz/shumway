var Shumway;
(function (Shumway) {
    var Player;
    (function (Player) {
        Player.timelineBuffer = new Shumway.Tools.Profiler.TimelineBuffer("Player");
        Player.counter = new Shumway.Metrics.Counter(!release);
        Player.writer = null;
        function enterTimeline(name, data) {
            Player.writer && Player.writer.enter(name);
            profile && Player.timelineBuffer && Player.timelineBuffer.enter(name, data);
        }
        Player.enterTimeline = enterTimeline;
        function leaveTimeline(name, data) {
            Player.writer && Player.writer.leave(name);
            profile && Player.timelineBuffer && Player.timelineBuffer.leave(name, data);
        }
        Player.leaveTimeline = leaveTimeline;
    })(Player = Shumway.Player || (Shumway.Player = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var OptionSet = Shumway.Options.OptionSet;
    var shumwayOptions = Shumway.Settings.shumwayOptions;
    Shumway.playerOptions = shumwayOptions.register(new OptionSet("Player Options"));
    Shumway.frameEnabledOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Enable Frame Execution", "boolean", true, "Enable frame execution."));
    Shumway.timerEnabledOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Enable Timers", "boolean", true, "Enable timer events."));
    Shumway.pumpEnabledOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Enable Pump", "boolean", true, "Enable display tree serialization."));
    Shumway.pumpRateOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Pump Rate", "number", 60, "Number of times / second that the display list is synchronized.", { range: { min: 1, max: 120, step: 1 } }));
    Shumway.frameRateOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Frame Rate", "number", 60, "Override a movie's frame rate, set to -1 to use the movies default frame rate.", { range: { min: -1, max: 120, step: 1 } }));
    Shumway.tracePlayerOption = Shumway.playerOptions.register(new Shumway.Options.Option("tp", "Trace Player", "number", 0, "Trace player every n frames.", { range: { min: 0, max: 512, step: 1 } }));
    Shumway.traceMouseEventOption = Shumway.playerOptions.register(new Shumway.Options.Option("tme", "Trace Mouse Events", "boolean", false, "Trace mouse events."));
    Shumway.frameRateMultiplierOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Frame Rate Multiplier", "number", 1, "Play frames at a faster rate.", { range: { min: 1, max: 16, step: 1 } }));
    Shumway.dontSkipFramesOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Disables Frame Skipping", "boolean", false, "Play all frames, e.g. no skipping frame during throttle."));
    Shumway.playAllSymbolsOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Play Symbols", "boolean", false, "Plays all SWF symbols automatically."));
    Shumway.playSymbolOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Play Symbol Number", "number", 0, "Select symbol by Id.", { range: { min: 0, max: 20000, step: 1 } }));
    Shumway.playSymbolFrameDurationOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Play Symbol Duration", "number", 0, "How many frames to play, 0 for all frames of the movie clip.", { range: { min: 0, max: 128, step: 1 } }));
    Shumway.playSymbolCountOption = Shumway.playerOptions.register(new Shumway.Options.Option("", "Play Symbol Count", "number", -1, "Select symbol count.", { range: { min: 0, max: 20000, step: 1 } }));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var FrameScheduler = (function () {
        function FrameScheduler() {
            this._expectedNextFrameAt = performance.now();
            this._drawStats = [];
            this._drawStatsSum = 0;
            this._drawStarted = 0;
            this._drawsSkipped = 0;
            this._expectedNextFrameAt = performance.now();
            this._onTime = true;
            this._trackDelta = false;
            this._delta = 0;
            this._onTimeDelta = 0;
        }
        Object.defineProperty(FrameScheduler.prototype, "shallSkipDraw", {
            get: function () {
                if (this._drawsSkipped >= FrameScheduler.MAX_DRAWS_TO_SKIP) {
                    return false;
                }
                var averageDraw = this._drawStats.length < FrameScheduler.STATS_TO_REMEMBER ? 0 : this._drawStatsSum / this._drawStats.length;
                var estimatedDrawEnd = performance.now() + averageDraw;
                return estimatedDrawEnd + FrameScheduler.INTERVAL_PADDING_MS > this._expectedNextFrameAt;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameScheduler.prototype, "nextFrameIn", {
            get: function () {
                return Math.max(0, this._expectedNextFrameAt - performance.now());
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FrameScheduler.prototype, "isOnTime", {
            get: function () {
                return this._onTime;
            },
            enumerable: true,
            configurable: true
        });
        FrameScheduler.prototype.startFrame = function (frameRate) {
            var interval = 1000 / frameRate;
            var adjustedInterval = interval;
            var delta = this._onTimeDelta + this._delta;
            if (delta !== 0) {
                if (delta < 0) {
                    adjustedInterval *= FrameScheduler.SPEED_ADJUST_RATE;
                }
                else if (delta > 0) {
                    adjustedInterval /= FrameScheduler.SPEED_ADJUST_RATE;
                }
                this._onTimeDelta += (interval - adjustedInterval);
            }
            this._expectedNextFrameAt += adjustedInterval;
            this._onTime = true;
        };
        FrameScheduler.prototype.endFrame = function () {
            var estimatedNextFrameStart = performance.now() + FrameScheduler.INTERVAL_PADDING_MS;
            if (estimatedNextFrameStart > this._expectedNextFrameAt) {
                if (this._trackDelta) {
                    this._onTimeDelta += (this._expectedNextFrameAt - estimatedNextFrameStart);
                    console.log(this._onTimeDelta);
                }
                this._expectedNextFrameAt = estimatedNextFrameStart;
                this._onTime = false;
            }
        };
        FrameScheduler.prototype.startDraw = function () {
            this._drawsSkipped = 0;
            this._drawStarted = performance.now();
        };
        FrameScheduler.prototype.endDraw = function () {
            var drawTime = performance.now() - this._drawStarted;
            this._drawStats.push(drawTime);
            this._drawStatsSum += drawTime;
            while (this._drawStats.length > FrameScheduler.STATS_TO_REMEMBER) {
                this._drawStatsSum -= this._drawStats.shift();
            }
        };
        FrameScheduler.prototype.skipDraw = function () {
            this._drawsSkipped++;
        };
        FrameScheduler.prototype.setDelta = function (value) {
            if (!this._trackDelta) {
                return;
            }
            this._delta = value;
        };
        FrameScheduler.prototype.startTrackDelta = function () {
            this._trackDelta = true;
        };
        FrameScheduler.prototype.endTrackDelta = function () {
            if (!this._trackDelta) {
                return;
            }
            this._trackDelta = false;
            this._delta = 0;
            this._onTimeDelta = 0;
        };
        FrameScheduler.STATS_TO_REMEMBER = 50;
        FrameScheduler.MAX_DRAWS_TO_SKIP = 2;
        FrameScheduler.INTERVAL_PADDING_MS = 4;
        FrameScheduler.SPEED_ADJUST_RATE = 0.9;
        return FrameScheduler;
    })();
    Shumway.FrameScheduler = FrameScheduler;
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var Remoting;
    (function (Remoting) {
        var Player;
        (function (Player) {
            var MessageTag = Shumway.Remoting.MessageTag;
            var MessageBits = Shumway.Remoting.MessageBits;
            var flash = Shumway.AVM2.AS.flash;
            var display = flash.display;
            var BitmapData = flash.display.BitmapData;
            var DisplayObjectFlags = flash.display.DisplayObjectFlags;
            var BlendMode = flash.display.BlendMode;
            var PixelSnapping = flash.display.PixelSnapping;
            var VisitorFlags = flash.display.VisitorFlags;
            var Point = flash.geom.Point;
            var Bounds = Shumway.Bounds;
            var MouseCursor = flash.ui.MouseCursor;
            var assert = Shumway.Debug.assert;
            var writer = Shumway.Player.writer;
            var PlayerChannelSerializer = (function () {
                function PlayerChannelSerializer() {
                    this.phase = 0 /* Objects */;
                    this.roots = null;
                }
                PlayerChannelSerializer.prototype.begin = function (displayObject) {
                    this.roots = [displayObject];
                };
                PlayerChannelSerializer.prototype.remoteObjects = function () {
                    this.phase = 0 /* Objects */;
                    var roots = this.roots;
                    for (var i = 0; i < roots.length; i++) {
                        Shumway.Player.enterTimeline("remoting objects");
                        this.writeDirtyDisplayObjects(roots[i]);
                        Shumway.Player.leaveTimeline("remoting objects");
                    }
                };
                PlayerChannelSerializer.prototype.remoteReferences = function () {
                    this.phase = 1 /* References */;
                    var roots = this.roots;
                    for (var i = 0; i < roots.length; i++) {
                        Shumway.Player.enterTimeline("remoting references");
                        this.writeDirtyDisplayObjects(roots[i], true);
                        Shumway.Player.leaveTimeline("remoting references");
                    }
                };
                PlayerChannelSerializer.prototype.writeDirtyDisplayObjects = function (displayObject, clearDirtyDescendentsFlag) {
                    if (clearDirtyDescendentsFlag === void 0) { clearDirtyDescendentsFlag = false; }
                    var self = this;
                    var roots = this.roots;
                    displayObject.visit(function (displayObject) {
                        if (displayObject._hasAnyFlags(DisplayObjectFlags.Dirty)) {
                            self.writeUpdateFrame(displayObject);
                            if (roots && displayObject.mask) {
                                var root = displayObject.mask._findFurthestAncestorOrSelf();
                                Shumway.ArrayUtilities.pushUnique(roots, root);
                            }
                        }
                        self.writeDirtyAssets(displayObject);
                        if (displayObject._hasFlags(536870912 /* DirtyDescendents */)) {
                            return 0 /* Continue */;
                        }
                        if (clearDirtyDescendentsFlag) {
                            displayObject._removeFlags(536870912 /* DirtyDescendents */);
                        }
                        return 2 /* Skip */;
                    }, 0 /* None */);
                };
                PlayerChannelSerializer.prototype.writeStage = function (stage, currentMouseTarget) {
                    writer && writer.writeLn("Sending Stage");
                    var serializer = this;
                    this.output.writeInt(104 /* UpdateStage */);
                    this.output.writeInt(stage._id);
                    this.output.writeInt(stage.color);
                    this._writeRectangle(new Bounds(0, 0, stage.stageWidth * 20, stage.stageHeight * 20));
                    this.output.writeInt(flash.display.StageAlign.toNumber(stage.align));
                    this.output.writeInt(flash.display.StageScaleMode.toNumber(stage.scaleMode));
                    this.output.writeInt(flash.display.StageDisplayState.toNumber(stage.displayState));
                    var cursor = flash.ui.Mouse.cursor;
                    if (currentMouseTarget) {
                        this.output.writeInt(currentMouseTarget._id);
                        if (cursor === MouseCursor.AUTO) {
                            var node = currentMouseTarget;
                            do {
                                if (flash.display.SimpleButton.isType(node) || (flash.display.Sprite.isType(node) && node.buttonMode) && currentMouseTarget.useHandCursor) {
                                    cursor = MouseCursor.BUTTON;
                                    break;
                                }
                                node = node._parent;
                            } while (node && node !== stage);
                        }
                    }
                    else {
                        this.output.writeInt(-1);
                    }
                    this.output.writeInt(MouseCursor.toNumber(cursor));
                };
                PlayerChannelSerializer.prototype.writeGraphics = function (graphics) {
                    if (graphics._isDirty) {
                        writer && writer.writeLn("Sending Graphics: " + graphics._id);
                        var textures = graphics.getUsedTextures();
                        var numTextures = textures.length;
                        for (var i = 0; i < numTextures; i++) {
                            textures[i] && this.writeBitmapData(textures[i]);
                        }
                        this.output.writeInt(101 /* UpdateGraphics */);
                        this.output.writeInt(graphics._id);
                        this.output.writeInt(-1);
                        this._writeRectangle(graphics._getContentBounds());
                        this._writeAsset(graphics.getGraphicsData().toPlainObject());
                        this.output.writeInt(numTextures);
                        for (var i = 0; i < numTextures; i++) {
                            this.output.writeInt(textures[i] ? textures[i]._id : -1);
                        }
                        graphics._isDirty = false;
                    }
                };
                PlayerChannelSerializer.prototype.writeNetStream = function (netStream, bounds) {
                    if (netStream._isDirty) {
                        writer && writer.writeLn("Sending NetStream: " + netStream._id);
                        this.output.writeInt(105 /* UpdateNetStream */);
                        this.output.writeInt(netStream._id);
                        this._writeRectangle(bounds);
                        this.output.writeUTF(netStream._getVideoStreamURL());
                        netStream._isDirty = false;
                    }
                };
                PlayerChannelSerializer.prototype.writeBitmapData = function (bitmapData) {
                    if (bitmapData._isDirty) {
                        writer && writer.writeLn("Sending BitmapData: " + bitmapData._id);
                        this.output.writeInt(102 /* UpdateBitmapData */);
                        this.output.writeInt(bitmapData._id);
                        this.output.writeInt(bitmapData._symbol ? bitmapData._symbol.id : -1);
                        this._writeRectangle(bitmapData._getContentBounds());
                        this.output.writeInt(bitmapData._type);
                        this._writeAsset(bitmapData.getDataBuffer().toPlainObject());
                        bitmapData._isDirty = false;
                    }
                };
                PlayerChannelSerializer.prototype.writeTextContent = function (textContent) {
                    if (textContent.flags & Shumway.TextContentFlags.Dirty) {
                        writer && writer.writeLn("Sending TextContent: " + textContent._id);
                        this.output.writeInt(103 /* UpdateTextContent */);
                        this.output.writeInt(textContent._id);
                        this.output.writeInt(-1);
                        this._writeRectangle(textContent.bounds);
                        this._writeMatrix(textContent.matrix || flash.geom.Matrix.FROZEN_IDENTITY_MATRIX);
                        this.output.writeInt(textContent.backgroundColor);
                        this.output.writeInt(textContent.borderColor);
                        this.output.writeInt(textContent.autoSize);
                        this.output.writeBoolean(textContent.wordWrap);
                        this.output.writeInt(textContent.scrollV);
                        this.output.writeInt(textContent.scrollH);
                        this._writeAsset(textContent.plainText);
                        this._writeAsset(textContent.textRunData.toPlainObject());
                        var coords = textContent.coords;
                        if (coords) {
                            var numCoords = coords.length;
                            this.output.writeInt(numCoords);
                            for (var i = 0; i < numCoords; i++) {
                                this.output.writeInt(coords[i]);
                            }
                        }
                        else {
                            this.output.writeInt(0);
                        }
                        textContent.flags &= ~Shumway.TextContentFlags.Dirty;
                    }
                };
                PlayerChannelSerializer.prototype.writeClippedObjectsCount = function (displayObject) {
                    if (displayObject._clipDepth >= 0 && displayObject._parent) {
                        var i = displayObject._parent.getChildIndex(displayObject);
                        var j = displayObject._parent.getClipDepthIndex(displayObject._clipDepth);
                        if (j - i < 0) {
                            this.output.writeInt(-1);
                            return;
                        }
                        for (var k = i + 1; k <= i; k++) {
                        }
                        this.output.writeInt(j - i);
                    }
                    else {
                        this.output.writeInt(-1);
                    }
                };
                PlayerChannelSerializer.prototype.writeUpdateFrame = function (displayObject) {
                    this.output.writeInt(100 /* UpdateFrame */);
                    this.output.writeInt(displayObject._id);
                    writer && writer.writeLn("Sending UpdateFrame: " + displayObject.debugName(true));
                    var hasMask = false;
                    var hasMatrix = displayObject._hasFlags(1048576 /* DirtyMatrix */);
                    var hasColorTransform = displayObject._hasFlags(67108864 /* DirtyColorTransform */);
                    var hasMiscellaneousProperties = displayObject._hasFlags(1073741824 /* DirtyMiscellaneousProperties */);
                    var video = null;
                    if (flash.media.Video.isType(displayObject)) {
                        video = displayObject;
                    }
                    var hasRemotableChildren = false;
                    if (this.phase === 1 /* References */) {
                        hasRemotableChildren = displayObject._hasAnyFlags(2097152 /* DirtyChildren */ | 4194304 /* DirtyGraphics */ | 16777216 /* DirtyBitmapData */ | 33554432 /* DirtyNetStream */ | 8388608 /* DirtyTextContent */);
                        hasMask = displayObject._hasFlags(134217728 /* DirtyMask */);
                    }
                    var bitmap = null;
                    if (display.Bitmap.isType(displayObject)) {
                        bitmap = displayObject;
                    }
                    var hasClip = displayObject._hasFlags(268435456 /* DirtyClipDepth */);
                    var hasBits = 0;
                    hasBits |= hasMatrix ? 1 /* HasMatrix */ : 0;
                    hasBits |= hasColorTransform ? 8 /* HasColorTransform */ : 0;
                    hasBits |= hasMask ? 64 /* HasMask */ : 0;
                    hasBits |= hasClip ? 128 /* HasClip */ : 0;
                    hasBits |= hasMiscellaneousProperties ? 32 /* HasMiscellaneousProperties */ : 0;
                    hasBits |= hasRemotableChildren ? 4 /* HasChildren */ : 0;
                    this.output.writeInt(hasBits);
                    if (hasMatrix) {
                        this._writeMatrix(displayObject._getMatrix());
                    }
                    if (hasColorTransform) {
                        this._writeColorTransform(displayObject._colorTransform);
                    }
                    if (hasMask) {
                        this.output.writeInt(displayObject.mask ? displayObject.mask._id : -1);
                    }
                    if (hasClip) {
                        this.writeClippedObjectsCount(displayObject);
                    }
                    if (hasMiscellaneousProperties) {
                        this.output.writeInt(displayObject._ratio);
                        this.output.writeInt(BlendMode.toNumber(displayObject._blendMode));
                        this._writeFilters(displayObject.filters);
                        this.output.writeBoolean(displayObject._hasFlags(1 /* Visible */));
                        this.output.writeBoolean(displayObject.cacheAsBitmap);
                        if (bitmap) {
                            this.output.writeInt(PixelSnapping.toNumber(bitmap.pixelSnapping));
                            this.output.writeInt(bitmap.smoothing ? 1 : 0);
                        }
                        else {
                            this.output.writeInt(PixelSnapping.toNumber(PixelSnapping.AUTO));
                            this.output.writeInt(1);
                        }
                    }
                    var graphics = displayObject._getGraphics();
                    var textContent = displayObject._getTextContent();
                    if (hasRemotableChildren) {
                        writer && writer.enter("Children: {");
                        if (bitmap) {
                            if (bitmap.bitmapData) {
                                this.output.writeInt(1);
                                this.output.writeInt(134217728 /* Asset */ | bitmap.bitmapData._id);
                            }
                            else {
                                this.output.writeInt(0);
                            }
                        }
                        else if (video) {
                            if (video._netStream) {
                                this.output.writeInt(1);
                                this.output.writeInt(134217728 /* Asset */ | video._netStream._id);
                            }
                            else {
                                this.output.writeInt(0);
                            }
                        }
                        else {
                            var count = (graphics || textContent) ? 1 : 0;
                            var children = displayObject._children;
                            if (children) {
                                count += children.length;
                            }
                            this.output.writeInt(count);
                            if (graphics) {
                                writer && writer.writeLn("Reference Graphics: " + graphics._id);
                                this.output.writeInt(134217728 /* Asset */ | graphics._id);
                            }
                            else if (textContent) {
                                writer && writer.writeLn("Reference TextContent: " + textContent._id);
                                this.output.writeInt(134217728 /* Asset */ | textContent._id);
                            }
                            if (children) {
                                for (var i = 0; i < children.length; i++) {
                                    writer && writer.writeLn("Reference DisplayObject: " + children[i].debugName());
                                    this.output.writeInt(children[i]._id);
                                    if (children[i]._clipDepth >= 0) {
                                        children[i]._setFlags(268435456 /* DirtyClipDepth */);
                                    }
                                }
                            }
                        }
                        writer && writer.leave("}");
                    }
                    if (this.phase === 1 /* References */) {
                        displayObject._removeFlags(DisplayObjectFlags.Dirty);
                    }
                };
                PlayerChannelSerializer.prototype.writeDirtyAssets = function (displayObject) {
                    var graphics = displayObject._getGraphics();
                    if (graphics) {
                        this.writeGraphics(graphics);
                        return;
                    }
                    var textContent = displayObject._getTextContent();
                    if (textContent) {
                        this.writeTextContent(textContent);
                        return;
                    }
                    var bitmap = null;
                    if (display.Bitmap.isType(displayObject)) {
                        bitmap = displayObject;
                        if (bitmap.bitmapData) {
                            this.writeBitmapData(bitmap.bitmapData);
                        }
                        return;
                    }
                    var video = null;
                    if (flash.media.Video.isType(displayObject)) {
                        video = displayObject;
                        if (video._netStream) {
                            this.writeNetStream(video._netStream, video._getContentBounds());
                        }
                        return;
                    }
                };
                PlayerChannelSerializer.prototype.writeDrawToBitmap = function (bitmapData, source, matrix, colorTransform, blendMode, clipRect, smoothing) {
                    if (matrix === void 0) { matrix = null; }
                    if (colorTransform === void 0) { colorTransform = null; }
                    if (blendMode === void 0) { blendMode = null; }
                    if (clipRect === void 0) { clipRect = null; }
                    if (smoothing === void 0) { smoothing = false; }
                    this.output.writeInt(200 /* DrawToBitmap */);
                    this.output.writeInt(bitmapData._id);
                    if (BitmapData.isType(source)) {
                        this.output.writeInt(134217728 /* Asset */ | source._id);
                    }
                    else {
                        this.output.writeInt(source._id);
                    }
                    var hasBits = 0;
                    hasBits |= matrix ? 1 /* HasMatrix */ : 0;
                    hasBits |= colorTransform ? 8 /* HasColorTransform */ : 0;
                    hasBits |= clipRect ? 16 /* HasClipRect */ : 0;
                    this.output.writeInt(hasBits);
                    if (matrix) {
                        this._writeMatrix(matrix);
                    }
                    if (colorTransform) {
                        this._writeColorTransform(colorTransform);
                    }
                    if (clipRect) {
                        this._writeRectangle(Bounds.FromRectangle(clipRect));
                    }
                    this.output.writeInt(BlendMode.toNumber(blendMode));
                    this.output.writeBoolean(smoothing);
                };
                PlayerChannelSerializer.prototype._writeMatrix = function (matrix) {
                    var output = this.output;
                    output.write6Floats(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
                };
                PlayerChannelSerializer.prototype._writeRectangle = function (bounds) {
                    var output = this.output;
                    output.write4Ints(bounds.xMin, bounds.yMin, bounds.width, bounds.height);
                };
                PlayerChannelSerializer.prototype._writeAsset = function (asset) {
                    this.output.writeInt(this.outputAssets.length);
                    this.outputAssets.push(asset);
                };
                PlayerChannelSerializer.prototype._writeFilters = function (filters) {
                    var count = 0;
                    for (var i = 0; i < filters.length; i++) {
                        if (flash.filters.BlurFilter.isType(filters[i]) || flash.filters.DropShadowFilter.isType(filters[i]) || flash.filters.GlowFilter.isType(filters[i])) {
                            count++;
                        }
                        else {
                            Shumway.Debug.somewhatImplemented(filters[i].toString());
                        }
                    }
                    this.output.writeInt(count);
                    for (var i = 0; i < filters.length; i++) {
                        var filter = filters[i];
                        if (flash.filters.BlurFilter.isType(filter)) {
                            var blurFilter = filter;
                            this.output.writeInt(0 /* Blur */);
                            this.output.writeFloat(blurFilter.blurX);
                            this.output.writeFloat(blurFilter.blurY);
                            this.output.writeInt(blurFilter.quality);
                        }
                        else if (flash.filters.DropShadowFilter.isType(filter)) {
                            var dropShadowFilter = filter;
                            this.output.writeInt(1 /* DropShadow */);
                            this.output.writeFloat(dropShadowFilter.alpha);
                            this.output.writeFloat(dropShadowFilter.angle);
                            this.output.writeFloat(dropShadowFilter.blurX);
                            this.output.writeFloat(dropShadowFilter.blurY);
                            this.output.writeInt(dropShadowFilter.color);
                            this.output.writeFloat(dropShadowFilter.distance);
                            this.output.writeBoolean(dropShadowFilter.hideObject);
                            this.output.writeBoolean(dropShadowFilter.inner);
                            this.output.writeBoolean(dropShadowFilter.knockout);
                            this.output.writeInt(dropShadowFilter.quality);
                            this.output.writeFloat(dropShadowFilter.strength);
                        }
                        else if (flash.filters.GlowFilter.isType(filter)) {
                            var glowFilter = filter;
                            this.output.writeInt(1 /* DropShadow */);
                            this.output.writeFloat(glowFilter.alpha);
                            this.output.writeFloat(0);
                            this.output.writeFloat(glowFilter.blurX);
                            this.output.writeFloat(glowFilter.blurY);
                            this.output.writeInt(glowFilter.color);
                            this.output.writeFloat(0);
                            this.output.writeBoolean(false);
                            this.output.writeBoolean(glowFilter.inner);
                            this.output.writeBoolean(glowFilter.knockout);
                            this.output.writeInt(glowFilter.quality);
                            this.output.writeFloat(glowFilter.strength);
                        }
                    }
                };
                PlayerChannelSerializer.prototype._writeColorTransform = function (colorTransform) {
                    var output = this.output;
                    var rM = colorTransform.redMultiplier;
                    var gM = colorTransform.greenMultiplier;
                    var bM = colorTransform.blueMultiplier;
                    var aM = colorTransform.alphaMultiplier;
                    var rO = colorTransform.redOffset;
                    var gO = colorTransform.greenOffset;
                    var bO = colorTransform.blueOffset;
                    var aO = colorTransform.alphaOffset;
                    var identityOffset = rO === gO && gO === bO && bO === aO && aO === 0;
                    var identityColorMultiplier = rM === gM && gM === bM && bM === 1;
                    if (identityOffset && identityColorMultiplier) {
                        if (aM === 1) {
                            output.writeInt(0 /* Identity */);
                        }
                        else {
                            output.writeInt(1 /* AlphaMultiplierOnly */);
                            output.writeFloat(aM);
                        }
                    }
                    else {
                        output.writeInt(2 /* All */);
                        output.writeFloat(rM);
                        output.writeFloat(gM);
                        output.writeFloat(bM);
                        output.writeFloat(aM);
                        output.writeInt(rO);
                        output.writeInt(gO);
                        output.writeInt(bO);
                        output.writeInt(aO);
                    }
                };
                PlayerChannelSerializer.prototype.writeRequestBitmapData = function (bitmapData) {
                    writer && writer.writeLn("Sending BitmapData Request");
                    this.output.writeInt(106 /* RequestBitmapData */);
                    this.output.writeInt(bitmapData._id);
                };
                return PlayerChannelSerializer;
            })();
            Player.PlayerChannelSerializer = PlayerChannelSerializer;
            var PlayerChannelDeserializer = (function () {
                function PlayerChannelDeserializer() {
                }
                PlayerChannelDeserializer.prototype.read = function () {
                    var input = this.input;
                    var tag = input.readInt();
                    switch (tag) {
                        case 300 /* MouseEvent */:
                            return this._readMouseEvent();
                        case 301 /* KeyboardEvent */:
                            return this._readKeyboardEvent();
                        case 302 /* FocusEvent */:
                            return this._readFocusEvent();
                    }
                    release || assert(false, 'Unknown MessageReader tag: ' + tag);
                };
                PlayerChannelDeserializer.prototype._readFocusEvent = function () {
                    var input = this.input;
                    var typeId = input.readInt();
                    return {
                        tag: 302 /* FocusEvent */,
                        type: typeId
                    };
                };
                PlayerChannelDeserializer.prototype._readMouseEvent = function () {
                    var input = this.input;
                    var typeId = input.readInt();
                    var type = Shumway.Remoting.MouseEventNames[typeId];
                    var pX = input.readFloat();
                    var pY = input.readFloat();
                    var buttons = input.readInt();
                    var flags = input.readInt();
                    return {
                        tag: 300 /* MouseEvent */,
                        type: type,
                        point: new Point(pX, pY),
                        ctrlKey: !!(flags & 1 /* CtrlKey */),
                        altKey: !!(flags & 2 /* AltKey */),
                        shiftKey: !!(flags & 4 /* ShiftKey */),
                        buttons: buttons
                    };
                };
                PlayerChannelDeserializer.prototype._readKeyboardEvent = function () {
                    var input = this.input;
                    var typeId = input.readInt();
                    var type = Shumway.Remoting.KeyboardEventNames[typeId];
                    var keyCode = input.readInt();
                    var charCode = input.readInt();
                    var location = input.readInt();
                    var flags = input.readInt();
                    return {
                        tag: 301 /* KeyboardEvent */,
                        type: type,
                        keyCode: keyCode,
                        charCode: charCode,
                        location: location,
                        ctrlKey: !!(flags & 1 /* CtrlKey */),
                        altKey: !!(flags & 2 /* AltKey */),
                        shiftKey: !!(flags & 4 /* ShiftKey */)
                    };
                };
                return PlayerChannelDeserializer;
            })();
            Player.PlayerChannelDeserializer = PlayerChannelDeserializer;
        })(Player = Remoting.Player || (Remoting.Player = {}));
    })(Remoting = Shumway.Remoting || (Shumway.Remoting = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var Player;
    (function (_Player) {
        var assert = Shumway.Debug.assert;
        var somewhatImplemented = Shumway.Debug.somewhatImplemented;
        var flash = Shumway.AVM2.AS.flash;
        var DataBuffer = Shumway.ArrayUtilities.DataBuffer;
        var AVM2 = Shumway.AVM2.Runtime.AVM2;
        var Event = flash.events.Event;
        var DisplayObject = flash.display.DisplayObject;
        var EventDispatcher = flash.events.EventDispatcher;
        var MovieClip = flash.display.MovieClip;
        var Loader = flash.display.Loader;
        var MouseEventDispatcher = flash.ui.MouseEventDispatcher;
        var KeyboardEventDispatcher = flash.ui.KeyboardEventDispatcher;
        var MessageTag = Shumway.Remoting.MessageTag;
        var Player = (function () {
            function Player() {
                this._framesPlayed = 0;
                this._videoEventListeners = [];
                this._pendingPromises = [];
                this.externalCallback = null;
                this._lastPumpTime = 0;
                this._isPageVisible = true;
                this._hasFocus = true;
                this._keyboardEventDispatcher = new KeyboardEventDispatcher();
                this._mouseEventDispatcher = new MouseEventDispatcher();
                this._writer = new Shumway.IndentingWriter();
                AVM2.instance.globals['Shumway.Player.Utils'] = this;
            }
            Player.prototype._getNextAvailablePromiseId = function () {
                var length = this._pendingPromises.length;
                for (var i = 0; i < length; i++) {
                    if (!this._pendingPromises[i]) {
                        return i;
                    }
                }
                return length;
            };
            Player.prototype.onSendUpdates = function (updates, assets, async) {
                if (async === void 0) { async = true; }
                throw new Error('This method is abstract');
                return null;
            };
            Player.prototype._shouldThrottleDownRendering = function () {
                return !this._isPageVisible;
            };
            Player.prototype._shouldThrottleDownFrameExecution = function () {
                return !this._isPageVisible;
            };
            Player.prototype.load = function (url, buffer) {
                release || assert(!this._loader, "Can't load twice.");
                var self = this;
                var stage = this._stage = new flash.display.Stage();
                var loader = this._loader = flash.display.Loader.getRootLoader();
                var loaderInfo = this._loaderInfo = loader.contentLoaderInfo;
                if (Shumway.playAllSymbolsOption.value) {
                    this._playAllSymbols();
                    loaderInfo._allowCodeExecution = false;
                }
                else {
                    var startPromise = loader._startPromise;
                    startPromise.then(function () {
                        if (loaderInfo.actionScriptVersion === flash.display.ActionScriptVersion.ACTIONSCRIPT2) {
                            var avm1Context = loaderInfo._avm1Context;
                            avm1Context.globals.Key._bind(stage, avm1Context);
                            avm1Context.globals.Mouse._bind(stage, avm1Context);
                            MovieClip.frameNavigationModel = 1 /* SWF1 */;
                        }
                        else if (loaderInfo.swfVersion < 10) {
                            MovieClip.frameNavigationModel = 2 /* SWF9 */;
                        }
                        var bgcolor = self.defaultStageColor !== undefined ? self.defaultStageColor : loaderInfo._colorRGBA;
                        var root = loader.content;
                        release && assert(root, 'root must exists at this point');
                        stage._loaderInfo = loaderInfo;
                        stage.align = self.stageAlign || '';
                        stage.scaleMode = self.stageScale || 'showall';
                        stage.frameRate = loaderInfo.frameRate;
                        stage.setStageWidth(loaderInfo.width);
                        stage.setStageHeight(loaderInfo.height);
                        stage.setStageColor(Shumway.ColorUtilities.RGBAToARGB(bgcolor));
                        stage.addTimelineObjectAtDepth(root, 0);
                        if (self.displayParameters) {
                            self.processDisplayParameters(self.displayParameters);
                        }
                        self._enterLoops();
                    }, null);
                }
                var context = this.createLoaderContext();
                if (buffer) {
                    var symbol = Shumway.Timeline.BinarySymbol.FromData({ id: -1, data: buffer });
                    var byteArray = symbol.symbolClass.initializeFrom(symbol);
                    symbol.symbolClass.instanceConstructorNoInitialize.call(byteArray);
                    this._loader.loadBytes(byteArray, context);
                }
                else {
                    this._loader.load(new flash.net.URLRequest(url), context);
                }
            };
            Player.prototype.createLoaderContext = function () {
                var loaderContext = new flash.system.LoaderContext();
                if (this.movieParams) {
                    var parameters = {};
                    for (var i in this.movieParams) {
                        parameters.asSetPublicProperty(i, this.movieParams[i]);
                    }
                    loaderContext.parameters = parameters;
                }
                return loaderContext;
            };
            Player.prototype.processUpdates = function (updates, assets) {
                var deserializer = new Shumway.Remoting.Player.PlayerChannelDeserializer();
                var FocusEventType = Shumway.Remoting.FocusEventType;
                deserializer.input = updates;
                deserializer.inputAssets = assets;
                var message = deserializer.read();
                switch (message.tag) {
                    case 301 /* KeyboardEvent */:
                        var target = this._stage.focus ? this._stage.focus : this._stage;
                        this._keyboardEventDispatcher.target = target;
                        this._keyboardEventDispatcher.dispatchKeyboardEvent(message);
                        break;
                    case 300 /* MouseEvent */:
                        this._mouseEventDispatcher.stage = this._stage;
                        var target = this._mouseEventDispatcher.handleMouseEvent(message);
                        if (Shumway.traceMouseEventOption.value) {
                            this._writer.writeLn("Mouse Event: type: " + message.type + ", point: " + message.point + ", target: " + target + (target ? ", name: " + target._name : ""));
                            if (message.type === "click" && target) {
                                target.debugTrace();
                            }
                        }
                        break;
                    case 302 /* FocusEvent */:
                        var focusType = message.type;
                        switch (focusType) {
                            case 0 /* DocumentHidden */:
                                this._isPageVisible = false;
                                break;
                            case 1 /* DocumentVisible */:
                                this._isPageVisible = true;
                                break;
                            case 2 /* WindowBlur */:
                                this._hasFocus = false;
                                break;
                            case 3 /* WindowFocus */:
                                EventDispatcher.broadcastEventDispatchQueue.dispatchEvent(Event.getBroadcastInstance(Event.ACTIVATE));
                                this._hasFocus = true;
                                break;
                        }
                        break;
                }
            };
            Player.prototype._enterLoops = function () {
                this._enterEventLoop();
            };
            Player.prototype._pumpDisplayListUpdates = function () {
                this.syncDisplayObject(this._stage);
            };
            Player.prototype.syncDisplayObject = function (displayObject, async) {
                if (async === void 0) { async = true; }
                var updates = new DataBuffer();
                var assets = [];
                var serializer = new Shumway.Remoting.Player.PlayerChannelSerializer();
                serializer.output = updates;
                serializer.outputAssets = assets;
                if (flash.display.Stage.isType(displayObject)) {
                    serializer.writeStage(displayObject, this._mouseEventDispatcher.currentTarget);
                }
                serializer.begin(displayObject);
                serializer.remoteObjects();
                serializer.remoteReferences();
                updates.writeInt(0 /* EOF */);
                _Player.enterTimeline("remoting assets");
                var output = this.onSendUpdates(updates, assets, async);
                _Player.leaveTimeline("remoting assets");
                return output;
            };
            Player.prototype.requestBitmapData = function (bitmapData) {
                var output = new DataBuffer();
                var assets = [];
                var serializer = new Shumway.Remoting.Player.PlayerChannelSerializer();
                serializer.output = output;
                serializer.outputAssets = assets;
                serializer.writeRequestBitmapData(bitmapData);
                output.writeInt(0 /* EOF */);
                return this.onSendUpdates(output, assets, false);
            };
            Player.prototype.drawToBitmap = function (bitmapData, source, matrix, colorTransform, blendMode, clipRect, smoothing) {
                if (matrix === void 0) { matrix = null; }
                if (colorTransform === void 0) { colorTransform = null; }
                if (blendMode === void 0) { blendMode = null; }
                if (clipRect === void 0) { clipRect = null; }
                if (smoothing === void 0) { smoothing = false; }
                var updates = new DataBuffer();
                var assets = [];
                var serializer = new Shumway.Remoting.Player.PlayerChannelSerializer();
                serializer.output = updates;
                serializer.outputAssets = assets;
                serializer.writeBitmapData(bitmapData);
                if (flash.display.BitmapData.isType(source)) {
                    serializer.writeBitmapData(source);
                }
                else {
                    var displayObject = source;
                    serializer.begin(displayObject);
                    serializer.remoteObjects();
                    serializer.remoteReferences();
                }
                serializer.writeDrawToBitmap(bitmapData, source, matrix, colorTransform, blendMode, clipRect, smoothing);
                updates.writeInt(0 /* EOF */);
                _Player.enterTimeline("sendUpdates");
                this.onSendUpdates(updates, assets, false);
                _Player.leaveTimeline("sendUpdates");
            };
            Player.prototype.registerEventListener = function (id, listener) {
                this._videoEventListeners[id] = listener;
            };
            Player.prototype.notifyVideoControl = function (id, eventType, data) {
                return this.onVideoControl(id, eventType, data);
            };
            Player.prototype.executeFSCommand = function (command, args) {
                switch (command) {
                    case 'quit':
                        this._leaveEventLoop();
                        break;
                    default:
                        somewhatImplemented('FSCommand ' + command);
                }
                this.onFSCommand(command, args);
            };
            Player.prototype.requestRendering = function () {
                this._pumpDisplayListUpdates();
            };
            Player.prototype._pumpUpdates = function () {
                if (!Shumway.dontSkipFramesOption.value) {
                    if (this._shouldThrottleDownRendering()) {
                        return;
                    }
                    var timeSinceLastPump = performance.now() - this._lastPumpTime;
                    if (timeSinceLastPump < (1000 / Shumway.pumpRateOption.value)) {
                        return;
                    }
                }
                _Player.enterTimeline("pump");
                if (Shumway.pumpEnabledOption.value) {
                    this._pumpDisplayListUpdates();
                    this._lastPumpTime = performance.now();
                }
                _Player.leaveTimeline("pump");
            };
            Player.prototype._leaveSyncLoop = function () {
                release || assert(this._frameTimeout > -1);
                clearInterval(this._frameTimeout);
            };
            Player.prototype._getFrameInterval = function () {
                var frameRate = Shumway.frameRateOption.value;
                if (frameRate < 0) {
                    frameRate = this._stage.frameRate;
                }
                return Math.floor(1000 / frameRate);
            };
            Player.prototype._enterEventLoop = function () {
                this._eventLoopIsRunning = true;
                this._eventLoopTick = this._eventLoopTick.bind(this);
                this._eventLoopTick();
            };
            Player.prototype._eventLoopTick = function () {
                var runFrameScripts = !Shumway.playAllSymbolsOption.value;
                var dontSkipFrames = Shumway.dontSkipFramesOption.value;
                this._frameTimeout = setTimeout(this._eventLoopTick, this._getFrameInterval());
                if (!dontSkipFrames && (!Shumway.frameEnabledOption.value && runFrameScripts || this._shouldThrottleDownFrameExecution())) {
                    return;
                }
                DisplayObject._stage = this._stage;
                for (var i = 0; i < Shumway.frameRateMultiplierOption.value; i++) {
                    _Player.enterTimeline("eventLoop");
                    var start = performance.now();
                    DisplayObject.performFrameNavigation(true, runFrameScripts);
                    _Player.counter.count("performFrameNavigation", 1, performance.now() - start);
                    this._framesPlayed++;
                    Loader.progress();
                    if (Shumway.tracePlayerOption.value > 0 && (this._framesPlayed % Shumway.tracePlayerOption.value === 0)) {
                        this._tracePlayer();
                    }
                    _Player.leaveTimeline("eventLoop");
                }
                if (this._rootInitialized) {
                    this._stage.render();
                }
                else {
                    this._rootInitialized = true;
                }
                this._pumpUpdates();
                this.onFrameProcessed();
            };
            Player.prototype._tracePlayer = function () {
                var writer = this._writer;
                writer.enter("Frame: " + this._framesPlayed);
                Shumway.AVM2.counter.traceSorted(writer, true);
                Shumway.AVM2.counter.clear();
                Shumway.Player.counter.traceSorted(writer, true);
                Shumway.Player.counter.clear();
                writer.writeLn("advancableInstances: " + flash.display.DisplayObject._advancableInstances.length);
                writer.outdent();
            };
            Player.prototype._leaveEventLoop = function () {
                release || assert(this._eventLoopIsRunning);
                clearTimeout(this._frameTimeout);
                this._eventLoopIsRunning = false;
            };
            Player.prototype._playAllSymbols = function () {
                var stage = this._stage;
                var loader = this._loader;
                var loaderInfo = this._loaderInfo;
                var self = this;
                loaderInfo.addEventListener(flash.events.ProgressEvent.PROGRESS, function onProgress() {
                    var root = loader.content;
                    if (!root) {
                        return;
                    }
                    loaderInfo.removeEventListener(flash.events.ProgressEvent.PROGRESS, onProgress);
                    self._enterLoops();
                });
                loaderInfo.addEventListener(flash.events.Event.COMPLETE, function onProgress() {
                    stage.setStageWidth(1024);
                    stage.setStageHeight(1024);
                    var symbols = [];
                    loaderInfo._dictionary.forEach(function (symbol, key) {
                        if (symbol instanceof Shumway.Timeline.DisplaySymbol) {
                            symbols.push(symbol);
                        }
                    });
                    function show(symbol) {
                        flash.display.DisplayObject.reset();
                        flash.display.MovieClip.reset();
                        var symbolInstance = symbol.symbolClass.initializeFrom(symbol);
                        symbol.symbolClass.instanceConstructorNoInitialize.call(symbolInstance);
                        if (symbol instanceof flash.display.BitmapSymbol) {
                            symbolInstance = new flash.display.Bitmap(symbolInstance);
                        }
                        while (stage.numChildren > 0) {
                            stage.removeChildAt(0);
                        }
                        stage.addChild(symbolInstance);
                    }
                    var nextSymbolIndex = 0;
                    function showNextSymbol() {
                        var symbol;
                        if (Shumway.playSymbolOption.value > 0) {
                            symbol = loaderInfo.getSymbolById(Shumway.playSymbolOption.value);
                            if (symbol instanceof Shumway.Timeline.DisplaySymbol) {
                            }
                            else {
                                symbol = null;
                            }
                        }
                        else {
                            symbol = symbols[nextSymbolIndex++];
                            if (nextSymbolIndex === symbols.length) {
                                nextSymbolIndex = 0;
                            }
                            if (Shumway.playSymbolCountOption.value >= 0 && nextSymbolIndex > Shumway.playSymbolCountOption.value) {
                                nextSymbolIndex = 0;
                            }
                        }
                        var frames = 1;
                        if (symbol && symbol.id > 0) {
                            show(symbol);
                            if (symbol instanceof flash.display.SpriteSymbol) {
                                frames = symbol.numFrames;
                            }
                        }
                        if (Shumway.playSymbolFrameDurationOption.value > 0) {
                            frames = Shumway.playSymbolFrameDurationOption.value;
                        }
                        setTimeout(showNextSymbol, self._getFrameInterval() * frames);
                    }
                    setTimeout(showNextSymbol, self._getFrameInterval());
                });
            };
            Player.prototype.processExternalCallback = function (request) {
                if (!this.externalCallback) {
                    return;
                }
                try {
                    request.result = this.externalCallback(request.functionName, request.args);
                }
                catch (e) {
                    request.error = e.message;
                }
            };
            Player.prototype.processVideoEvent = function (id, eventType, data) {
                var listener = this._videoEventListeners[id];
                Shumway.Debug.assert(listener, 'Video event listener is not found');
                listener(eventType, data);
            };
            Player.prototype.processDisplayParameters = function (displayParameters) {
                this._stage.setStageContainerSize(displayParameters.stageWidth, displayParameters.stageHeight, displayParameters.pixelRatio);
            };
            Player.prototype.onExternalCommand = function (command) {
                throw new Error('This method is abstract');
            };
            Player.prototype.onFSCommand = function (command, args) {
                throw new Error('This method is abstract');
            };
            Player.prototype.onVideoControl = function (id, eventType, data) {
                throw new Error('This method is abstract');
            };
            Player.prototype.onFrameProcessed = function () {
                throw new Error('This method is abstract');
            };
            Player.prototype.registerFontOrImage = function (symbol, data) {
                release || assert(symbol.syncId);
                symbol.resolveAssetPromise = new Shumway.PromiseWrapper();
                this.registerFontOrImageImpl(symbol, data);
                if (data.type === 'font' && inFirefox) {
                    symbol.ready = true;
                }
                else {
                    symbol.resolveAssetPromise.then(symbol.resolveAssetCallback, null);
                }
            };
            Player.prototype.registerFontOrImageImpl = function (symbol, data) {
                throw new Error('This method is abstract');
            };
            Player.prototype.createExternalInterfaceService = function () {
                var isEnabled;
                var player = this;
                return {
                    get enabled() {
                        if (isEnabled === undefined) {
                            var cmd = { action: 'isEnabled' };
                            player.onExternalCommand(cmd);
                            isEnabled = cmd.result;
                        }
                        return isEnabled;
                    },
                    initJS: function (callback) {
                        player.externalCallback = callback;
                        var cmd = { action: 'initJS' };
                        player.onExternalCommand(cmd);
                    },
                    registerCallback: function (functionName) {
                        var cmd = { action: 'register', functionName: functionName, remove: false };
                        player.onExternalCommand(cmd);
                    },
                    unregisterCallback: function (functionName) {
                        var cmd = { action: 'register', functionName: functionName, remove: true };
                        player.onExternalCommand(cmd);
                    },
                    eval: function (expression) {
                        var cmd = { action: 'eval', expression: expression };
                        player.onExternalCommand(cmd);
                        return cmd.result;
                    },
                    call: function (request) {
                        var cmd = { action: 'call', request: request };
                        player.onExternalCommand(cmd);
                        return cmd.result;
                    },
                    getId: function () {
                        var cmd = { action: 'getId' };
                        player.onExternalCommand(cmd);
                        return cmd.result;
                    }
                };
            };
            return Player;
        })();
        _Player.Player = Player;
    })(Player = Shumway.Player || (Shumway.Player = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var BinaryFileReader = Shumway.BinaryFileReader;
    var AbcFile = Shumway.AVM2.ABC.AbcFile;
    var AVM2 = Shumway.AVM2.Runtime.AVM2;
    var assert = Shumway.Debug.assert;
    function createAVM2(builtinPath, libraryPath, sysMode, appMode, next) {
        var avm2;
        release || assert(builtinPath);
        new BinaryFileReader(builtinPath).readAll(null, function (buffer) {
            AVM2.initialize(sysMode, appMode);
            avm2 = AVM2.instance;
            Shumway.AVM2.AS.linkNatives(avm2);
            console.time("Execute builtin.abc");
            avm2.builtinsLoaded = false;
            avm2.systemDomain.executeAbc(new AbcFile(new Uint8Array(buffer), "builtin.abc"));
            avm2.builtinsLoaded = true;
            console.timeEnd("Execute builtin.abc");
            if (typeof libraryPath === 'string') {
                new BinaryFileReader(libraryPath).readAll(null, function (buffer) {
                    avm2.systemDomain.executeAbc(new AbcFile(new Uint8Array(buffer), libraryPath));
                    next(avm2);
                });
                return;
            }
            var libraryPathInfo = libraryPath;
            if (!AVM2.isPlayerglobalLoaded()) {
                AVM2.loadPlayerglobal(libraryPathInfo.abcs, libraryPathInfo.catalog).then(function () {
                    next(avm2);
                });
            }
        });
    }
    Shumway.createAVM2 = createAVM2;
})(Shumway || (Shumway = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Shumway;
(function (Shumway) {
    var Player;
    (function (Player) {
        var Window;
        (function (Window) {
            var Player = Shumway.Player.Player;
            var DataBuffer = Shumway.ArrayUtilities.DataBuffer;
            var WindowPlayer = (function (_super) {
                __extends(WindowPlayer, _super);
                function WindowPlayer(window, parent) {
                    _super.call(this);
                    this._window = window;
                    this._parent = parent || window.parent;
                    this._window.addEventListener('message', function (e) {
                        this.onWindowMessage(e.data, true);
                    }.bind(this));
                    this._window.addEventListener('syncmessage', function (e) {
                        this.onWindowMessage(e.detail, false);
                    }.bind(this));
                }
                WindowPlayer.prototype.onSendUpdates = function (updates, assets, async) {
                    if (async === void 0) { async = true; }
                    var bytes = updates.getBytes();
                    var message = {
                        type: 'player',
                        updates: bytes,
                        assets: assets,
                        result: undefined
                    };
                    var transferList = [bytes.buffer];
                    if (!async) {
                        var event = this._parent.document.createEvent('CustomEvent');
                        event.initCustomEvent('syncmessage', false, false, message);
                        this._parent.dispatchEvent(event);
                        var result = message.result;
                        return DataBuffer.FromPlainObject(result);
                    }
                    this._parent.postMessage(message, '*', transferList);
                    return null;
                };
                WindowPlayer.prototype.onExternalCommand = function (command) {
                    var event = this._parent.document.createEvent('CustomEvent');
                    event.initCustomEvent('syncmessage', false, false, {
                        type: 'external',
                        request: command
                    });
                    this._parent.dispatchEvent(event);
                };
                WindowPlayer.prototype.onFSCommand = function (command, args) {
                    this._parent.postMessage({
                        type: 'fscommand',
                        command: command,
                        args: args
                    }, '*');
                };
                WindowPlayer.prototype.onVideoControl = function (id, eventType, data) {
                    var event = this._parent.document.createEvent('CustomEvent');
                    event.initCustomEvent('syncmessage', false, false, {
                        type: 'videoControl',
                        id: id,
                        eventType: eventType,
                        data: data,
                        result: undefined
                    });
                    this._parent.dispatchEvent(event);
                    return event.detail.result;
                };
                WindowPlayer.prototype.onFrameProcessed = function () {
                    this._parent.postMessage({
                        type: 'frame'
                    }, '*');
                };
                WindowPlayer.prototype.registerFontOrImageImpl = function (symbol, data) {
                    var event = this._parent.document.createEvent('CustomEvent');
                    event.initCustomEvent('syncmessage', false, false, {
                        type: 'registerFontOrImage',
                        syncId: symbol.syncId,
                        symbolId: symbol.id,
                        assetType: data.type,
                        data: data,
                        resolve: symbol.resolveAssetPromise.resolve
                    });
                    this._parent.dispatchEvent(event);
                };
                WindowPlayer.prototype.onWindowMessage = function (data, async) {
                    if (typeof data === 'object' && data !== null) {
                        switch (data.type) {
                            case 'gfx':
                                var DataBuffer = Shumway.ArrayUtilities.DataBuffer;
                                var updates = DataBuffer.FromArrayBuffer(data.updates.buffer);
                                this.processUpdates(updates, data.assets);
                                break;
                            case 'externalCallback':
                                this.processExternalCallback(data.request);
                                break;
                            case 'videoPlayback':
                                this.processVideoEvent(data.id, data.eventType, data.data);
                                break;
                            case 'displayParameters':
                                this.processDisplayParameters(data.params);
                                break;
                            case 'options':
                                Shumway.Settings.setSettings(data.settings);
                                break;
                            case 'timeline':
                                switch (data.request) {
                                    case 'AVM2':
                                        if (data.cmd === 'clear') {
                                            Shumway.AVM2.timelineBuffer.reset();
                                            break;
                                        }
                                        this._parent.postMessage({
                                            type: 'timelineResponse',
                                            request: data.request,
                                            timeline: Shumway.AVM2.timelineBuffer
                                        }, '*');
                                        break;
                                    case 'Player':
                                        if (data.cmd === 'clear') {
                                            Shumway.Player.timelineBuffer.reset();
                                            break;
                                        }
                                        this._parent.postMessage({
                                            type: 'timelineResponse',
                                            request: data.request,
                                            timeline: Shumway.Player.timelineBuffer
                                        }, '*');
                                        break;
                                    case 'SWF':
                                        if (data.cmd === 'clear') {
                                            Shumway.SWF.timelineBuffer.reset();
                                            break;
                                        }
                                        this._parent.postMessage({
                                            type: 'timelineResponse',
                                            request: data.request,
                                            timeline: Shumway.SWF.timelineBuffer
                                        }, '*');
                                        break;
                                }
                                break;
                        }
                    }
                };
                return WindowPlayer;
            })(Player);
            Window.WindowPlayer = WindowPlayer;
        })(Window = Player.Window || (Player.Window = {}));
    })(Player = Shumway.Player || (Shumway.Player = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var Player;
    (function (Player) {
        var Test;
        (function (Test) {
            var Player = Shumway.Player.Player;
            var DataBuffer = Shumway.ArrayUtilities.DataBuffer;
            var TestPlayer = (function (_super) {
                __extends(TestPlayer, _super);
                function TestPlayer() {
                    _super.call(this);
                    this._worker = Shumway.Player.Test.FakeSyncWorker.instance;
                    this._worker.addEventListener('message', this._onWorkerMessage.bind(this));
                    this._worker.addEventListener('syncmessage', this._onSyncWorkerMessage.bind(this));
                }
                TestPlayer.prototype.onSendUpdates = function (updates, assets, async) {
                    if (async === void 0) { async = true; }
                    var bytes = updates.getBytes();
                    var message = {
                        type: 'player',
                        updates: bytes,
                        assets: assets
                    };
                    var transferList = [bytes.buffer];
                    if (!async) {
                        var result = this._worker.postSyncMessage(message, transferList);
                        return DataBuffer.FromPlainObject(result);
                    }
                    this._worker.postMessage(message, transferList);
                    return null;
                };
                TestPlayer.prototype.onExternalCommand = function (command) {
                    this._worker.postSyncMessage({
                        type: 'external',
                        command: command
                    });
                };
                TestPlayer.prototype.onFSCommand = function (command, args) {
                    this._worker.postMessage({
                        type: 'fscommand',
                        command: command,
                        args: args
                    });
                };
                TestPlayer.prototype.onVideoControl = function (id, eventType, data) {
                    return this._worker.postSyncMessage({
                        type: 'videoControl',
                        id: id,
                        eventType: eventType,
                        data: data
                    });
                };
                TestPlayer.prototype.onFrameProcessed = function () {
                    this._worker.postMessage({
                        type: 'frame'
                    });
                };
                TestPlayer.prototype.registerFontOrImageImpl = function (symbol, data) {
                    var message = {
                        type: 'registerFontOrImage',
                        syncId: symbol.syncId,
                        symbolId: symbol.id,
                        assetType: data.type,
                        data: data,
                        resolve: symbol.resolveAssetPromise.resolve
                    };
                    return this._worker.postSyncMessage(message);
                };
                TestPlayer.prototype._onWorkerMessage = function (e) {
                    var data = e.data;
                    if (typeof data !== 'object' || data === null) {
                        return;
                    }
                    switch (data.type) {
                        case 'gfx':
                            var updates = DataBuffer.FromArrayBuffer(e.data.updates.buffer);
                            this.processUpdates(updates, e.data.assets);
                            break;
                        case 'externalCallback':
                            this.processExternalCallback(data.request);
                            e.handled = true;
                            return;
                        case 'videoPlayback':
                            this.processVideoEvent(data.id, data.eventType, data.data);
                            return;
                        case 'displayParameters':
                            this.processDisplayParameters(data.params);
                            break;
                    }
                };
                TestPlayer.prototype._onSyncWorkerMessage = function (e) {
                    return this._onWorkerMessage(e);
                };
                return TestPlayer;
            })(Player);
            Test.TestPlayer = TestPlayer;
        })(Test = Player.Test || (Player.Test = {}));
    })(Player = Shumway.Player || (Shumway.Player = {}));
})(Shumway || (Shumway = {}));
var Shumway;
(function (Shumway) {
    var Player;
    (function (Player) {
        var Test;
        (function (Test) {
            var FakeSyncWorker = (function () {
                function FakeSyncWorker() {
                    this._onmessageListeners = [];
                    this._onsyncmessageListeners = [];
                }
                Object.defineProperty(FakeSyncWorker, "instance", {
                    get: function () {
                        if (!FakeSyncWorker._singelton) {
                            FakeSyncWorker._singelton = new FakeSyncWorker();
                        }
                        return FakeSyncWorker._singelton;
                    },
                    enumerable: true,
                    configurable: true
                });
                FakeSyncWorker.prototype.addEventListener = function (type, listener, useCapture) {
                    release || Shumway.Debug.assert(type === 'syncmessage' || type === 'message');
                    if (type !== 'syncmessage') {
                        this._onmessageListeners.push(listener);
                    }
                    else {
                        this._onsyncmessageListeners.push(listener);
                    }
                };
                FakeSyncWorker.prototype.removeEventListener = function (type, listener, useCapture) {
                    if (type === 'syncmessage') {
                        var i = this._onsyncmessageListeners.indexOf(listener);
                        if (i >= 0) {
                            this._onsyncmessageListeners.splice(i, 1);
                        }
                        return;
                    }
                    var i = this._onmessageListeners.indexOf(listener);
                    if (i >= 0) {
                        this._onmessageListeners.splice(i, 1);
                    }
                };
                FakeSyncWorker.prototype.postMessage = function (message, ports) {
                    var result;
                    this._onmessageListeners.some(function (listener) {
                        var ev = { data: message, result: undefined, handled: false };
                        try {
                            if (typeof listener === 'function') {
                                listener(ev);
                            }
                            else {
                                listener.handleEvent(ev);
                            }
                            if (!ev.handled) {
                                return false;
                            }
                        }
                        catch (ex) {
                            Shumway.Debug.warning('Failure at postMessage: ' + ex.message);
                        }
                        result = ev.result;
                        return true;
                    });
                    return result;
                };
                FakeSyncWorker.prototype.postSyncMessage = function (message, ports) {
                    var result;
                    this._onsyncmessageListeners.some(function (listener) {
                        var ev = { data: message, result: undefined, handled: false };
                        try {
                            if (typeof listener === 'function') {
                                listener(ev);
                            }
                            else {
                                listener.handleEvent(ev);
                            }
                            if (!ev.handled) {
                                return false;
                            }
                        }
                        catch (ex) {
                            Shumway.Debug.warning('Failure at postSyncMessage: ' + ex.message);
                        }
                        result = ev.result;
                        return true;
                    });
                    return result;
                };
                FakeSyncWorker.WORKER_PATH = '../../src/player/fakechannel.js';
                return FakeSyncWorker;
            })();
            Test.FakeSyncWorker = FakeSyncWorker;
        })(Test = Player.Test || (Player.Test = {}));
    })(Player = Shumway.Player || (Shumway.Player = {}));
})(Shumway || (Shumway = {}));
//# sourceMappingURL=player.js.map