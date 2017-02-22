const html = require('choo/html')
const chooViewApp = require('../src/index');

const view = (state, prev, send) => html`
  <div>
    <h1>${state.title}</h1>
    <input oninput=${(e)=>send('change', e.target.value)} />
  </div>
`
const app = chooViewApp.createApp(view);

app.model({
  state:{
    title:'single view app'
  },
  reducers:{
    change(state, data){
      return { title:data }
    }
  }
});

chooViewApp.mount(app.start(), '#chooApp');


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
