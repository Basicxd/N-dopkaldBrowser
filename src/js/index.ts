import axios, { AxiosResponse, AxiosError } from "../../node_modules/axios/index";
import { ISensor } from "../js/ISensor"

const uri: string = "https://xn--restndopkald20190514095809-zwc.azurewebsites.net/api/n%C3%B8dopkald/"
const alerturi: string = "https://xn--restndopkald20190514095809-zwc.azurewebsites.net/api/alert/"

let divElement: HTMLDivElement = <HTMLDivElement>document.getElementById("content")

let thisCountMyList: HTMLDivElement = <HTMLDivElement>document.getElementById("thisCountMyList")

if (thisCountMyList !== null) {
    amountofRegi()
}

let showsRoom: HTMLDivElement = <HTMLDivElement>document.getElementById("showsRoomIfGood")

if (showsRoom !== null) {
    showsRoomIfGood()
}

let buttonforAllSenosr: HTMLDivElement = <HTMLDivElement>document.getElementById("getAllSensor")

if (buttonforAllSenosr !== null) {
    getAllSensor()
}


let buttonDelete: HTMLButtonElement = <HTMLButtonElement>document.getElementById("deleteButton");
buttonDelete.addEventListener('click', deleteAllContentTable);


function getAllSensor(): void {

    axios.get<ISensor[]>(uri)
        .then(function (repsonse: AxiosResponse<ISensor[]>): void {

            let olElement: HTMLOListElement = document.createElement('ol');

            let x: number = 0;

            repsonse.data.forEach((sensor: ISensor) => {
                x++
                if (sensor == null) {
                    olElement.appendChild(CreateLiElement("NULL element", "error", x));
                }
                else {
                    let tekst: string = "Dato: " + sensor.dato + " Tid: " + sensor.tid + " Motion: " + sensor.motion;
                    olElement.appendChild(CreateLiElement(tekst, "r1", sensor.id));
                }
            });

            if (divElement.firstChild)
                divElement.removeChild(divElement.firstElementChild);

            divElement.appendChild(olElement);
        }
        )
        .catch(function (error: AxiosError): void {
            divElement.innerHTML = error.message;
        })
    // Resests the script every 1 sec
    setTimeout(getAllSensor, 1000)
}

function CreateLiElement(tekst: string, classAttribut: string, id: number): HTMLLIElement {

    let newLiElement = document.createElement('li');
    let newText = document.createTextNode(tekst)

    newLiElement.setAttribute('class', classAttribut);
    newLiElement.setAttribute('id', id.toString());

    newLiElement.appendChild(newText);

    return newLiElement;
}

function roomSwitch(s: ISensor[]): ISensor[] {

    let ListofSomething: ISensor[] = new Array;

    ListofSomething = s.sort((n1, n2) => Number(n1.motion) - Number(n2.id));

    return ListofSomething
}

function showsRoomIfGood(): void {
    axios.get<ISensor[]>(alerturi)
        .then(function (response: AxiosResponse<ISensor[]>): void {
            console.log(response);
            console.log("Show Room If good here")

            let myList: ISensor[] = new Array;
            myList = response.data;
            let sortedLis
            t = roomSwitch(myList).reverse();
            
            let counted = sortedList.length;

            showsRoom.innerHTML = "<p>" + counted + "</p>"

            // if(biggestID.motion = "Intruders here")
            // {
            //     console.log("Intruder got here")
            //     deleteAllFromAlertTable();
            // }

        })
        .catch(
            function (error: AxiosError): void {
                console.log("errrrrrror in my code")
                console.log(error);
            }
        )
        setTimeout(getAllSensor, 1000)

}

function deleteAllFromAlertTable<ISensor>(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("contentDelete");

    let delUri: string = alerturi;
    axios.delete(delUri)
        .then(
            (response: AxiosResponse) => {
                console.log(JSON.stringify(response));
                console.log("I'm in delete Alert Table")
                //output.innerHTML = response.status + " " + response.statusText;
            }
        )
        .catch(
            (error: AxiosError) => {
                output.innerHTML = error.response.statusText;
                console.log("Fejl  in delete Alert Table")
            }
        )
    console.log("Delete Working")
    setTimeout(getAllSensor, 1000)
}

function deleteAllContentTable<ISensor>(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("contentDelete");

    let delUri: string = uri;
    axios.delete(delUri)
        .then(
            (response: AxiosResponse) => {
                console.log(JSON.stringify(response));
                //output.innerHTML = response.status + " " + response.statusText;
            }
        )
        .catch(
            (error: AxiosError) => {
                output.innerHTML = error.response.statusText;
            }
        )
    console.log("Delete Working")
}



function amountofRegi(): void {
    thisCountMyList.innerHTML = "<h1>Test</h1>"
    axios.get<ISensor[]>(uri)
        .then(function (response: AxiosResponse<ISensor[]>): void {
            //console.log(response);

            let myList: ISensor[] = new Array;
            myList = response.data;
            let sortedList = roomSwitch(myList).reverse();

            let minus = sortedList.length / 2;

            thisCountMyList.innerHTML = "Amout" + minus;
        })
        .catch(
            function (error: AxiosError): void {
                console.log("errrrrrror in my code")
                //console.log(error);
            }

        )
    //console.log("Workss");

    setTimeout(showsRoomIfGood, 1000)
}

