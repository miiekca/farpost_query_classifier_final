import Header from "./components/Header/Header"
import Input from "./components/Input/Input"
import Button from "./components/Button/Button"
import ButtonGet from "./components/Button/ButtonGet"
import HeaderTrain from "./components/Header/HeaderTrain"
import DocumentationTrain from "./components/DocumentationTrain/DocumentationTrain"
import Answer from "./components/Answer"
import AnswerCustom from "./components/AnswerCustom"
import DocumentationAPI from "./components/DocumentationAPI/DocumentationAPI"
import axios from 'axios'
import './App.css'
import { useState, useEffect } from "react"
import { Helmet } from "react-helmet"

import { Spin } from 'antd';

export default function App() {


  const [query, setQuery] = useState('')
  const [answer, setAnswer] = useState([])
  const [pageId, setPageId] = useState(0)
  const [trainData, setTraindata] = useState(null)
  const [model, setModel] = useState('')
  const [answerCustom, setAnswerCustom] = useState([])
  const [istrain, setIstrain] = useState(1)
  const [isGet, setIsGet] = useState(1)
  const [accuracy, setAccuracy] = useState([])
  let port = '/api'
  //let port = 'http://0.0.0.0:8000' // for devepol

  //console.log(answer)

  useEffect(() => {
    // Создадим элемент <link> для favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = './favicon.ico'; // Путь к вашей иконке
    document.head.appendChild(link);

    // Опционально: если вы хотите удалить иконку при размонтировании компонента
    return () => {
      document.head.removeChild(link);
    };
  }, []);


  function onChange(e) {
    // console.log(e.target.value)
    setQuery(e.target.value)
  }

  function onClick() {

    setIsGet(2)
    axios.post(`${port}/getAnswer?quastion=${query}'`).then(responce => {
      // answer.map((answ) => (<Answer props={answ} />))

      // console.log(responce.data.answer)
      setAnswer(responce.data.answer)
      // console.log('resp:', answer)
      // console.log('finish')


    })
    console.log('Button clicked')
    setIsGet(1)
  }

  function onClickMenu1() {
    // console.log('PageButton1')
    setPageId(0)
  }

  function onClickMenu2() {
    // console.log('PageButton2')
    setPageId(1)
  }

  function onChangeFile(event) {
    // console.log('change file')
    // setTraindata(e.targer.files[0])

    //console.log(event.target.files[0])
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          //console.log('json', jsonData)
          setTraindata(jsonData)
        } catch (error) {
          console.error("Error with open file", error);
        }
      };
      reader.readAsText(file)
    }
    // console.log('train', trainData)
  }

  function onChangeModel(e) {
    setModel(e.target.value)
  }

  function onClickSendTrain() {
    setIstrain(2)
    setAnswerCustom([1, 2])
    console.log('train')

    axios.post(`${port}/trainModel?model=${model}`, trainData).then(responce => {
      //console.log(responce.data)
      setAnswerCustom(responce.data.predicted)
      setAccuracy(responce.data.accuracy)
      //console.log('custom', answerCustom)
      setIstrain(3)
    })

  }
  return (

    <body>
      <link rel="icon" href="./vite.svg" type="image/svg"></link>
      <Helmet title="FQC" />
      <div>
        <div className="top">
          <Header />
          <div className="menu-buttons-container">
            <Button isActive={pageId == 0} props='Query' onClick={onClickMenu1} />
            <Button isActive={pageId == 1} props='Make model' onClick={onClickMenu2} />
          </div>
        </div>
        {pageId == 0 ? <div>
          <div className="input-area">
            <Input onChange={onChange} onClick={onClick} />
          </div>
          {isGet == 2 ? <Spin /> : <div><p><Answer answerdata={answer} /></p></div>}
          <div className="for-docs">
            <DocumentationAPI />
          </div>
        </div> :
          <div>
            <HeaderTrain />
            <div className="">
              <div className="field">
                <input type="file" accept=".json" onChange={onChangeFile}></input>
              </div>
              <div className="field">
                <input onChange={onChangeModel} placeholder="write model..."></input>
              </div>
              <div className="field">
                <ButtonGet props="Start train" onClick={onClickSendTrain} />
              </div>
              <div>
                {istrain == 2 ? <div className="wait-scroll"> <Spin size="large" /> </div>
                  :
                  <div>
                    <div className="metrics">
                      {istrain == 3 ? <p>Metrics : {JSON.stringify(accuracy)}</p> : <p></p>}
                    </div>
                    <div>{answerCustom.map((answ) => <AnswerCustom dataCustom={answ} />)}</div>
                  </div>}
              </div>


            </div>
            <DocumentationTrain />
          </div>
        }
      </div>
      {/* <div>
        <Spin />
      </div> */}
    </body>
  )
}