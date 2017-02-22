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

After start the app you can use ```app.send``` to call actions.

## View App with children

```js
const html = require('choo/html')
const chooViewApp = require('choo-view-app');

const view = (state, prev, send) => html`
  <div>
    <h1>${state.title}</h1>
    <input oninput=${(e)=>send('change', e.target.value)} />
  </div>
`

const altView = (state, prev, send) => html`
  <div>
    <h1>${state.title}</h1>
    <h2>${state.sub}</h2>
    <input oninput=${(e)=>send('changeSub', e.target.value)} />
  </div>
`

const parentApp = chooViewApp.createApp(view, {
  subAppOne:view,
  subAppTwo:altView
});

parentApp.model({
  state:{
    title:Math.random(),
    sub:Math.random()
  },
  reducers:{
    change(state,data){
      return { title:data }
    },
    changeSub(state,data){
      return { sub:data }
    }
  }
});

chooViewApp.mount(parentApp.start(),'#parentApp');

// must start parent app in order to have chldren available.
chooViewApp.mount(parentApp.children.subAppOne.start(),'#childOneApp');
chooViewApp.mount(parentApp.children.subAppTwo.start(),'#childTwoApp');
```
