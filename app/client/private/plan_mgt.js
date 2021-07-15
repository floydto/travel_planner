const tableContainer = document.querySelector("#table_get");

function stripHtml(html) {
  var tmp = document.createElement("DIV");
  tmp.innerText = html;
  return tmp.innerHTML;
}

async function loadTable() {
  const res = await fetch(`/itinerary/all`);
  console.log(res);
  const table = await res.json();
  console.log(table)
  tableContainer.innerHTML = "";

  let tableHtml = `
    
      <table class="table">
        <thead>
          <tr>
            <th scope="col" id= >#</th>
            <th scope="col">Name</th>
            <th scope="col">Date created</th>
          </tr>
        </thead>
        <tbody>`


  for (i = 0; i < table.length; i++) {
    tableHtml += `
    <tr>
    <th scope="row">${i + 1}</th>
    <td>${table[i].title}</td>
    <td>${table[i].created_at}</td>
  </tr>`
  }
  tableHtml += `
   </tbody>
      </table>
    </div>`
  tableContainer.innerHTML += tableHtml;




}
loadTable()





