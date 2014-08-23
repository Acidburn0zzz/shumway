/* -*- Mode: js; js-indent-level: 2; indent-tabs-mode: nil; tab-width: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */
/*
 * Copyright 2013 Mozilla Foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


module Shumway.SWF {
  import SWFTag = Shumway.SWF.Parser.SWFTag;
  import createSoundStream = Shumway.SWF.Parser.createSoundStream;

  declare class FileReaderSync {
    readAsArrayBuffer(request):ArrayBuffer;
  }

  function defineSymbol(swfTag, symbols) {
    var symbol;

    switch (swfTag.code) {
      case SWFTag.DEFINE_BITS:
      case SWFTag.DEFINE_BITS_JPEG2:
      case SWFTag.DEFINE_BITS_JPEG3:
      case SWFTag.DEFINE_BITS_JPEG4:
      case SWFTag.JPEG_TABLES:
        symbol = Shumway.SWF.Parser.defineImage(swfTag, symbols);
        break;
      case SWFTag.DEFINE_BITS_LOSSLESS:
      case SWFTag.DEFINE_BITS_LOSSLESS2:
        symbol = Shumway.SWF.Parser.defineBitmap(swfTag);
        break;
      case SWFTag.DEFINE_BUTTON:
      case SWFTag.DEFINE_BUTTON2:
        symbol = Shumway.SWF.Parser.defineButton(swfTag, symbols);
        break;
      case SWFTag.DEFINE_EDIT_TEXT:
        symbol = Shumway.SWF.Parser.defineText(swfTag, symbols);
        break;
      case SWFTag.DEFINE_FONT:
      case SWFTag.DEFINE_FONT2:
      case SWFTag.DEFINE_FONT3:
      case SWFTag.DEFINE_FONT4:
        symbol = Shumway.SWF.Parser.defineFont(swfTag, symbols);
        break;
      case SWFTag.DEFINE_MORPH_SHAPE:
      case SWFTag.DEFINE_MORPH_SHAPE2:
      case SWFTag.DEFINE_SHAPE:
      case SWFTag.DEFINE_SHAPE2:
      case SWFTag.DEFINE_SHAPE3:
      case SWFTag.DEFINE_SHAPE4:
        symbol = Shumway.SWF.Parser.defineShape(swfTag, symbols);
        break;
      case SWFTag.DEFINE_SOUND:
        symbol = Shumway.SWF.Parser.defineSound(swfTag, symbols);
        break;
      case SWFTag.DEFINE_BINARY_DATA:
        symbol = {
          type: 'binary',
          id: swfTag.id,
          // TODO: make transferable
          data: swfTag.data
        };
        break;
      case SWFTag.DEFINE_SPRITE:
        var commands = [];
        var frame:any = { type: 'frame' };
        var frames = [];
        var tags = swfTag.tags;
        var frameScripts = null;
        var frameIndex = 0;
        var soundStream = null;
        for (var i = 0, n = tags.length; i < n; i++) {
          var tag:any = tags[i];
          switch (tag.code) {
            case SWFTag.DO_ACTION:
              if (!frameScripts)
                frameScripts = [];
              frameScripts.push(frameIndex);
              frameScripts.push(tag.actionsData);
              break;
            // case SWFTag.DO_INIT_ACTION: ??
            case SWFTag.START_SOUND:
              var startSounds = frame.startSounds || (frame.startSounds = []);
              startSounds.push(tag);
              break;
            case SWFTag.SOUND_STREAM_HEAD:
              try {
                // TODO: make transferable
                soundStream = createSoundStream(tag);
                frame.soundStream = soundStream.info;
              } catch (e) {
                // ignoring if sound stream codec is not supported
                // console.error('ERROR: ' + e.message);
              }
              break;
            case SWFTag.SOUND_STREAM_BLOCK:
              if (soundStream) {
                frame.soundStreamBlock = soundStream.decode(tag.data);
              }
              break;
            case SWFTag.FRAME_LABEL:
              frame.labelName = tag.name;
              break;
            case SWFTag.PLACE_OBJECT:
            case SWFTag.PLACE_OBJECT2:
            case SWFTag.PLACE_OBJECT3:
              commands.push(tag);
              break;
            case SWFTag.REMOVE_OBJECT:
            case SWFTag.REMOVE_OBJECT2:
              commands.push(tag);
              break;
            case SWFTag.SHOW_FRAME:
              frameIndex += tag.repeat;
              frame.repeat = tag.repeat;
              frame.commands = commands;
              frames.push(frame);
              commands = [];
              frame = { type: 'frame' };
              break;
          }
        }
        symbol = {
          type: 'sprite',
          id: swfTag.id,
          frameCount: swfTag.frameCount,
          frames: frames,
          frameScripts: frameScripts
        };
        break;
      case SWFTag.DEFINE_TEXT:
      case SWFTag.DEFINE_TEXT2:
        symbol = Shumway.SWF.Parser.defineLabel(swfTag, symbols);
        break;
    }

    if (!symbol) {
      return {command: 'error', message: 'unknown symbol type: ' + swfTag.code};
    }

    symbol.isSymbol = true;
    symbols[swfTag.id] = symbol;
    return symbol;
  }

  function createParsingContext(commitData) {
    var commands = [];
    var symbols = {};
    var frame:any = { type: 'frame' };
    var tagsProcessed = 0;
    var soundStream = null;
    var bytesLoaded = 0;

    return {
      onstart: function (result) {
        commitData({command: 'init', result: result});
      },
      onprogress: function (result) {
        if (result.bytesLoaded - bytesLoaded >= 65536) {
          while (bytesLoaded < result.bytesLoaded) {
            if (bytesLoaded) {
              commitData({command: 'progress', result: {
                bytesLoaded: bytesLoaded,
                bytesTotal: result.bytesTotal
              }});
            }
            bytesLoaded += 65536;
          }
        }

        var tags = result.tags;
        for (var n = tags.length; tagsProcessed < n; tagsProcessed++) {
          var tag = tags[tagsProcessed];
          if ('id' in tag) {
            var symbol = defineSymbol(tag, symbols);
            commitData(symbol, symbol.transferables);
            continue;
          }

          switch (tag.code) {
            case SWFTag.DEFINE_SCENE_AND_FRAME_LABEL_DATA:
              frame.sceneData = tag;
              break;
            case SWFTag.DEFINE_SCALING_GRID:
              var symbolUpdate = {
                isSymbol: true,
                id: tag.symbolId,
                updates: {
                  scale9Grid: tag.splitter
                }
              };
              commitData(symbolUpdate);
              break;
            case SWFTag.DO_ABC:
            case SWFTag.DO_ABC_:
              commitData({
                type: 'abc',
                flags: tag.flags,
                name: tag.name,
                data: tag.data
              });
              break;
            case SWFTag.DO_ACTION:
              var actionBlocks = frame.actionBlocks;
              if (actionBlocks)
                actionBlocks.push(tag.actionsData);
              else
                frame.actionBlocks = [tag.actionsData];
              break;
            case SWFTag.DO_INIT_ACTION:
              var initActionBlocks = frame.initActionBlocks ||
                (frame.initActionBlocks = []);
              initActionBlocks.push({spriteId: tag.spriteId, actionsData: tag.actionsData});
              break;
            case SWFTag.START_SOUND:
              var startSounds = frame.startSounds;
              if (!startSounds)
                frame.startSounds = startSounds = [];
              startSounds.push(tag);
              break;
            case SWFTag.SOUND_STREAM_HEAD:
              try {
                // TODO: make transferable
                soundStream = createSoundStream(tag);
                frame.soundStream = soundStream.info;
              } catch (e) {
                // ignoring if sound stream codec is not supported
                // console.error('ERROR: ' + e.message);
              }
              break;
            case SWFTag.SOUND_STREAM_BLOCK:
              if (soundStream) {
                frame.soundStreamBlock = soundStream.decode(tag.data);
              }
              break;
            case SWFTag.EXPORT_ASSETS:
              var exports = frame.exports;
              if (exports)
                frame.exports = exports.concat(tag.exports);
              else
                frame.exports = tag.exports.slice(0);
              break;
            case SWFTag.SYMBOL_CLASS:
              var symbolClasses = frame.symbolClasses;
              if (symbolClasses)
                frame.symbolClasses = symbolClasses.concat(tag.exports);
              else
                frame.symbolClasses = tag.exports.slice(0);
              break;
            case SWFTag.FRAME_LABEL:
              frame.labelName = tag.name;
              break;
            case SWFTag.PLACE_OBJECT:
            case SWFTag.PLACE_OBJECT2:
            case SWFTag.PLACE_OBJECT3:
              commands.push(tag);
              break;
            case SWFTag.REMOVE_OBJECT:
            case SWFTag.REMOVE_OBJECT2:
              commands.push(tag);
              break;
            case SWFTag.SET_BACKGROUND_COLOR:
              frame.bgcolor = tag.color;
              break;
            case SWFTag.SHOW_FRAME:
              frame.repeat = tag.repeat;
              frame.commands = commands;
              frame.complete = !!tag.finalTag;
              commitData(frame);
              commands = [];
              frame = { type: 'frame' };
              break;
          }
        }

        if (result.bytesLoaded === result.bytesTotal) {
          commitData({command: 'progress', result: {
            bytesLoaded: result.bytesLoaded,
            bytesTotal: result.bytesTotal
          }});
        }
      },
      oncomplete: function (result) {
        commitData(result);

        var stats;
        if (typeof result.swfVersion === 'number') {
          // Extracting stats from the context object
          var bbox = result.bbox;
          stats = {
            topic: 'parseInfo', // HACK additional field for telemetry
            parseTime: result.parseTime,
            bytesTotal: result.bytesTotal,
            swfVersion: result.swfVersion,
            frameRate: result.frameRate,
            width: (bbox.xMax - bbox.xMin) / 20,
            height: (bbox.yMax - bbox.yMin) / 20,
            isAvm2: !!result.fileAttributes.doAbc
          };
        }

        commitData({command: 'complete', stats: stats});
      },
      onexception: function (e) {
        commitData({type: 'exception', message: e.message, stack: e.stack});
      }
    };
  }

  function parseBytes(bytes, commitData) {
    Shumway.SWF.Parser.parse(bytes, createParsingContext(commitData));
  }

  interface IPostMessageCapable {
    postMessage(data: any, transferables?: Array<ArrayBuffer>);
  }

  export class ResourceLoader {
    private _subscription: any;
    private _messenger: IPostMessageCapable;

    constructor(scope, isWorker) {
      this._subscription = null;

      var self = this;
      if (!isWorker) {
        this._messenger = {
          postMessage: function (data) {
            self.onmessage({data: data});
          }
        };
      } else {
        this._messenger = scope;
        scope.onmessage = function (event) {
          self.listener(event.data);
        };
      }
    }

    terminate() {
      this._messenger = null;
      this.listener = null;
    }

    onmessage(event) {
      this.listener(event.data);
    }

    postMessage(data) {
      this.listener && this.listener(data);
    }

    listener(data) {
      if (this._subscription) {
        this._subscription.callback(data.data, data.progress);
      } else if (data === 'pipe:') {
        // progressive data loading is requested, replacing onmessage handler
        // for the following messages
        this._subscription = {
          subscribe: function (callback) {
            this.callback = callback;
          }
        };
        this.parseLoadedData(this._messenger, this._subscription);
      } else {
        this.parseLoadedData(this._messenger, data);
      }
    }

    private parseLoadedData(loader: IPostMessageCapable, request) {
      function commitData(data, transferables) {
        try {
          loader.postMessage(data, transferables);
        } catch (ex) {
          // Attempting to fix IE10/IE11 transferables by retrying without
          // Transferables.
          if (ex != 'DataCloneError') {
            throw ex;
          }
          loader.postMessage(data);
        }
      }

      if (request instanceof ArrayBuffer) {
        parseBytes(request, commitData);
      } else if ('subscribe' in request) {
        var pipe = Shumway.SWF.Parser.parseAsync(createParsingContext(commitData));
        request.subscribe(function (data, progress) {
          if (data) {
            pipe.push(data, progress);
          } else {
            pipe.close();
          }
        });
      } else if (typeof FileReaderSync !== 'undefined') {
        var readerSync = new FileReaderSync();
        var buffer = readerSync.readAsArrayBuffer(request);
        parseBytes(buffer, commitData);
      } else {
        var reader = new FileReader();
        reader.onload = function () {
          parseBytes(this.result, commitData);
        };
        reader.readAsArrayBuffer(request);
      }
    }
  }
}
