var choo = require('choo');
var html = require('choo/html');

exports.createSubApp = (view, parentApp) => {
  var subApp = this.createApp((state, prev, send)=>{
    return view(state, prev, parentApp.send || send)
  });
  subApp.parentApp = parentApp;
  return subApp;
}

const emptyDone = ()=>{}

exports.createApp = (view, childViews = {}) => {
  var that = this;
  var app = choo({href:false});

  app.children = {};
  app.viewApp = true;

  app.model({
    reducers:{
      chooViewAppReplaceState(state,data='default'){
        return data;
      }
    },
    subscriptions:{
      init(send,done){
        app.send = (action,data)=>{ send(action,data,emptyDone) };

        Object.keys(childViews).map(k=>{
          var childView = childViews[k];
          app.children[k] = that.createSubApp(childViews[k], app, app.send);
        });

        app.parentApp && app.parentApp.send('chooViewAppReplaceState',{})
      }
    }
  });

  app.router({ default: '/' }, ['/', (state, prev, send)=>{
    return view(state, prev, send);
  }]);

  app.use({
    onStateChange(s){
      Object.keys(app.children).forEach(function(subAppsKeys){
        var subApp = app.children[subAppsKeys];
        subApp.send && subApp.send('chooViewAppReplaceState',s);
      })
    }
  })

  return app;
}

exports.group = (childViews)=>this.createApp(()=>html`<div></div>`,childViews);

exports.mount = (appEl, selector) => {
  const go = () => {
    var current = document.querySelector(selector);
    while(current && current.firstChild){
      current.firstChild.remove();
    }
    current && current.appendChild(appEl)
    console.log('go')
  }

  (document.readyState === "interactive" || document.readyState === "complete") ?
    go() : document.addEventListener('DOMContentLoaded', go);
}
