if(window.location.pathname == "/index.html"){
  domo.get("/domo/users/v1?includeDetails=true&limit=200").then(async function(data){
    data.forEach(async function(items){
      if (items.id == domo.env.userId) {
        let user_id = domo.env.userId;
        let displayName = items.displayName;
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('user_name', displayName);
      }
    });
  });
  domo.get(`/domo/datastores/v1/collections/Ticket_Manager_Ticket_tb/documents/`).then(function(datas){
    // console.log(datas);
    let index = document.getElementById('ticket_index');
    index.script = 'dist/css/app.css';
    let html = '';
    datas.forEach(function(item, key){
      // console.log(item);
      let id = item.id;
      html = `
          <tr>
            <td class="text-center">${++key}</td>
            <td class="tdclass text-center">${item.content.Name}</td>
            <td class="tdclass text-center">${item.content.team_name}</td>
            <td class="tdclass text-center">${item.content.details}</td>
            <td class="tdclass text-center">${item.content.created_by_name}</td>
            <td class="table-report__action">
              <div class="flex justify-center items-center">
                <div id="header-icon-dropdown" class="p-5">
                  <div class="preview">
                    <div class="flex justify-center">
                      <div class="dropdown">
                        <button class="dropdown-toggle btn btn-primary" data-tw-toggle="dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" 
                            class="feather feather-menu block mx-auto"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        <div class="dropdown-menu w-80">
                          <ul class="box grey p-2">
                            <li><a class="flex items-center text-pending mr-3" id="edit_${id}" onclick="EditTicket('${id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit block" style=" height: 17px;">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            edit</a></li>
                            <br>
                            <li><a class="flex items-center text-danger ml-1 mr-3" onclick="DeleteTicket('${id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 block mr-1 mx-auto"><polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            delete</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
      `;
      index.innerHTML += html;
    });
  }); 
}

if(window.location.pathname == "/add_ticket.html"){
  domo.get(`/domo/datastores/v1/collections/Ticket_Manager_Team_tb/documents/`).then(function(datas){
    console.log(datas);
    const selectBox = document.getElementById('add_ticket_team_name');

    datas.forEach(async function(items){
      let optionElement = document.createElement('option'); 
      optionElement.value = items.content.team_name;
      optionElement.textContent = items.content.team_name;
      selectBox.appendChild(optionElement);
    });
  });
}

if(window.location.pathname == "/edit_ticket.html"){
  function getQueryParams() {
    let params = {};
    let queryString = window.location.search.slice(1);
    // console.log(queryString);
    let pairs = queryString.split('&');
    pairs.forEach(function(pair) {
        let [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
    return params;
  }

  let queryParams = getQueryParams();
  let edit = queryParams['edit'];
  let values = edit.split(',');
  console.log(values);

  domo.get(`/domo/datastores/v1/collections/Ticket_Manager_Team_tb/documents/`).then(function(datas){
    console.log(datas);
    const selectBox = document.getElementById('edit_ticket_team_name');

    datas.forEach(async function(items){
      let optionElement = document.createElement('option'); 
      optionElement.value = items.content.team_name;
      optionElement.textContent = items.content.team_name;
      if (items.content.team_name === values[2]) {
        optionElement.selected = true;
      }
      selectBox.appendChild(optionElement);
    });

  });
}

function redirectTicket() {
  let alert = document.getElementById('add_ticket_success');
  alert.style.display = "block";
  
  let Name = document.getElementById('add_ticket_ticket_name').value;
  let team_name = document.getElementById('add_ticket_team_name').value;
  let detail = document.getElementById('add_ticket_team_detail').value;
  
  // domo.get("/domo/users/v1?includeDetails=true&limit=200").then(async function(data){
  //     console.log(domo.env.userId);
  // });
  let id = localStorage.getItem('user_name');
  if(team_name == ''){
    alert('Team Name cannot be empty');
  }else if(Name == ''){
    alert('Name cannot be empty');
  }else{
    const request = {
      "content":{
        'Name': `${Name}`,
        'team_name': `${team_name}`,
        'details': `${detail}`,
        'created_by_name': `${id}`,
      }
    }
    domo.post(`/domo/datastores/v1/collections/Ticket_Manager_Ticket_tb/documents/`, request); 
    setTimeout(() => {
      window.location.href = "index.html";
    }, 3000);
  }
}

function EditTicket(id){
  domo.get(`/domo/datastores/v1/collections/Ticket_Manager_Ticket_tb/documents/${id}`).then(function(edit){
    
    let editArray = [];
    editArray.push(edit.content.Name);
    editArray.push(edit.content.details);
    editArray.push(edit.content.team_name);
    editArray.push(edit.id);
    // console.log(editArray);

    let url = `edit_ticket.html?edit=${encodeURIComponent(editArray)}`;
    window.location.href = url;
  });
}

function redirectEditTicket(update){
  // console.log(update);
  let alert = document.getElementById('edit_ticket_success');
  alert.style.display = "block";
  let Name = document.getElementById('edit_ticket_ticket_name').value;
  let detail = document.getElementById('edit_ticket_team_detail').value;
  let team_name = document.getElementById('edit_ticket_team_name').value;

  let id = localStorage.getItem('user_name');
  const request = {
    "content":{
      'Name': `${Name}`,
      'team_name': `${team_name}`,
      'details': `${detail}`,
      'created_by_name': `${id}`,
    }
  }

  domo.put(`/domo/datastores/v1/collections/Ticket_Manager_Ticket_tb/documents/${update}`, request);
  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
}

function DeleteTicket(id) {
  // console.log(id);
  let alert = document.getElementById('delete_ticket_success');
  alert.style.display = "block";
  domo.delete(`/domo/datastores/v1/collections/Ticket_Manager_Ticket_tb/documents/${id}`);
  setTimeout(() => {
    window.location.href = "index.html";
  }, 3000);
}



if(window.location.pathname == "/add_team.html"){
  domo.get("/domo/users/v1?includeDetails=true&limit=200").then(function(data){
    const selectBox = document.getElementById('add_ticket_team_member');

    data.forEach(async function(items){
      let optionElement = document.createElement('option'); 
      optionElement.value = items.displayName;
      optionElement.textContent = items.displayName;
      selectBox.appendChild(optionElement);
    });
  });
}

function redirectTeam(){
  let alert = document.getElementById('add_team_success');
  alert.style.display = "block";
  
  let team_name = document.getElementById('add_ticket_team_name').value;
  let selectElement = document.getElementById('add_ticket_team_member');
  let selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);

  let id = localStorage.getItem('user_name');

  if(team_name == ''){
    alert('Team Name cannot be empty');
  }else if(selectElement == ''){
    alert('User cannot be empty');
  }else{
    const request = {
      "content":{
        'team_name': `${team_name}`,
        'team_members': `${selectedOptions}`,
        'created_by_name': `${id}`,
      }
    }
    // console.log(request);
    domo.post(`/domo/datastores/v1/collections/Ticket_Manager_Team_tb/documents/`, request); 
    setTimeout(() => {
      window.location.href = "user_index.html";
    }, 3000);
  }
}

if(window.location.pathname == "/user_index.html"){
  domo.get(`/domo/datastores/v1/collections/Ticket_Manager_Team_tb/documents/`).then(function(datas){
    // console.log(datas);
    let index = document.getElementById('team_list');
    index.script = 'dist/css/app.css';
    let html = '';
    datas.forEach(function(item, key){
      // console.log(item);
      let id = item.id;
      let membersArray = typeof item.content.team_members === 'string' ? item.content.team_members.split(',').map(name => name.trim()) 
        : Array.isArray(item.content.team_members) ? item.content.team_members : ['N/A'];
        const maxAvatars = 3;
        let avatars = '';
        let additionalCount = 0;

        for (let i = 0; i < Math.min(membersArray.length, maxAvatars); i++) {
            let firstLetter = membersArray[i].charAt(0).toUpperCase();
            avatars += `<div class="avatar tooltip" title="${membersArray}">${firstLetter}</div>`;
        }

        if (membersArray.length > maxAvatars) {
            additionalCount = membersArray.length - maxAvatars;
            avatars += `<div class="avatar avatar-count">+${additionalCount}</div>`;
        }
      // console.log(avatars);
      html = `
          <tr>
            <td class="text-center">${++key}</td>
            <td class="tdclass text-center">${item.content.team_name}</td>
            <td class="tdclass" id="members">
              <div class="flex">
                ${avatars}
              </div>
            </td>
            <td class="tdclass text-center">${item.content.created_by_name}</td>
            <td class="table-report__action">
              <div class="flex justify-center items-center">
                <div id="header-icon-dropdown" class="p-5">
                  <div class="preview">
                    <div class="flex justify-center">
                      <div class="dropdown">
                        <button class="dropdown-toggle btn btn-primary" data-tw-toggle="dropdown">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" 
                            class="feather feather-menu block mx-auto"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                        </button>
                        <div class="dropdown-menu w-80">
                          <ul class="box grey p-2">
                            <li><a class="flex items-center text-pending mr-3" id="edit_${id}" onclick="EditTeam('${id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit block" style=" height: 17px;">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                            edit</a></li>
                            <br>
                            <li><a class="flex items-center text-danger ml-1 mr-3" onclick="DeleteTeam('${id}')">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-trash-2 block mr-1 mx-auto"><polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            delete</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
      `;
      index.innerHTML += html;
    });
  });
}