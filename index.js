var choo = require('choo');
var html = require('choo/html');

exports.createSubApp = (view, parentApp, parentSend) => {
  var subApp = this.createApp((state, prev, send)=>{
    return view(state, prev, parentSend || send)
  });
  subApp.parentApp = parentApp;
  return subApp;
}

exports.createApp = (view) => {
  var that = this;
  var app = choo({href:false});

  app.childs = [];
  app.viewApp = true;

  app.model({
    reducers:{
      replaceState(state,data){
        return data;
      }
    },
    subscriptions:{
      init(send,done){
        app.send = send;

        if(view instanceof Array){
          app.childs = view.map(childView=>that.createSubApp(childView, app, send));

        }else if(typeof view == 'object'){
          app.childs = {}
          Object.keys(view).map(k=>{
            var childView = view[k];
            app.childs[k] = that.createSubApp(childView, app, send);
          });
        }else{
          app.childs = [];
        }

        app.parentApp && app.parentApp.send('replaceState',{}, ()=>{})
      }
    }
  });

  app.router({ default: '/' }, ['/', (state, prev, send)=>{
    return Object.keys(app.childs).length ? html`<div>model: ${JSON.stringify(state)}</div>`: view(state, prev, send);
  }]);

  app.use({
    onStateChange(s){
      var subAppsKeys = Object.keys(app.childs);
      subAppsKeys.forEach(function(subAppsKeys){
        var subApp = app.childs[subAppsKeys];
        subApp.send && subApp.send('replaceState',s, ()=>{});
      })
    }
  })

  return app;
}

exports.mount = (appEl, selector) => {
  var current = document.querySelector(selector);
  while(current && current.firstChild){
    current.firstChild.remove();
  }
  current && current.appendChild(appEl)
}
