'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _templateObject = _taggedTemplateLiteral(['<div>model: ', '</div>'], ['<div>model: ', '</div>']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var choo = require('choo');
var html = require('choo/html');

exports.createSubApp = function (view, parentApp, parentSend) {
  var subApp = undefined.createApp(function (state, prev, send) {
    return view(state, prev, parentSend || send);
  });
  subApp.parentApp = parentApp;
  return subApp;
};

exports.createApp = function (view) {
  var that = undefined;
  var app = choo({ href: false });

  app.childs = [];
  app.viewApp = true;

  app.model({
    reducers: {
      replaceState: function replaceState(state, data) {
        return data;
      }
    },
    subscriptions: {
      init: function init(send, done) {
        app.send = function (action, data) {
          return send(action, data, done);
        };

        if (view instanceof Array) {
          app.childs = view.map(function (childView) {
            return that.createSubApp(childView, app, send);
          });
        } else if ((typeof view === 'undefined' ? 'undefined' : _typeof(view)) == 'object') {
          app.childs = {};
          Object.keys(view).map(function (k) {
            var childView = view[k];
            app.childs[k] = that.createSubApp(childView, app, send);
          });
        } else {
          app.childs = [];
        }

        app.parentApp && app.parentApp.send('replaceState', {});
      }
    }
  });

  app.router({ default: '/' }, ['/', function (state, prev, send) {
    return Object.keys(app.childs).length ? html(_templateObject, JSON.stringify(state)) : view(state, prev, send);
  }]);

  app.use({
    onStateChange: function onStateChange(s) {
      var subAppsKeys = Object.keys(app.childs);
      subAppsKeys.forEach(function (subAppsKeys) {
        var subApp = app.childs[subAppsKeys];
        subApp.send && subApp.send('replaceState', s, function () {});
      });
    }
  });

  return app;
};

exports.mount = function (appEl, selector) {
  var current = document.querySelector(selector);
  while (current && current.firstChild) {
    current.firstChild.remove();
  }
  current && current.appendChild(appEl);
};