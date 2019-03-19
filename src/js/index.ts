let bilType = <HTMLSelectElement>document.getElementById("bilType")
let pris = <HTMLInputElement> document.getElementById("pris")
let tekst = <HTMLParagraphElement> document.getElementById("tekst")

document.getElementById("myBtn").addEventListener("click", BeregnAfgift)

function BeregnAfgift()
{
    if (bilType.value == "PersonBil") 
    {
        tekst.innerText = "Bilafgift: " + BilAfgift();
    }

    if (bilType.value == "ElBil")
    {
        tekst.innerText = "Bilafgift: " + BilAfgift() * 0.2;
    } 
}

function BilAfgift()
{
    if(pris.valueAsNumber > 200000)
    {
        return pris.valueAsNumber * 1.5 - 130000
    }
    else
    {
        return pris.valueAsNumber * 0.85;
    }
}