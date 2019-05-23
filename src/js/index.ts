import axios, { AxiosResponse, AxiosError } from "../../node_modules/axios/index";
import { ISensor } from "../js/ISensor";

const uri: string = "https://xn--restndopkald20190514095809-zwc.azurewebsites.net/api/nødopkald"
const alerturi: string = "https://xn--restndopkald20190514095809-zwc.azurewebsites.net/api/alert"

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
buttonDelete.addEventListener('click', deleteAllContentFromNødopkald);


//Get funktionen for historik rum 1
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

// Nofikation meddelelse Kan laves bedre
function showsRoomIfGood(): void {
    axios.get<ISensor[]>(alerturi)
        .then(function (response: AxiosResponse<ISensor[]>): void {
            console.log(response);
            console.log("Show Room If good here")

            let myList: ISensor[] = new Array;
            myList = response.data;
            let notSortedList = roomSwitch(myList).reverse();
            let notstart = notSortedList[0]

            showsRoom.innerHTML = notstart.motion
            if (notstart.motion == "Intruders here") {

                deleteAllFromAlertTable();
                showsRoom.innerHTML = "<p> A Person is in the Toliet </p>"
                if (notSortedList.length > 30) {
                    alert("Go to rum one")
                    showsRoom.innerHTML = "<p> HELP IN ROOM ONE </p>"
                }
                else if (notstart.motion == "Intruders here") {
                    deleteAllFromAlertTable();
                    setTimeout(getAllSensor, 1000)
                }
            }
            else {
                showsRoom.innerHTML = "<p> No one i the Toliet </p>"
            }

        })
        .catch(
            function (error: AxiosError): void {
                console.log("errrrrrror in my code")
                console.log(error);
            }
        )

}

// Viser hvormange TolietBesøg
function amountofRegi(): void {
    axios.get<ISensor[]>(uri)
        .then(function (response: AxiosResponse<ISensor[]>): void {
            //console.log(response);
            let myList: ISensor[] = new Array;
            myList = response.data;
            let sortedList = roomSwitch(myList).reverse();

            let minus = sortedList.length / 2;

            thisCountMyList.innerHTML = "Toliet Besøg:" + minus;
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

// Delete Funktioner 
function deleteAllFromAlertTable<ISensor>(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("contentDelete2");
    axios.delete(alerturi)
        .then(
            (response: AxiosResponse) => {
                console.log(JSON.stringify(response));
            }
        )
        .catch(
            (error: AxiosError) => {
                output.innerHTML = error.response.statusText;
            }
        )
    console.log("Delete Working")
}

function deleteAllContentFromNødopkald<ISensor>(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("contentDelete");
    axios.delete(uri)
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

//Små Funktioner 
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