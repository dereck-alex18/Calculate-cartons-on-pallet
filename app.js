//Dimensions of the pallet
const palletLen = 120;
const palletWidth = 80;
const maxHeight = 225.6;
//ui elemments
const len = document.querySelector("#length");
const width = document.querySelector("#width");
const height = document.querySelector("#height");
const form = document.querySelector("#form");
const span = document.querySelectorAll("span");
const resultContainer = document.querySelector(".result");
const loadingGif = document.querySelector("#loadingGif");
const suggestionBtn = document.querySelector("#suggestionBtn");
const suggestionModal = document.querySelector("#suggestionModal");


form.addEventListener('submit', (e) => {
    e.preventDefault();
    loadingGif.style.display = "inline";
    resultContainer.style.display = "none";
    suggestionBtn.style.display = "none";
    //Wait 2 secs to display the data
    setTimeout(() => {
        loadingGif.style.display = "none";
        //check if all the values in the inputs are numbers
        if(!isNaN(len.value) && !isNaN(width.value) && !isNaN(height.value)){
            //Pass the box's dimentions to calculateBox
            const data = calculateBoxes(len.value, width.value, height.value);
            //Get the result from calculate box and pass to populate result
            populateResult(data);
            const bestArrangement = arrangementSuggestion(len.value, width.value, height.value, data[5]);
            if(bestArrangement){
                //If there's a better way to organize the boxes on the pallet, 
                //bestArrangement is passed as an argument to suggestTheBest function
                suggestTheBest(bestArrangement);
            }
        }else{
            alert("Fill all fields with numbers please!");
        }
        len.value = "";
        width.value = "";
        height.value = "";
    }, 2000);
});

const calculateBoxes = (boxLen, boxWidth, boxHeight) => {
    const data = [];
    //calculate how many box fits on a pallet as well as the maximum height
    const boxesInLen = Math.floor(palletLen / boxLen);
    const boxesInWidth = Math.floor(palletWidth / boxWidth);
    const boxesInHeight = Math.floor(maxHeight / boxHeight);
    const boxesPerStack = boxesInLen * boxesInWidth;
    const totalHeight = (boxHeight * boxesInHeight) + 14.4;
    numberOfBoxes = boxesInLen * boxesInWidth * boxesInHeight;
    //push the results to data array
    data.push(boxesInLen, boxesInWidth, boxesInHeight, totalHeight, boxesPerStack, numberOfBoxes);
    return data;
    
}

const populateResult = (data) => {
    for (let i = 0;  i < data.length; i++) {
        span[i].textContent = data[i]; 
    }
    resultContainer.style.display = "block";
}

//This method is responsible calculating if there's a better way to organize the boxes
const arrangementSuggestion = (len, width, height, data) => {
    let numberOfBoxes = data; //Get the number of box from the user's arrangement
    //Create a obj swapping length, width and height to calculate all possibilities
    const objData = [
        {
            len: height,
            width: width,
            height: len
        },
        {
            len: len,
            width: height,
            height: width
        },
        {
            len: width,
            width: len,
            height: height
        },
        {
            len: width,
            width: height,
            height: len
        },
        {
            len: height,
            width: len,
            height: width
        }
    ]
    const bestArrangement = {best: false} //This obj will contain all the data from the best arrangement
    objData.forEach(dimension => {
        //Call calculateBoxes to calculate swapped
        const boxesData = calculateBoxes(dimension.len, dimension.width, dimension.height);
       
        if(boxesData[5] > numberOfBoxes){
            //If there's a better organization, bestArrangement is populated with the updated arrangement
            numberOfBoxes = boxesData[5];
            bestArrangement.best = true;
            bestArrangement.len = dimension.len;
            bestArrangement.width = dimension.width;
            bestArrangement.height = dimension.height;
            bestArrangement.boxPerLen = boxesData[0];
            bestArrangement.boxPerWidth = boxesData[1];
            bestArrangement.boxPerHeight = boxesData[2];
            bestArrangement.maxHeight = boxesData[3];
            bestArrangement.boxesPerStack = boxesData[4];
            bestArrangement.numberOfBoxes = boxesData[5];
        }
        
    });
        if(bestArrangement.best){
            //if "best" is set to true, bestArrangement is returned
            return bestArrangement;
        }
}

const suggestTheBest = (bestArrangement) => {
    suggestionBtn.style.display = "inline-block";
    //Create the content to be shown in the modal
    const html = 
          ` <span class="close">&times;</span>
            <p>The best organization would be!</p>
            <p>Length:<span id="suggestedLen"> ${bestArrangement.len}</span> cm</p>
            <p>Width:<span id="suggestedWidth"> ${bestArrangement.width}</span> cm</p>
            <p>Height:<span id="suggestedHeight"> ${bestArrangement.height}</span> cm</p>
            <hr>
            <p>If you used this setup you would have:</p>
            <p>Cartons per length: <span id="numberBoxesLen">${bestArrangement.boxPerLen}</span></p>
            <p>Cartons per width: <span id="numberBoxesWidth">${bestArrangement.boxPerWidth}</span></p>
            <p>Cartons per height: <span id="numberBoxesHeight">${bestArrangement.boxPerHeight}</span></p>
            <p>Total height: <span id="numberBoxesWidth">${bestArrangement.maxHeight}</span> cm</p>
            <p>Boxes per stack: <span id="numberBoxesStack">${bestArrangement.boxesPerStack}</span></p>
            <p>Total number of cartons: <span id="numberOfBoxes">${bestArrangement.numberOfBoxes}</span></p>
          `
    suggestionModal.childNodes[1].innerHTML = html; //insert "html" in <div class="modal-content"</div>
}

suggestionBtn.addEventListener("click", () => {
    //If there's a better way to organize, suggestion button is displayed
    suggestionModal.style.display = "block";
});

suggestionModal.addEventListener("click", (e) => {
    //When the "x" is clicked, the modal is closed
    if(e.target.classList.contains("close")){
        
        suggestionModal.style.display = "none";
    }
    
})