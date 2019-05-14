import axios, {AxiosResponse, AxiosError} from "../../node_modules/axios/index";
import {ISensor} from "../js/ISensor"

const uri:string = "https://xn--restndopkald20190514095809-zwc.azurewebsites.net/api/n%C3%B8dopkald/"

let divElement:HTMLDivElement = <HTMLDivElement> document.getElementById("content")


function getAllSensor():void{
    
    axios.get<ISensor[]>(uri)
    .then(function(repsonse:AxiosResponse<ISensor[]>):void{

        let olElement:HTMLOListElement = document.createElement('ol');

        let x:number = 0;

        repsonse.data.forEach((sensor:ISensor) => 
        {
            x++
            if(sensor == null)
                {  
                    olElement.appendChild(CreateLiElement("NULL element", "error", x));
                }
            else
                {
                    let tekst:string = "Dato: "+sensor.dato+" Tid: "+sensor.tid+" Motion: "+sensor.motion;
                    olElement.appendChild(CreateLiElement(tekst, "r1", sensor.id));
                }
        });

        if (divElement.firstChild)
        divElement.removeChild(divElement.firstElementChild);
      
        divElement.appendChild(olElement);
    }
    )
    .catch(function (error:AxiosError):void{
            divElement.innerHTML= error.message;
    })
}

function CreateLiElement(tekst:string, classAttribut:string, id: number) : HTMLLIElement{
    
    let newLiElement = document.createElement('li');
    let newText = document.createTextNode(tekst)
    
    newLiElement.setAttribute('class',classAttribut);
    newLiElement.setAttribute('id',id.toString());
    
    newLiElement.appendChild(newText);

    return newLiElement;
}




