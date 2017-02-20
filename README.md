# choo-view-app
Create choo single-view app "widget". Create choo apps with child apps.


## Single view app

```js
var html = require('choo/html');
var chooViewApp = require('choo-view-app');

var app = chooViewApp.createApp((state, prev, send) => html`
  <div>
    ${state.title}
    <input oninput=${ (e)=>send('change', e.target.value,()=>{}) } />
  </div>
`);
app.model({
  state:{ title:'view app' },
  reducers:{
    change(state, data){
      return { title:data }
    }
  }
});

chooViewApp.mount(app.start(), '#chooApp');
```

After start the app you can call ```app.send```  order to call actions

## Multiple Views

```js
var html = require('choo/html')
var chooViewApp = require('choo-view-app');

var view = (state, prev, send) => html`
  <div>
    <h3>
    model: ${JSON.stringify(state)}
    </h3>

    ${state.title}
    <input oninput=${ (e)=>send('change', e.target.value,()=>{}) } />
  </div>
`

var parentApp = chooViewApp.createApp({
  subAppOne:view,
  subAppTwo:view
});

parentApp.model({
  state:{ title:'parentApp' },
  reducers:{
    change(state,data){
      return { title:data }
    }
  }
});

// must start parent app in order to have childs available
chooViewApp.mount(parentApp.start(),'.parentApp');

chooViewApp.mount(parentApp.childs.subAppOne.start(),'.childOneApp');
chooViewApp.mount(parentApp.childs.subAppTwo.start(),'.childTwoApp');
```
