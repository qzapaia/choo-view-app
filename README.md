# choo-view-app
Create choo single-view app (widget). Create choo apps with child apps.


## Single view app

```js
const html = require('choo/html');
const chooViewApp = require('choo-view-app');

const view = (state, prev, send) => html`
  <div>
    ${state.title}
    <input oninput=${(e)=>send('change', e.target.value)} />
  </div>
`;

const app = chooViewApp.createApp(view);

app.model({
  state:{
    title:'view app'
  },
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
const html = require('choo/html')
const chooViewApp = require('choo-view-app');

const view = (state, prev, send) => html`
  <div>
    <h3>
    model: ${JSON.stringify(state)}
    </h3>

    ${state.title}
    <input oninput=${(e)=>send('change', e.target.value)} />
  </div>
`

// it could be an array also
const parentApp = chooViewApp.createApp({
  subAppOne:view,
  subAppTwo:view
});

parentApp.model({
  state:{
    title:'parentApp'
  },
  reducers:{
    change(state,data){
      return { title:data }
    }
  }
});

chooViewApp.mount(parentApp.start(),'#parentApp');

// must start parent app in order to have childs available
chooViewApp.mount(parentApp.childs.subAppOne.start(),'#childOneApp');
chooViewApp.mount(parentApp.childs.subAppTwo.start(),'#childTwoApp');
```
