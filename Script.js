console.log("%cScript Started", "color: lightgreen");
//*Elements
const SearchButton = document.getElementById("SearchButton");
const Back = document.getElementById("Back");
const Image = document.getElementById("Image");
const Previous = document.getElementById("Previous");
const Next = document.getElementById("Next");

//*Imports
//Firebase
console.log("%cImporting ...", "color :#ffce79")
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get, push, update, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";
console.log("%cImported", "color :#b1ff79")

const firebaseConfig = {
  apiKey: "AIzaSyAhKSm9DHT4UW4hN-2oU40Dagmi4uIov58",
  authDomain: "it-project-87e1e.firebaseapp.com",
  databaseURL: "https://it-project-87e1e-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "it-project-87e1e",
  storageBucket: "it-project-87e1e.firebasestorage.app",
  messagingSenderId: "228399539362",
  appId: "1:228399539362:web:c3caa5b1215ed5652fa3fb",
  measurementId: "G-5TDG7LVJBH",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// Global Paths //*Json
let Json = {
  SuperHeros: {
    SuperHeroArray: "",
    SuperHero: "",
  },
  Errors: {
    num: 0,
  },
};
//*Global Variable
//!var parameter = urlParams.get('hero')
var SuperHero = 'Batman';
let SuperHeroArray = [];

//*Events
document.addEventListener("DOMContentLoaded", function () {
  //*Global function
  //data
  Data();
  //Page 1 Function

});
//*
async function Data() {
  //Errors
  var DataBase = ref(db, "Errors/num");
  get(DataBase).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      Json.Errors.num = data;
    }
  });
  //SuperHeroArray
  DataBase = ref(db, "SuperHeros/SuperHeroArray");
  get(DataBase).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      Json.SuperHeros.SuperHeroArray = data;

      if (location.pathname.includes("Search.html")) {
        //Search button
        SuperHeroArray = data

        const ButtonsDiv = document.getElementById('ButtonsDiv');
        const fragment = document.createDocumentFragment();

        SuperHeroArray.forEach(name => {
          const button = document.createElement('button');
          button.textContent = name;
          button.classList.add('btn');

          button.addEventListener('click', () => {
            Switch('index.html', name);
          });
          button.classList.add('Searchable')
          const hr = document.createElement('hr');
          fragment.appendChild(button);
          fragment.appendChild(hr);

          ButtonsDiv.appendChild(fragment);
        });

        document.getElementById('Searchbtn').addEventListener("click", function (event) {
          event.preventDefault(); // FIX: stop the wrapping <a> from reloading the page
          search()
        })
        document.getElementById('Search').addEventListener("keydown", function (event) {
          if (event.key === "Enter") {
            search();
          }
        });
      }
    }
  });
  //SuperHero
  DataBase = ref(db, `SuperHeros/${SuperHero}`);
  if (Object.keys(Json.SuperHeros.SuperHero).length === 0) {
    get(DataBase).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        Json.SuperHeros.SuperHero = data;
        SetData();
        if (Previous) Previous.addEventListener('click', function () {
          ImageSwitch('Previous')
        })
        if (Next) Next.addEventListener('click', function () {
          ImageSwitch('Next')
        })
      }
    });
  }
  else {
    SetData();
    if (Previous) Previous.addEventListener('click', function () {
      ImageSwitch('Previous')
    })
    if (Next) Next.addEventListener('click', function () {
      ImageSwitch('Next')
    })
  }

}
function SetData() {
  if (location.pathname.includes("index.html")) {
    //!------------------------------------------------//
    //*BackGround
    if (Json?.SuperHeros?.SuperHero?.["Other-Data"]?.bg?.Image) {
      const url = Json.SuperHeros.SuperHero["Other-Data"].bg.Image;
      document.getElementById("body").style.backgroundImage = `url('${url}')`;
    } else {
      Debbuger("Bg", 1);
    }
    //*Music
    if (Json?.SuperHeros?.SuperHero?.["Other-Data"]?.Music) {
      // FIX: this block was previously un-braced, silently gating the Name check below on Music existing
    }
    //Name
    if (SuperHero) {
      document.getElementById("Name").textContent = "Name - " + SuperHero;
    }
    // Real name -- FIX: Data -> Details (matches actual DB schema)
    if (Json?.SuperHeros?.SuperHero?.Details?.RealName) {
      const text = Json.SuperHeros.SuperHero.Details.RealName;
      const h2 = document.getElementById("RealName");
      const br = document.getElementById("Br-2")
      if (text !== 'none') {
        h2.style.display = 'block';
        h2.textContent = `Real Name - ${text}`;
        br.style.display = 'block';
      } else {
        h2.style.display = 'none';
        br.style.display = 'none';
      }
    } else {
      Debbuger("Real Name", 1);
    }
    // Company -- FIX: Data -> Details
    if (Json?.SuperHeros?.SuperHero?.Details?.Company) {
      const text = Json.SuperHeros.SuperHero.Details.Company;
      document.getElementById("Company").textContent = "Made by- " + text;
    } else {
      Debbuger("Company", 1);
    }
    // Abilities -- FIX: Data -> Details
    if (Json?.SuperHeros?.SuperHero?.Details?.Ablities) {
      const abilitiesArray = Array.isArray(Json.SuperHeros.SuperHero.Details.Ablities)
        ? Json.SuperHeros.SuperHero.Details.Ablities
        : Object.values(Json.SuperHeros.SuperHero.Details.Ablities);

      abilitiesArray.forEach((ability) => {
        const li = document.createElement("li");
        li.textContent = ability;
        document.getElementById("Ablities").appendChild(li);
      });
    } else {
      Debbuger("Ablities", 1);
    }
    //Description -- FIX: Data -> Details
    if (Json?.SuperHeros?.SuperHero?.Details?.Description) {
      const text = Json.SuperHeros.SuperHero.Details.Description
      document.getElementById('Description').textContent = `Description- ${text}`
    }
  }
}
if (location.pathname.includes('index.html')) {
  SearchButton.addEventListener('click', function () {
    Switch('Search.html', null)
  })
} else if (location.pathname.includes('Search.html')) {
  Back.addEventListener('click', function () {
    Switch('index.html', null)
  })
}

let Index = 1;

function ImageSwitch(button) {
  if (button == 'Previous') {
    Index = (Index - 1)
  }
  else if (button == 'Next') {
    Index = (Index + 1)
  }
  if (Index < 1) {
    Index = 1;
  } else if (Index > 3) {
    Index = 3;
  }

  for (let i = 1; i < 4; i++) {
    document.getElementById(`s${i}`).style.height = '20px'
    document.getElementById(`s${i}`).style.backgroundColor = 'grey'
  }
  document.getElementById(`s${Index}`).style.height = '25px'
  document.getElementById(`s${Index}`).style.backgroundColor = 'White'

  // FIX: Data -> Details
  document.getElementById('Image').src = `${Json.SuperHeros.SuperHero.Details.Img[`Img-${Index}`]}`
}
function search() {
  const Word = document.getElementById('Search').value.trim().toLowerCase();
  const heroButtons = document.querySelectorAll('#ButtonsDiv .Searchable'); // FIX: renamed from `SuperHero` to avoid shadowing the global SuperHero variable
  let anyFound = false;

  heroButtons.forEach(item => {
    const content = item.textContent.toLowerCase();
    const words = content.split(/\s+/);
    const searchWords = Word.split(/\s+/);

    let found = false;
    searchWords.forEach(searchWord => {
      if (words.some(word => word.includes(searchWord))) {
        found = true;
      }
    });

    if (found || Word === '') {
      item.style.display = 'block'; // FIX: was toggling the whole #ButtonsDiv container instead of the individual button
      anyFound = true;
    } else {
      item.style.display = 'none'; // FIX: was '##ButtonsDiv' (invalid selector, silently did nothing)
    }
  });

  const notFoundEl = document.getElementById('not-found');
  if (notFoundEl) { // FIX: guard in case the element isn't present, so this can't throw
    notFoundEl.style.display = anyFound ? 'none' : 'block';
  }
}
function Switch(Page, name) {
  SuperHero = name
  if (name !== null) {
    location.href = `${Page}?hero=${name}`;
  } else {
    location.href = `${Page}?hero=${SuperHero}`
  }
}


//*Debugger function
async function Debbuger(ErrorName, Type) {
  let num;

  const error = new Error();
  const stack = error.stack.split("\n");

  const lineNumber = stack[2] || "Unable to find";

  if (Json.Errors.num) {
    num = Json.Errors.num;
  } else {
    num = 0;
  }

  let existingErrors = [];

  try {
    const errorsSnapshot = await get(ref(db, "Errors/"));
    if (errorsSnapshot.exists()) {
      existingErrors = Object.values(errorsSnapshot.val()) || [];
    }
  } catch (error) {
    console.log("%cScript Paused", "color: Red")
    console.error("Error reading errors:", error);
    return;
  }

  const errorAlreadyExists = existingErrors.some(
    (error) => error.error === `Need fix: ${ErrorName} for ${SuperHero}`
  );

  if (errorAlreadyExists) {
    console.log(`Error for ${ErrorName} already exists, not logging again.`);
    return;
  }
  if (typeof num === "number") { // FIX: was "Number" (capital N) which typeof never returns -- this whole block never ran before
    num = 1 + num;

    if (Type === 1) {
      console.log("%cScript Paused", "color: Red")
      console.warn(`%c${ErrorName} not found at line: ${lineNumber}`, "color: Black");
      await update(ref(db, "Errors/num"), { num });
      await set(ref(db, `Errors/Error${num}`), {
        error: `Need fix: ${ErrorName} for ${SuperHero} at line: ${lineNumber}`,
        Date: new Date().toLocaleDateString("en-IN", {
          timeZone: "Asia/Kolkata",
        }),
      });
    } else {
      console.log("%cScript Paused", "color: Red")
      console.warn(`%c${ErrorName} is undefined at line: ${lineNumber}`, "color: orange");
      await update(ref(db, "Errors/num"), { num });
      await push(ref(db, `Errors/Error${num}`), {
        error: `Need fix: ${ErrorName} for ${SuperHero} at line: ${lineNumber}`,
        Date: new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", })
      });
    }
  }
}
console.log("%cScript ended", "color: lightgreen");
console.log("%cEnter Credits() to veiw additional info", "color:grey")
