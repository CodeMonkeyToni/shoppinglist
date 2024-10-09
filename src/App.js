import './App.css';
import React from 'react';
import cart from './images/cart.svg';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

function App() {
  const appSettings = {
    databaseURL: "https://realtime-database-ebf3b-default-rtdb.europe-west1.firebasedatabase.app/"
  }

  const [itemToBeAdded, setItemToBeAdded] = React.useState("");
  const [shoppingList, setShoppingList] = React.useState([]);
  
  const app = initializeApp(appSettings);
  const database = getDatabase(app);
  const shoppingListInDB = ref(database, "shoppingList");

  React.useEffect(() => {
    onValue(shoppingListInDB, function(snapshot) {
      const data = snapshot.val();
      if (data) {
        setShoppingList(Object.entries(data))
      } else {
        setShoppingList([])
      }
    })
  }, []);

  function clearItemToBeAdded() {
    setItemToBeAdded("");
  }

  function addToCart() {
    if (itemToBeAdded.trim() !== "") {
      push(shoppingListInDB, itemToBeAdded);
      clearItemToBeAdded();
    }
  }

function handleChange(event) {
  const value = event.target.value;
  setItemToBeAdded(value);
}

function removeItem(event) {
  const id = event.target.id;
  const location = ref(database, `shoppingList/${id}`);
  remove(location);
}

const items = shoppingList.map(item => {
  return <button className="item" onClick={removeItem} id={item[0]} key={item[0]}>{item[1]}</button>
});

  return (
    <div className="site">
      <div className="main">
        <img src={cart} alt="" className="image" />
        <input className="input-field" onChange={handleChange} value={itemToBeAdded} type="text" placeholder="Bread"></input>
        <button className="add-button" onClick={addToCart}>Lisää</button>
        <div className="item-list">
          {items}
        </div>
      </div>
    </div>
  );
}

export default App;