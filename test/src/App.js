import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

// READ
// 컴포넌트
// props(속성) => 입력 -> 컴포넌트를 사용하는 *외부자를 위한 데이터
// return => 출력
// CREATE
// State -> (Prop와다른점)컴포넌트를 만드는 *내부자를 위한 데이터
// useState(PRIMITIVE) -> string, number, bigint, boolean, undefinde, symbol, null
// useState(Object) -> object, array
// UPDATE = CREATE + READ
// DELETE

function Article(props){
  return <article>
  <h2>{props.title}</h2>
  {props.body}
  </article>
}
function Header(props){
  // console.log('props', props, props.title)
  return <header>
    <h1><a href="/" onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}
function Nav(props){
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i];
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={envent=>{
        envent.preventDefault();
        props.onChangeMode(Number(envent.target.id));
      }}>{t.title}</a>
    </li>)
  }  
  return <nav>
    <ol>
      {lis}
    </ol>
  </nav>
}
function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder="title"/></p>
      <p><textarea name="body" placeholder='body'></textarea></p>
      <p><input type='submit' value="Create"></input></p>
    </form>
  </article>
}
function Update(props){
  // state로 환승(setTitle, setBody)
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);

    }}>
      {/* onChange => 값을 입력할때마다 호출됨 */}
      <p><input type="text" name="title" placeholder="title" value={title} onChange={event=>{
        // console.log(event.target.value);
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name="body" placeholder='body' value={body} onChange={event=>{
        setBody(event.target.value);
      }}/></p>
      <p><input type='submit' value="Update"></input></p>
    </form>
  </article>
}
function App() {
  // useState
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'javascript', body:'javascript is ...'}
  ]);
  let content = null;
  let contextControl = null;
  if(mode === 'WELCOME') {
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if(mode === 'READ'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      // console.log(topics[i].id, id);
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    // content = <Article title="Read" body="Hello, Read"></Article>
    content = <Article title={title} body={body}></Article>
    contextControl = <>
      <li><a href={'/update/'+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      {/* Delete */}
      <li><input type="button" value="Delete" onClick={()=>{
        const newTopics = []
        for(let i=0; i<topics.length; i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME');
      }} /></li>
    </>
  } else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      // 렌더링
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      //
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0; i<topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      // console.log(title, body);
      const newTopics = [...topics]
      const updatedTopic = {id:id, title:title, body:body}
      for(let i=0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  return (
    <div>
      <Header title="WEB" onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
        setMode('READ');
        setId(_id);
      }}></Nav>
      {content}
      {/* <ul></ul> 태그로 목록화 */}
      <ul> 
        <li><a href="/create" onClick={event=>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a></li>
        {contextControl}
      </ul>
    </div>
  );
}

export default App;
