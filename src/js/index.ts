import axios, { AxiosResponse, AxiosError } from "../../node_modules/axios/index";
import { ISensor } from "../js/ISensor"

const uri: string = "https://xn--restndopkald20190514095809-zwc.azurewebsites.net/api/n%C3%B8dopkald/"

let divElement: HTMLDivElement = <HTMLDivElement>document.getElementById("content")

let buttonforAllSenosr: HTMLDivElement = <HTMLDivElement>document.getElementById("getAllSensor")
let showsRoom: HTMLDivElement = <HTMLDivElement>document.getElementById("showsRoomIfGood")




if (showsRoom  !== null) {
    showsRoomIfGood()
}

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
    axios.get<ISensor[]>(uri)
        .then(function (response: AxiosResponse<ISensor[]>): void {
            console.log(response);

            let myList: ISensor[] = new Array;
            myList = response.data;
            let sortedList = roomSwitch(myList).reverse();
            let biggestID = sortedList[0];
            console.log("Workss");


            if (biggestID.motion == "Intruders here") {
                divElement.innerHTML = "Rum 1: HELP!!"
            }
            else {
                divElement.innerHTML = "Rum 1: Good"
            }
        })
        .catch(
            function (error: AxiosError): void {
                console.log("errrrrrror in my code")
                console.log(error);
            }

        )
    console.log("Workss");

    setTimeout(showsRoomIfGood, 1000)
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

